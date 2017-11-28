import React, { Component } from "react";
import {
  ActivityIndicator,
  View,
  StyleSheet,
} from "react-native";
import { connect } from "react-redux";
import { TabViewAnimated, TabBar } from "react-native-tab-view";
import LangService from "../../services/langService";
import TabBarStyles from "../../styles/TabBarStyles";
import Colors from "../../styles/Colors";
import GuideList from "../shared/GuideList";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: Colors.lightGrey,
  },
  loadingContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
  tabBar: {
    backgroundColor: Colors.darkPurple,
    elevation: 8,
  },
  tabBarLabel: {
    color: Colors.white,
  },
  tabBarIndicator: {
    backgroundColor: Colors.white,
  },
});


class GuideListScreen extends Component {
  static navigationOptions = () => {
    const title = LangService.strings.APP_NAME;
    return {
      title,
      header: null,
      headerRight: null,
      ...TabBarStyles.guide,
    };
  }

  constructor(props) {
    super(props);

    const { categoryTypes } = this.props;
    const routes = [];

    categoryTypes.forEach((element) => {
      routes.push({ key: `${element.id}`, title: element.name });
    });

    this.state = {
      index: 0,
      routes,
    };
  }

  _navigateToGuide = (guide) => {
    const { navigate } = this.props.navigation;
    navigate("LocationDetailsScreen", { guide });
  }

  _handleIndexChange = index => this.setState({ index });

  _renderHeader = props => (
    <TabBar
      style={styles.tabBar}
      labelStyle={styles.tabBarLabel}
      indicatorStyle={styles.tabBarIndicator}
      {...props}
    />);

  _renderScene = ({ route }) => {
    // TODO fetch items for the correct routes
    const { guides } = this.props;
    return (<GuideList items={guides} onPress={this._navigateToGuide} />);
  }


  render() {
    const { isFetching } = this.props;

    if (isFetching) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <TabViewAnimated
        style={styles.container}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        onIndexChange={this._handleIndexChange}
      />
    );
  }
}

function mapStateToProps(state) {
  const { isFetching, items } = state.guideTypes;
  const { guides } = state;
  return {
    isFetching,
    categoryTypes: items,
    guides,
  };
}

function mapDispatchToProps() {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GuideListScreen);
