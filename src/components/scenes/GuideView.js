import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, LayoutAnimation, Linking, Platform } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/MaterialIcons";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as _ from "lodash";
import ViewContainer from "../shared/view_container";
import Navbar from "../shared/navbar";
import ImageView from "../shared/image_view";
import ListItem from "../shared/list_item";
import RoundedBtn from "../shared/roundedBtnWithText";
import OptionsFloatingBtn from "../shared/OptionsFloatingBtn";
import OptionsView from "../shared/OptionsView";
import OptionsContentView from "../shared/OptionsContentView";
import LogoView from "../shared/LogoView";
import TimingService from "../../services/timingService";
import { LangService } from "../../services/langService";
import SlimNotificationBar from "../shared/SlimNotificationBar";
import NoInternetText from "../shared/noInternetText";
import * as internetActions from "../../actions/internetActions";
import * as subLocationActions from "../../actions/subLoactionActions";
import * as menuActions from "../../actions/menuActions";

const styles = StyleSheet.create({
  scrollView: {},
  imageViewContainer: { flex: 1, backgroundColor: "white" },
  bodyContainer: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: "white",
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    marginTop: 10,
  },
  title: { fontSize: 23, fontWeight: "bold", textAlign: "center" },
  logoContainer: { flex: 1, padding: 10 },
  logo: { marginVertical: 10, width: 100, height: 50 },
  articleContainer: { flex: 4, paddingHorizontal: 34, paddingVertical: 10 },
  article: { fontSize: 14, lineHeight: 20 },
  subLocationsContainer: { flex: 1, paddingVertical: 10, paddingHorizontal: 20 },
  subLocationContainer: {
    minHeight: 160,
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: "#ebebeb",
  },
  openTimeContainer: { flex: 1, paddingVertical: 20 },
  openTimeText: { fontSize: 16, fontWeight: "300", lineHeight: 19 },
  closeBtnContainer: { flex: 1, alignItems: "center", paddingVertical: 15 },
  fabBtn: { width: 40, height: 40, backgroundColor: "#D35098" },
});

class GuideView extends Component {
  static displayLogo(guideGroup) {
    const logoType = guideGroup.apperance.logotype;
    return <LogoView logoType={logoType} placeHolder={guideGroup.name} />;
  }

  static async openUrlIfValid(url) {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        return Linking.openURL(url);
      }
    } catch (error) {
      console.log("An error occured", error);
    }
    return null;
  }

  static displayComingSoon(guideGroup) {
    if (!guideGroup.settings.active) {
      return (
        <View
          style={{
            flex: 1,
            paddingVertical: 5,
            paddingHorizontal: 10,
            position: "absolute",
            bottom: 0,
            zIndex: 100,
            left: 0,
            backgroundColor: "#A84C98",
          }}
        >
          <Text style={{ fontWeight: "bold", color: "white" }}>{LangService.strings.COMING_SOON}</Text>
        </View>
      );
    }
    return null;
  }

  static displayOpeningTime(guideGroup) {
    const openingList = guideGroup._embedded.location[0].open_hours;
    const expList = guideGroup._embedded.location[0].open_hour_exceptions;
    const opening = TimingService.getOpeningHours(openingList, expList);
    const text = opening || "";
    return (
      <View style={styles.openTimeContainer}>
        <Text style={styles.openTimeText}>{text}</Text>
      </View>
    );
  }
  constructor(props) {
    super(props);

    const { guide } = this.props.navigation.state.params;

    this.state = {
      guide,
      sublocations: this.props.subLocations,
      viewArticle: !guide.settings.active,
      menuVisible: false,
      internet: this.props.internet,
    };
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.subLocations.length !== nextProps.subLocations.length) {
      this.setState({
        sublocations: nextProps.subLocations,
      });
    }

    if (nextProps.internet !== this.state.internet) this.setState({ internet: nextProps.internet });
  }

  toggleMenu() {
    this.setState({ menuVisible: !this.state.menuVisible });
  }

  closeMenu() {
    if (this.state.menuVisible) this.setState({ menuVisible: false });
  }

  _goToSubLocationScene(subLocation) {
    const { navigate } = this.props.navigation;
    navigate("SubLocationView", {
      subLocationId: subLocation.id,
    });
  }

  _goToMapView() {
    this.toggleMenu();

    const { navigate } = this.props.navigation;
    navigate("SubLocationsOnMapView", { subLocations: this.state.sublocations });
  }

  displaySubLocations() {
    if (!this.state.sublocations.length) return null;
    return this.state.sublocations.map((subLocation) => {
      if (!subLocation.guide_images || !subLocation.guide_images.length) return null;
      const forKids = subLocation.guide_kids;

      return (
        <TouchableOpacity key={subLocation.id} style={styles.subLocationContainer} onPress={() => this._goToSubLocationScene(subLocation)}>
          <ListItem
            imageSource={{ uri: subLocation.guide_images[0].sizes.medium_large }}
            content={subLocation.title.plain_text}
            checked={forKids}
          />
        </TouchableOpacity>
      );
    });
  }

  toggleArticleView() {
    this.toggleMenu();
    LayoutAnimation.easeInEaseOut();
    this.setState({ viewArticle: !this.state.viewArticle });
  }

  toggleMainMenu() {
    this.props.menuActions.toggleMenu();
  }

  displayArticle() {
    const article = (
      <View style={styles.articleContainer}>
        <Text style={{ fontSize: 19, lineHeight: 21, marginVertical: 10 }}>{`${LangService.strings.ABOUT} ${this.state.guide.name}`}</Text>
        <Text style={styles.article}>{this.state.guide.description}</Text>
      </View>
    );

    if (this.state.viewArticle) return article;
    return null;
  }

  displayFabs() {
    if (!Object.keys(this.state.guide).length) return null;

    const mapVisible = this.state.guide.settings.map && this.state.sublocations;
    const directions = (
      <RoundedBtn
        style={styles.fabBtn}
        label={LangService.strings.TAKE_ME_THERE}
        active={<Icon2 name="directions" size={20} color="white" />}
        idle={<Icon2 name="directions" size={20} color="white" />}
        onPress={() => {
          this.openGoogleMapApp(this.state.guide._embedded.location[0].latitude, this.state.guide._embedded.location[0].longitude);
        }}
      />
    );
    const info = (
      <RoundedBtn
        style={styles.fabBtn}
        label={this.state.viewArticle ? LangService.strings.CLOSE_MORE_INFO : LangService.strings.MORE_INFO}
        isActive={this.state.viewArticle}
        active={<Icon2 name="close" size={20} color="white" />}
        idle={<Icon name="info" size={20} color="white" />}
        onPress={() => this.toggleArticleView()}
      />
    );
    if (mapVisible) {
      const mapFab = (
        <RoundedBtn
          style={styles.fabBtn}
          label={LangService.strings.SHOW_MAP}
          active={<Icon name="map-marker" size={20} color="white" />}
          idle={<Icon name="map-marker" size={20} color="white" />}
          onPress={this._goToMapView.bind(this)}
        />
      );
      return (
        <OptionsContentView>
          {directions}
          {info}
          {mapFab}
        </OptionsContentView>
      );
    }
    return (
      <OptionsContentView>
        {directions}
        {info}
      </OptionsContentView>
    );
  }

  display() {
    if (this.state.guide && Object.keys(this.state.guide).length) {
      const image = this.state.guide.apperance.image;
      const uri = image.sizes.medium_large;
      const width = image.sizes["medium-large-width"];
      const height = image.sizes["medium-large-height"];
      return (
        <ViewContainer>
          <SlimNotificationBar visible={!this.state.internet} style={{ top: 0 }}>
            <NoInternetText />
          </SlimNotificationBar>

          <ScrollView style={styles.scrollView}>
            <View style={styles.imageViewContainer}>
              <ImageView source={{ uri }} width={width} height={height}>
                {GuideView.displayComingSoon(this.state.guide)}
              </ImageView>
            </View>
            <View style={styles.bodyContainer}>
              <View style={styles.titleContainer}>
                {GuideView.displayLogo(this.state.guide)}
                {GuideView.displayOpeningTime(this.state.guide)}
              </View>
              {this.displayArticle()}
              <View style={styles.subLocationsContainer}>{this.displaySubLocations()}</View>
            </View>
          </ScrollView>
        </ViewContainer>
      );
    }

    return null;
  }

  openGoogleMapApp(lat, lng) {
    const daddr = `${lat},${lng}`;

    const myPosition = this.props.geolocation;
    let saddr = "";
    if (myPosition) saddr = `${myPosition.coords.latitude},${myPosition.coords.longitude}`;

    let url = `google.navigation:q=${daddr}`;
    if (Platform.OS === "ios") url = `http://maps.apple.com/?t=m&dirflg=d&daddr=${daddr}&saddr=${saddr}`;

    GuideView.openUrlIfValid(url);
    this.toggleMenu();
  }

  render() {
    const leftBtn = (
      <TouchableOpacity style={{ flex: 1, alignItems: "center", justifyContent: "center" }} onPress={() => this.props.navigation.goBack()}>
        <Icon2 name="chevron-left" size={32} color="white" />
      </TouchableOpacity>
    );
    const rightBtn = (
      <TouchableOpacity style={{ flex: 1, alignItems: "center", justifyContent: "center" }} onPress={this.toggleMainMenu.bind(this)}>
        <Icon2 name="menu" size={20} color="white" />
      </TouchableOpacity>
    );

    return (
      <ViewContainer>
        <Navbar title={this.state.guide.name} leftButton={leftBtn} rightButton={rightBtn} backgroundColor="#7B075E" />

        <OptionsFloatingBtn onPress={this.toggleMenu} />

        <OptionsView onPress={this.closeMenu.bind(this)} visible={this.state.menuVisible}>
          {this.displayFabs()}
        </OptionsView>
        {this.display()}
      </ViewContainer>
    );
  }
}

// store config
function getFilteredSubLocations(list, parentId) {
  if (!list || !list.length) return [];
  const filtered = _.filter(list, item => item.guidegroup[0].id === parentId);
  return _.sortBy(filtered, item => item.title.plain_text);
}

function mapStateToProps(state, ownProps) {
  const { guide } = ownProps.navigation.state.params;
  return {
    subLocations: getFilteredSubLocations(state.subLocations, guide.id) || [],
    internet: state.internet.connected,
    geolocation: state.geolocation,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    subLocationActions: bindActionCreators(subLocationActions, dispatch),
    internetActions: bindActionCreators(internetActions, dispatch),
    menuActions: bindActionCreators(menuActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GuideView);
