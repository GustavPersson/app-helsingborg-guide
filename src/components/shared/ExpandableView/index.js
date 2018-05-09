// @flow
import React, { type Node, Component } from "react";
import {
  Image,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import styles from "./styles";
import LangService from "../../../services/langService";

const alphaGradient = require("../../../images/gradient.png");

type Props = {
  style?: any,
  children?: Node,
  maxHeight: number,
};

type State = {
  expanded: boolean,
  overflow: boolean,
}

class ExpandableView extends Component<Props, State> {
  static defaultProps = {
    style: null,
    children: null,
  };

  state = {
    expanded: false,
    overflow: false,
  };

  onPress = () => {
    this.setState({
      expanded: !this.state.expanded,
    });
  }


  render() {
    const { expanded, overflow } = this.state;
    const { maxHeight } = this.props;
    const showCollapsed = (overflow && !expanded);
    const extraStyles = showCollapsed ? [styles.collapsed, { maxHeight }] : [];
    return (
      <TouchableWithoutFeedback
        onPress={this.onPress}
        onLayout={({ nativeEvent }) => {
          const { height } = nativeEvent.layout;
          if (height > maxHeight) {
            this.setState({ overflow: true });
          }
        }}
      >
        <View
          style={[this.props.style, ...extraStyles]}
        >
          {this.props.children}
          {showCollapsed ?
            <Image source={alphaGradient} resizeMode="stretch" style={styles.alphaGradient} />
            : null}
          {showCollapsed ?
            <Text style={styles.readMoreText}>{LangService.strings.READ_MORE}</Text>
            : null}
        </View>
      </TouchableWithoutFeedback >
    );
  }
}

export default ExpandableView;
