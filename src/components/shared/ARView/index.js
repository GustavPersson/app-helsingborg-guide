// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, Platform } from "react-native";
import { ViroARSceneNavigator, ViroUtils } from "react-viro";
import CameraService from "../../../services/cameraService";
import LangService from "../../../services/langService";
import LocationService from "../../../services/locationService";
import MarkerScene from "./MarkerScene";
import OffscreenMarkersView from "./OffscreenMarkersView";
import styles from "./styles";

import { arriveAtDestination } from "../../../actions/arActions";
import AudioHook from "../../../hooks/AudioHook";

const { isARSupportedOnDevice } = ViroUtils;
const ios = Platform.os === "ios";

const ARState = {
  CAMERA_DISABLED: "AR_CAMERA_DISABLED",
  CHECKING: "AR_CHECKING",
  TRANSIENT: "AR_TRANSIENT",
  SUPPORTED: "AR_SUPPORTED",
  UNKNOWN: "AR_UNKNOWN",
  UNSUPPORTED: "AR_UNSUPPORTED",
};

type Props = {
  items: Array<MapItem>,
  userLocation: ?GeolocationType,
  activeMarker: MapItem,
  onArMarkerPressed: ?(index: number) => void,
  offScreenMarkerViewStyle: any,
  dispatchArriveAtDestination: Action,
};

type State = {
  arSupported: boolean,
  arState: string,
  angle: number,
  cameraVerticalRotation: number,
  initialBearing: number,
};

class ARView extends Component<Props, State> {
  state = { arSupported: false, arState: ARState.CHECKING, angle: 0, cameraVerticalRotation: 0, initialBearing: 0 };

  componentDidMount() {
    CameraService.getInstance()
      .checkCameraPermissions()
      .then(
        () => {
          this.checkSupport();
        }, // permitted
        () => {
          this.setState({ arSupported: false, arState: ARState.CAMERA_DISABLED });
        }, // not permitted
      );
    if (!ios) {
      LocationService.getInstance().getCompassBearing().then((initialBearing) => {
        this.setState({ initialBearing });
      });
    }
  }

  checkSupport() {
    const unsupportedCallback = reason => this.setState({ arSupported: false, arState: ARState[reason] });
    const supportedCallback = () => this.setState({ arSupported: true, arState: ARState.SUPPORTED });
    isARSupportedOnDevice(unsupportedCallback, supportedCallback);
  }

  getCurrentHintText = (): ?string => {
    const { angle, cameraVerticalRotation } = this.state;

    const isWithinRange = (value, min, max) => value > min && value < max;

    // Horizontal rotation
    if (angle > 20) {
      if (angle < 140) {
        return LangService.strings.AR_HINT_LOOK_LEFT;
      }
      if (angle < 220) {
        return LangService.strings.AR_HINT_TURN_AROUND;
      }
      if (angle < 340) {
        return LangService.strings.AR_HINT_LOOK_RIGHT;
      }
    }

    // Vertical rotation
    if (isWithinRange(cameraVerticalRotation, 90, 160) || isWithinRange(cameraVerticalRotation, 25, 90)) {
      return LangService.strings.AR_HINT_LOOK_UP;
    }
    if (isWithinRange(cameraVerticalRotation, 190, 270) || isWithinRange(cameraVerticalRotation, 270, 340)) {
      return LangService.strings.AR_HINT_LOOK_DOWN;
    }

    return null;
  };

  render() {
    const {
      state: { arSupported, arState, angle, initialBearing },
      props: { items, userLocation, activeMarker, onArMarkerPressed, offScreenMarkerViewStyle, dispatchArriveAtDestination },
    } = this;
    const hint = this.getCurrentHintText();

    return arSupported ? (
      <View style={styles.container}>
        <AudioHook />
        <ViroARSceneNavigator
          initialScene={{ scene: MarkerScene }}
          viroAppProps={{
            items,
            userLocation,
            activeMarker,
            initialBearing,
            onArMarkerPressed,
            onDirectionAngleChange: ({ angleDifference: newAngle, cameraVerticalRotation: newCameraVerticalRotation }) => this.setState({
              angle: newAngle,
              cameraVerticalRotation: newCameraVerticalRotation,
            }),
            dispatchArriveAtDestination,
          }}
          autofocus={false}
          apiKey="B896B483-78EB-42A3-926B-581DD5151EE8"
          worldAlignment="GravityAndHeading"
        />
        {/* <OffscreenMarkersView
          style={offScreenMarkerViewStyle}
          items={items}
          userLocation={userLocation}
          activeMarker={activeMarker}
          angle={angle}
          pointerEvents="none"
        /> */ }
        {/*hint && (
          <View style={{ ...styles.hintContainer, top: offScreenMarkerViewStyle.top + 10 }}>
            <View style={styles.hintOverlay}>
              <Text style={styles.hintText}>{hint}</Text>
            </View>
          </View>
        )*/}
      </View>
    ) : (
      <View>
        <Text>{LangService.strings[arState]}</Text>
      </View>
    );
  }
}

const mapState = () => ({});

const mapDispatch = (dispatch: Dispatch) => ({
  dispatchArriveAtDestination: (markerId: string) => dispatch(arriveAtDestination(markerId)),
});

export default connect(mapState, mapDispatch)(ARView);
