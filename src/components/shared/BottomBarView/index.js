// @flow

import React, { Component } from "react";

import { connect } from "react-redux";
import { View, Image, SafeAreaView } from "react-native";
import styles from "./style";
import { selectCurrentBottomBarTab } from "../../../actions/uiStateActions";
import BottomBarIcon from "../../../components/shared/BottomBarIcon";


const barBackground = require("../../../images/background-navigation.png");
const barTabLeft = require("../../../images/bottom-left.png");
const barTabCenter = require("../../../images/bottom-center.png");
const barTabRight = require("../../../images/bottom-right.png");
const barTabRightDisabled = require("../../../images/bottom-right-disabled.png");
const barTabCenterDisabled = require("../../../images/bottom-center-disabled.png");
const barTabLeftDisabled = require("../../../images/bottom-left-disabled.png");

type Props = {
  currentBottomBarTab: number,
  reachedHomeScreen: boolean,
  selectBottomBarTab(id: number): void,
}

function displayButtonTabs(currentBottomBarTab: number) {
  return (
    <View style={styles.buttonTabContainer}>
      <Image style={styles.imageTab} resizeMode="contain" source={currentBottomBarTab === 0 ? barTabLeft : barTabLeftDisabled} />
      <Image style={styles.imageTab} resizeMode="contain" source={currentBottomBarTab === 1 ? barTabCenter : barTabCenterDisabled} />
      <Image style={styles.imageTab} resizeMode="contain" source={currentBottomBarTab === 2 ? barTabRight : barTabRightDisabled} />
    </View>
  );
}


class BottomBarView extends Component<Props> {
  displayIcons(currentBottomBarTab: number) {
    return (
      <View style={styles.iconContainer}>
        <BottomBarIcon index={0} selected={currentBottomBarTab === 0} selectBottomBarTab={this.props.selectBottomBarTab} />
        <BottomBarIcon index={1} selected={currentBottomBarTab === 1} selectBottomBarTab={this.props.selectBottomBarTab} />
        <BottomBarIcon index={2} selected={currentBottomBarTab === 2} selectBottomBarTab={this.props.selectBottomBarTab} />
      </View >
    );
  }

  render() {
    if (!this.props.reachedHomeScreen) { return null; }

    return (
      <SafeAreaView style={styles.viewContainer}>
        {displayButtonTabs(this.props.currentBottomBarTab)}
        <Image
          style={styles.imageBackground}
          source={barBackground}
        />
        {this.displayIcons(this.props.currentBottomBarTab)}


      </SafeAreaView>
    );
  }
}


function mapStateToProps(state: RootState) {
  const { currentBottomBarTab, reachedHomeScreen } = state.uiState;
  return {
    currentBottomBarTab,
    reachedHomeScreen,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    selectBottomBarTab: (index: number) => dispatch(selectCurrentBottomBarTab(index)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BottomBarView);
