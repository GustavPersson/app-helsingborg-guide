// @flow

import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ViroARSceneNavigator } from "react-viro";
import CameraService from "../../../services/cameraService";
import LangService from "../../../services/langService";
import MarkerScene from "./MarkerScene";
import OffscreenMarkersView from "./OffscreenMarkersView";
import InstructionIllustration from "../InstructionIllustration";
import { SettingsUtils } from "../../../utils";
import styles from "./styles";

const arrivalPinImage = require("../../../images/PinArrived_2D_grayscale.png");

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
  arSupported: boolean,
};

type State = {
  cameraPermission: ?boolean,
  angle: number,
  cameraVerticalRotation: number,
};

export default class ARView extends Component<Props, State> {
  state = { cameraPermission: null, angle: 0, cameraVerticalRotation: 0 };

  componentDidMount() {
    const { arSupported } = this.props;
    if (arSupported === true) {
      CameraService.getInstance()
        .checkCameraPermissions()
        .then(() => this.setState({ cameraPermission: true }))
        .catch(() => this.setState({ cameraPermission: false }));
    } else {
      this.setState({ cameraPermission: false });
    }
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
      state: { cameraPermission, angle },
      props: { items, userLocation, activeMarker, onArMarkerPressed, offScreenMarkerViewStyle, arSupported },
    } = this;
    const hint = this.getCurrentHintText();

    if (cameraPermission !== null) {
      return (
        <View style={styles.container}>
          {cameraPermission && arSupported ? (
            <View style={styles.container}>
              <ViroARSceneNavigator
                initialScene={{ scene: MarkerScene }}
                viroAppProps={{
                  items,
                  userLocation,
                  activeMarker,
                  onArMarkerPressed,
                  onDirectionAngleChange: ({ angleDifference: newAngle, cameraVerticalRotation: newCameraVerticalRotation }) => this.setState({
                    angle: newAngle,
                    cameraVerticalRotation: newCameraVerticalRotation,
                  }),
                }}
                autofocus
                apiKey="B896B483-78EB-42A3-926B-581DD5151EE8"
                worldAlignment="GravityAndHeading"
              />
              <OffscreenMarkersView
                style={offScreenMarkerViewStyle}
                items={items}
                userLocation={userLocation}
                activeMarker={activeMarker}
                angle={angle}
                pointerEvents="none"
              />
              {hint && (
                <View style={{ ...styles.hintContainer, top: offScreenMarkerViewStyle.top + 10 }}>
                  <View style={styles.hintOverlay}>
                    <Text style={styles.hintText}>{hint}</Text>
                  </View>
                </View>
              )}
            </View>
          ) : (
            <View style={[styles.unsupportedContainer, { paddingTop: offScreenMarkerViewStyle.top }]}>
              <InstructionIllustration
                speechBubbleText={"Hoppsan".toUpperCase()}
                instructionText={
                  arSupported && !cameraPermission
                    ? LangService.strings.MESSAGE_CAMERA_PERMISSION
                    : LangService.strings[ARState.UNSUPPORTED]
                }
                image={arrivalPinImage}
              />
              {arSupported && !cameraPermission && (
                <TouchableOpacity style={styles.goToSettingsButton} onPress={() => SettingsUtils.openSettings()}>
                  <Text style={styles.goToSettingsButtonText}>{LangService.strings.SETTINGS}</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      );
    }

    return <View />;
  }
}
