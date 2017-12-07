import React, {
  Component,
} from "react";
import PropTypes from "prop-types";
import {
  bindActionCreators,
} from "redux";
import {
  connect,
} from "react-redux";
import * as subLocationActions from "../../actions/subLoactionActions";
import MapWithListView from "../shared/MapWithListView";

class TrailScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object, // eslint-disable-line react/require-default-props
    subLocation: PropTypes.object.isRequired,
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
        contentObject,
      });
    });
    return trailObjects;
  }

  constructor(props) {
    super(props);
    this.state = {
      subLocation: this.props.subLocation,
      trailObjects: this.props.trailObjects,
    };
  }

  locationItemFromId = (locationId) => {
    const { _embedded } = this.state.subLocation;
    const locationItem = _embedded.location.filter(item => item.id === locationId);
    return locationItem[0];
  }

  render() {
    const { trailObjects } = this.state;
    const { navigation } = this.props;
    const trailItem = trailObjects[0];
    return (
      <MapWithListView
        items={trailObjects}
        initialLocation={trailItem.location}
        navigation={navigation}
      />
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
