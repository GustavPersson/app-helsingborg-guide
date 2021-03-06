// @flow

import React, { Component } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import Home from "@shared-components/svg/home";
import Calendar from "@shared-components/svg/calendar";
import Settings from "@shared-components/svg/settings";
import styles from "./style";
import { AnalyticsUtils } from "@utils";
import NavigatorService from "@services/navigationService";
import LangService from "@services/langService";
import { Colors } from "@assets/styles";

const selectedColor: string = Colors.white;
const inactiveColor: string = Colors.themeExtra2;

function getIcon(index: number, color: string) {
  switch (index) {
    case 0:
      return (
        <View style={styles.iconView}>
          <Home color={color} />
        </View>
      );
    case 1:
      return (
        <View style={styles.iconView}>
          <Calendar color={color} />
        </View>
      );
    case 2:
      return (
        <View style={styles.iconView}>
          <Settings color={color} />
        </View>
      );
    default:
      return null;
  }
}

function getText(index: number) {
  switch (index) {
    case 0:
      return LangService.strings.HOME;
    case 1:
      return LangService.strings.CALENDAR;
    case 2:
      return LangService.strings.SETTINGS;
    default:
      return null;
  }
}

type Props = {
  index: number,
  selected: boolean,
  selectBottomBarTab: any
};

class BottomBarIcon extends Component<Props> {
  getBottomBarIcon() {
    const color = this.props.selected ? selectedColor : inactiveColor;

    const bottomBarIcon = (
      <TouchableOpacity
        style={styles.touchableIcon}
        onPress={() => this.onTouchIcon(this.props.index, this.props.selected)}
      >
        {getIcon(this.props.index, color)}
        <Text style={[styles.text, { color }]}>
          {getText(this.props.index)}
        </Text>
      </TouchableOpacity>
    );
    return bottomBarIcon;
  }

  onTouchIcon(index: number, selected: boolean) {
    if (!selected) {
      switch (index) {
        case 0:
          NavigatorService.reset("HomeScreen");
          break;
        case 1:
          NavigatorService.reset("CalendarScreen");
          AnalyticsUtils.logEvent("view_calendar");
          break;
        case 2:
          NavigatorService.reset("SettingsScreen");
          break;
        default:
          break;
      }
    }

    this.props.selectBottomBarTab(index); // dispatch
  }

  render() {
    return this.getBottomBarIcon();
  }
}

export default BottomBarIcon;
