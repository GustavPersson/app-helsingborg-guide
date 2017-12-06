import React, {
  Component,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import PropTypes from "prop-types";
import MapView from "react-native-maps";
import {
  bindActionCreators,
} from "redux";
import {
  connect,
} from "react-redux";
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

  static markersFromLocation(subLocation) {
    if (!subLocation._embedded.location) return [];

    const subAttractions = subLocation.subAttractions.map(subAttractionItem => subAttractionItem.location);

    const markers = subLocation._embedded.location.map((item) => {
      if ((subAttractions.filter(sub => sub === item.id).length === 0)) { return null; }
      const marker = {
        location: {
          latitude: null,
          longitude: null,
        },
        locationId: item.id,
      };
      marker.location.latitude = parseFloat(item.latitude);
      marker.location.longitude = parseFloat(item.longitude);

      return marker;
    });

    // Remove null objects from markers (ie, is not a subAttraction location)
    const filteredMarkers = markers.filter(item => item !== null);
    return filteredMarkers;
  }

  static createTrailObjects(subAttractions) {
    return subAttractions.map((item) => {
      const trailObject = {
        objectId: item.content[0],
        locationId: item.location,
      };
      return trailObject;
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      geolocation: this.props.geolocation,
      subLocation: this.props.subLocation,
      trailObjects: TrailScreen.createTrailObjects(this.props.subLocation.subAttractions),
      markers: TrailScreen.markersFromLocation(this.props.subLocation),
      activeMarker: {},
    };
  }

  componentDidMount() {
    if (this.state.markers.length) {
      setTimeout(() => {
        this.focusMarkers(this.state.markers);
      }, 1000);
    }
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
    this.map.fitToCoordinates(markers.map(marker => marker.location), options);
  }

  onListScroll = (e) => {
    const xOffset = e.nativeEvent.contentOffset.x;
    const index = Math.abs(parseInt(xOffset / listItemWidth));
    const marker = this.state.markers[index];
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
    this.listRef.scrollToIndex({ viewPosition: 0.5, animated: true, index });
  }

  onListItemPressed = (listItem) => {
    const { navigate } = this.props.navigation;
    const contentObject = this.contentObjectFromId(listItem.item.objectId);
    const { title } = contentObject;
    AnalyticsUtils.logEvent("view_object", { id: contentObject.id, name: contentObject.title });
    navigate("ObjectDetailsScreen", { title, contentObject });
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
    const { trailObjects, activeMarker } = this.state;

    return this.state.markers.map((marker) => {
      const trailObject = trailObjects.filter(item => item.locationId === marker.locationId);
      const contentObject = this.contentObjectFromId(trailObject[0].objectId);
      const imageUrl = contentObject.image[0].sizes.thumbnail;
      const active = activeMarker.locationId === marker.locationId;
      return (
        <MapView.Marker
          key={`${marker.locationId}`}
          coordinate={marker.location}
          identifier={`${marker.locationId}`}
          onPress={() => this.onMarkerPressed(marker)}
        >
          <Image style={active ? styles.markerImageActive : styles.markerImage} source={{ uri: imageUrl }} />
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
    const { objectId, locationId } = listItem.item;
    const contentObject = this.contentObjectFromId(objectId);
    const locationItem = this.locationItemFromId(locationId);

    const imageUrl = contentObject.image[0].sizes.medium;
    const { street_address } = locationItem;
    const { id, title } = contentObject;

    const distance = this.getDistancefromUserLocationToLocationItem(locationItem);

    return (
      <TouchableOpacity onPress={() => this.onListItemPressed(listItem)}>
        <View style={styles.listItem}>
          {imageUrl && <Image style={styles.listImage} source={{ uri: imageUrl }} />}
          <View style={styles.listItemTextContainer}>
            <Text style={styles.listItemTitle} numberOfLines={2}>{title}</Text>
            <Text style={styles.listItemAddress}>{street_address}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  getItemLayout = (data, index) => (
    { length: listItemWidth, offset: (listItemWidth + 10) * index, index }
  );

  render() {
    const { trailObjects } = this.state;
    const locationItem = this.locationItemFromId(trailObjects[0].locationId);
    return (
      <View style={styles.container}>
        <MapView
          ref={(ref) => { this.map = ref; }}
          style={styles.map}
          showsUserLocation
          initialRegion={
            {
              latitude: parseFloat(locationItem.latitude),
              longitude: parseFloat(locationItem.longitude),
              latitudeDelta: 0.09,
              longitudeDelta: 0.06,
            }
          }
        >
          {this.renderMapMarkers()}
        </MapView>
        <FlatList
          data={trailObjects}
          horizontal
          keyExtractor={item => `i${item.locationId}-${item.objectId}`}
          ref={(ref) => { this.listRef = ref; }}
          renderItem={this.renderRow}
          style={styles.flatList}
          getItemLayout={this.getItemLayout}
          onScroll={this.onListScroll}
          snapToAlignment="center"
          snapToInterval={listItemWidth + 10}
          decelerationRate="fast"
        />
      </View>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { guide } = ownProps.navigation.state.params;
  return {
    subLocation: guide,
    geolocation: state.geolocation,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    subLocationActions: bindActionCreators(subLocationActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TrailScreen);
