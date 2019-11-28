// @flow
import React, { Component } from "react";
import { Text, Animated, Image } from "react-native";
import * as Images from "../../../../../images/AR";
import styles from "./styles";

export type OffscreenMarkerProps = {
  id: string,
  order: number,
  x: number,
  y: number,
  angle: number,
  selected: boolean,
  visible: boolean,
};

export default class OffscreenMarker extends Component<OffscreenMarkerProps> {
  constructor(props: OffscreenMarkerProps) {
    super(props);
    this.state = {
      x: props.x,
      y: props.y,
      animatedX: new Animated.Value(0),
      animatedY: new Animated.Value(0),
      opacity: new Animated.Value(0),
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { visible, x, y } = nextProps;
    const { animatedX, animatedY, opacity, visible: previouslyVisible, x: previousX, y: previousY } = prevState;

    const newState = {};

    if (x !== previousX) {
      Animated.spring(animatedX, { toValue: x }).start();
      newState.x = x;
    }

    if (y !== previousY) {
      Animated.spring(animatedY, { toValue: y }).start();
      newState.y = y;
    }

    if ( visible !== previouslyVisible) {
      Animated.spring(opacity, { toValue: visible ? 1 : 0 }).start();
      newState.visible = visible;
    }

    return (Object.keys(newState).length > 0) ? newState : null;
  }

  render() {
    const {
      props: { id, order, selected, angle },
      state: { animatedX, animatedY, opacity },
    } = this;

    const imagePin = selected ? Images.PinSelected : Images.Pin;

    return (
      <Animated.View
        key={id}
        style={{ ...styles.marker, opacity: opacity, transform: [{ translateX: animatedX }, { translateY: animatedY }] }}
        pointerEvents="none"
      >
        <Image source={imagePin} style={{ transform: [{ rotateZ: `${angle}rad` }] }} />
        <Text style={styles.label}>{`${order + 1}`}</Text>
      </Animated.View>
    );
  }
}
