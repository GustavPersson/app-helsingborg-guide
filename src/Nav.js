// @flow
import React, { Component } from "react";
import {
  AppState,
  StatusBar,
  Platform,
} from "react-native";
import {
  StackNavigator,
} from "react-navigation";
import {
  DebugScreen,
  DownloadsScreen,
  GuideScreen,
  HomeScreen,
  ImageScreen,
  CategoryListScreen,
  LocationScreen,
  ObjectScreen,
  SearchObjectScreen,
  SettingsScreen,
  SplashScreen,
  OldTrailScreen,
  TrailScreen,
  VideoScreen,
  WebScreen,
  WelcomeScreen,
} from "./components/screens";
import ViewContainer from "./components/shared/view_container";
import BottomBarView from "./components/shared/BottomBarView";
import {
  Colors,
  HeaderStyles,
} from "./styles/";
import AnalyticsUtils from "./utils/AnalyticsUtils";
import NavigatorService from "./services/navigationService";

const GuideNavigator = StackNavigator(
  {
    HomeScreen: { screen: HomeScreen },
    OldTrailScreen: { screen: OldTrailScreen },
    TrailScreen: { screen: TrailScreen },
    LocationScreen: { screen: LocationScreen },
    ObjectScreen: { screen: ObjectScreen },
    GuideDetailsScreen: { screen: GuideScreen },
    WebScreen: { screen: WebScreen },
    VideoScreen: { screen: VideoScreen },
    ImageScreen: { screen: ImageScreen },
    DownloadsScreen: { screen: DownloadsScreen },
    SettingsScreen: { screen: SettingsScreen },
    DebugScreen: { screen: DebugScreen },
    CategoryListScreen: { screen: CategoryListScreen },
  },
  { navigationOptions: HeaderStyles.default },
);

const RootNavigator = StackNavigator(
  {
    SplashScreen: { screen: SplashScreen },
    WelcomeScreen: { screen: WelcomeScreen },
    MainScreen: { screen: GuideNavigator },
    SearchObjectScreen: { screen: SearchObjectScreen },
  },
  {
    headerMode: "none",
    mode: "modal",
  },
);

const ios = Platform.OS === "ios";

type AppStateStatus = "inactive" | "active" | "background";

type Props = {
  onAppStarted(): void,
  onAppBecameActive(): void,
  onAppBecameInactive(): void,
}

export default class Nav extends Component<Props> {
  static getCurrentRouteName(navigationState) {
    if (!navigationState) {
      return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
      return Nav.getCurrentRouteName(route);
    }
    return route.routeName;
  }

  static onNavigationStateChange(prevState, currentState) {
    const currentScreen = Nav.getCurrentRouteName(currentState);
    const prevScreen = Nav.getCurrentRouteName(prevState);
    console.log(`going from ${prevScreen} to ${currentScreen}`);


    if (prevScreen !== currentScreen) {
      AnalyticsUtils.setScreen(currentScreen);
    }
  }

  componentDidMount = () => {
    this.props.onAppStarted();
    AppState.addEventListener("change", this.onAppStateChange);
  }

  onAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === "active") {
      this.props.onAppBecameActive();
    } else if (nextAppState === "inactive") {
      this.props.onAppBecameInactive();
    }
  }

  render() {
    return (
      <ViewContainer>
        <StatusBar
          translucent={ios}
          barStyle="light-content"
          backgroundColor={Colors.darkPurple}
        />
        {/* $FlowFixMe should be fixed in later flow versions */}
        <RootNavigator
          onNavigationStateChange={Nav.onNavigationStateChange}
          ref={(navigatorRef) => {
            NavigatorService.setContainer(navigatorRef);
          }}
        />
        {true ? <BottomBarView /> : null}
      </ViewContainer>
    );
  }
}
