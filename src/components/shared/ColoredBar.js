/**
 * Created by msaeed on 2017-02-04.
 */
import React, {
  Component,
} from "react";
import {
  View,
  StyleSheet,
} from "react-native";
import {
  Colors,
} from "../../styles/";

const COLORS = [Colors.lightPink, "#712082", Colors.lightPurple, Colors.darkPurple, Colors.purple];

const styles = StyleSheet.create({
  barsContainer: {
    flex: 1,
    maxWidth: 10,
  },
  bar: {
    flex: 1,
  },
});

export default class ColoredBar extends Component {
  constructor(props) {
    super(props);
    this.state = { colors: COLORS };
  }

  displayBars() {
    if (this.props.visible) {
      return this.state.colors.map((item, index) => {
        const style = { backgroundColor: item };
        return <View key={index} style={[styles.bar, style]} />;
      });
    }
    return null;
  }
  render() {
    return <View style={styles.barsContainer}>{this.displayBars()}</View>;
  }
}
