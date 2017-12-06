import React, {
  Component,
} from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PropTypes from "prop-types";
import MapView from "react-native-maps";
import {
  bindActionCreators,
} from "redux";
import {
  connect,
} from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as subLocationActions from "../../actions/subLoactionActions";
import {
  Colors,
  TextStyles,
} from "../../styles/";
import {
  AnalyticsUtils,
  LocationUtils,
  StyleSheetUtils,
} from "../../utils/";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const defaultMargin = 20;
const listItemImageSize = 120;
const markerImageSize = 40;
const headerHeight = 65;
const mapHeight = screenHeight - listItemImageSize - headerHeight - defaultMargin;
const listItemWidth = screenWidth - (defaultMargin * 2);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  map: {
    height: mapHeight,
  },
  flatList: {
    height: listItemImageSize,
    backgroundColor: Colors.warmGrey,
  },
  listItem: {
    flexDirection: "row",
    width: listItemWidth,
    height: listItemImageSize,
    marginHorizontal: 5,
    marginVertical: 10,
    backgroundColor: Colors.white,
  },
  listImage: {
    height: listItemImageSize,
    width: listItemImageSize,
  },
  listItemTextContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    marginHorizontal: defaultMargin,
  },
  listItemTitle: StyleSheetUtils.flatten([
    TextStyles.body, {
      flexWrap: "wrap",
      fontSize: 16,
      marginRight: defaultMargin,
    },
  ]),
  listItemAddress: StyleSheetUtils.flatten([
    TextStyles.body, {
      fontSize: 16,
      marginRight: defaultMargin,
      color: Colors.warmGrey,
    },
  ]),
  markerImage: {
    width: markerImageSize,
    height: markerImageSize,
    borderRadius: markerImageSize / 2,
    borderWidth: 2.5,
    borderColor: Colors.white,
  },
  markerImageActive: {
    width: markerImageSize,
    height: markerImageSize,
    borderRadius: markerImageSize / 2,
    borderWidth: 2.5,
    borderColor: Colors.lightPink,
  },
});

class TrailScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object, // eslint-disable-line react/require-default-props
    subLocation: PropTypes.object.isRequired,
    geolocation: PropTypes.any.isRequired,
  }

  static navigationOptions = ({ navigation }) => {
    const { title } = navigation.state.params;
    return {
      title,
    };
  };

  static createTrailObjects(subLocation) {
    const { subAttractions, contentObjects } = subLocation;
    const embeddedLocations = subLocation._embedded.location;
    const trailObjects = [];

    subAttractions.forEach((item) => {
      const objectId = item.content[0];
      const locationId = item.location;

      const contentObject = contentObjects[objectId];
      const locationObject = embeddedLocations.find(location => location.id === locationId);
      const { longitude, latitude } = locationObject;

      trailObjects.push({
        id: objectId,
        location: { longitude: parseFloat(longitude), latitude: parseFloat(latitude) },
        title: contentObject.title,
        imageUrl: contentObject.image[0].sizes.medium,
        thumbnailUrl: contentObject.image[0].sizes.thumbnail,
        streetAdress: locationObject.street_address,
      });
    });
    return trailObjects;
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

  constructor(props) {
    super(props);
    this.state = {
      geolocation: this.props.geolocation,
      subLocation: this.props.subLocation,
      trailObjects: this.props.trailObjects,
      activeMarker: {},
    };
  }

  componentDidMount() {
    if (this.state.trailObjects.length) {
      setTimeout(() => {
        this.focusMarkers(this.state.trailObjects);
      }, 1000);
    }
    this.scrollToIndex(0);
  }

  focusMarkers(markers) {
    if (!markers) return;

    const padding = 50;
    const edgePadding = {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding,
    };
    const options = {
      edgePadding,
      animated: true,
    };
    console.log("Fit to corrdinates");
    this.map.fitToCoordinates(markers.map(marker => marker.location), options);
  }

  onListScroll = (e) => {
    const xOffset = e.nativeEvent.contentOffset.x;
    const fullItemWidth = listItemWidth + (defaultMargin / 2);

    const index = Math.round(Math.abs(xOffset / fullItemWidth));
    const marker = this.state.trailObjects[index];
    const { activeMarker } = this.state;

    if (marker.locationId !== activeMarker.locationId) {
      this.setState({ activeMarker: marker });
      this.map.animateToCoordinate(marker.location);
    }
  }

  onMarkerPressed = (marker) => {
    // this.setState({ activeMarker: marker });
    this.scrollToListItemWithId(marker);
  }

  scrollToListItemWithId = (marker) => {
    const index = this.state.trailObjects.findIndex(item => item.locationId === marker.locationId);
    this.scrollToIndex(index);
  }

  scrollToIndex = (index) => {
    const x = ((listItemWidth + (defaultMargin / 2)) * index) - 15;
    this.listRef.scrollToOffset({ offset: x });
  }

  onListItemPressed = (listItem) => {
    const { navigate } = this.props.navigation;
    const contentObject = this.contentObjectFromId(listItem.item.id);
    const { title, id } = contentObject;
    AnalyticsUtils.logEvent("view_object", { id, name: title });
    navigate("ObjectDetailsScreen", { title, contentObject });
  }

  onListItemDirectionsButtonPressed = (listItem) => {
    const locationItem = this.locationItemFromId(listItem.item.locationId);
    const { latitude, longitude } = locationItem;
    const directionsUrl = LocationUtils.directionsUrl(latitude, longitude, this.state.geolocation);
    TrailScreen.openUrlIfValid(directionsUrl);
  }

  locationItemFromId = (locationId) => {
    const { _embedded } = this.state.subLocation;
    const locationItem = _embedded.location.filter(item => item.id === locationId);
    return locationItem[0];
  }

  contentObjectFromId = (objectId) => {
    const { contentObjects } = this.state.subLocation;
    const contentObject = contentObjects[objectId];
    return contentObject;
  }

  renderMapMarkers() {
    const { activeMarker } = this.state;

    return this.state.trailObjects.map((trailObject) => {
      const { id, location, thumbnailUrl } = trailObject;
      const active = false;
      return (
        <MapView.Marker
          key={id}
          coordinate={location}
          identifier={id}
          onPress={() => this.onMarkerPressed(marker)}
        >
          <Image style={active ? styles.markerImageActive : styles.markerImage} source={{ uri: thumbnailUrl }} />
        </MapView.Marker>
      );
    });
  }

  getDistancefromUserLocationToLocationItem(locationItem) {
    if (!this.state.geolocation) return 0;

    const { coords } = this.state.geolocation;
    const distance = LocationUtils.getDistanceBetweenCoordinates(locationItem, coords);
    return distance;
  }

  renderRow = (listItem) => {
    const { imageUrl, streetAdress, title } = listItem.item;
    // const distance = this.getDistancefromUserLocationToLocationItem(locationItem);

    return (
      <TouchableOpacity onPress={() => this.onListItemPressed(listItem)}>
        <View style={styles.listItem}>
          {imageUrl && <Image style={styles.listImage} source={{ uri: imageUrl }} />}
          <View style={styles.listItemTextContainer}>
            <Text style={styles.listItemTitle} numberOfLines={2}>{title}</Text>
            <Text style={styles.listItemAddress}>{streetAdress}</Text>
            <TouchableOpacity onPress={() => this.onListItemDirectionsButtonPressed(listItem)}>
              <Icon name="directions" size={20} color={Colors.lightGrey} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  getItemLayout = (data, index) => (
    { length: listItemWidth, offset: (listItemWidth + (defaultMargin / 2)) * index, index }
  );

  render() {
    const { trailObjects } = this.state;
    const trailItem = trailObjects[0];
    return (
      <View style={styles.container}>
        <MapView
          ref={(ref) => { console.log("Get map ref"); this.map = ref; }}
          style={styles.map}
          showsUserLocation
          initialRegion={
            {
              latitude: trailItem.latitude,
              longitude: trailItem.longitude,
              latitudeDelta: 0.09,
              longitudeDelta: 0.06,
            }
          }
        >
          {this.renderMapMarkers()}
        </MapView>
        <FlatList
          contentInset={{ left: 10, top: 0, bottom: 0, right: 10 }}
          data={trailObjects}
          horizontal
          keyExtractor={item => item.id}
          ref={(ref) => { this.listRef = ref; }}
          renderItem={this.renderRow}
          style={styles.flatList}
          getItemLayout={this.getItemLayout}
          onScroll={this.onListScroll}
          snapToAlignment="center"
          snapToInterval={listItemWidth + 10}
          decelerationRate="fast"
          scrollEventThrottle={300}
        />
      </View>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { guide } = ownProps.navigation.state.params;

  const trailObjects = TrailScreen.createTrailObjects(guide);

  return {
    subLocation: guide,
    geolocation: state.geolocation,
    trailObjects,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    subLocationActions: bindActionCreators(subLocationActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TrailScreen);
