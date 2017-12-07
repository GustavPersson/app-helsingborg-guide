import React, { Component } from "react";
import {
  ActivityIndicator,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { connect } from "react-redux";
import { TabViewAnimated, TabBar } from "react-native-tab-view";
import { LocationUtils } from "./../../utils";
import LangService from "../../services/langService";
import Colors from "../../styles/Colors";
import GuideList from "../shared/GuideList";

const settingsIcon = require("../../images/settings.png");

const styles = StyleSheet.create({
  barButtonItem: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: Colors.lightGrey,
  },
  loadingContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
  tabBar: {
    backgroundColor: Colors.purple,
    elevation: 8,
  },
  tabBarLabel: {
    color: Colors.white,
  },
  tabBarIndicator: {
    backgroundColor: Colors.white,
  },
});


class GuideListScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const title = LangService.strings.APP_NAME;
    return {
      title,
      headerRight: null,
      headerLeft: (
        <TouchableOpacity
          onPress={() => navigation.navigate("SettingsScreen")}
          style={styles.barButtonItem}
        >
          <Image source={settingsIcon} />
        </TouchableOpacity>
      ),
    };
  }

  static getEmbeddedLocationsFromLocation(locationItem) {
    return locationItem._embedded.location;
  }

  constructor(props) {
    super(props);

    const { categoryTypes } = this.props;
    const routes = [];

    categoryTypes.forEach((element) => {
      routes.push({ key: `${element.id}`, title: element.name, categoryType: element });
    });

    this.state = {
      index: 0,
      routes,
    };
  }

  _handleIndexChange = index => this.setState({ index });

  _renderHeader = props => (
    <TabBar
      style={styles.tabBar}
      labelStyle={styles.tabBarLabel}
      indicatorStyle={styles.tabBarIndicator}
      scrollEnabled
      {...props}
    />);

  _renderScene = ({ index, route }) => {
    const { guides, locations, navigation, currentLocation } = this.props;
    const { key, categoryType } = route;

    const items = [];

    categoryType.locations.forEach((element) => {
      const loc = locations.find(l => l.id === element.id);
      items.push(loc);
    });

    const filteredGuides = guides.filter(element => element.guidetype.includes(Number(key)));

    if (currentLocation) {
      // calculate distances from current location
      const { coords } = currentLocation;
      items.forEach((element) => {
        const embeddedLocations = GuideListScreen.getEmbeddedLocationsFromLocation(element);
        element.distance = LocationUtils.getShortestDistance(coords, embeddedLocations);
      });
      items.sort((a, b) => a.distance > b.distance);
    }
    return (<GuideList items={items} navigation={navigation} />);
  }


  render() {
    const { isFetching } = this.props;

    if (isFetching) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <TabViewAnimated
        style={styles.container}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        onIndexChange={this._handleIndexChange}
      />
    );
  }
}

function mapStateToProps(state) {
  const { isFetching, items } = state.navigation;

  const guides = JSON.parse(JSON.stringify(state.subLocations.slice()));
  const locations = JSON.parse(JSON.stringify(state.guides.slice()));

  return {
    isFetching,
    categoryTypes: items,
    locations,
    guides,
    currentLocation: state.geolocation,
  };
}

export default connect(mapStateToProps)(GuideListScreen);
