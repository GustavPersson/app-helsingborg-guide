import React, { Component } from "react";
import { Provider } from "react-redux";
import { getStoredState } from "redux-persist";
import { AppRegistry, Alert, NetInfo, UIManager, AsyncStorage, Platform, Linking } from "react-native";
import Nav from "src/Nav";
import store from "src/store/configureStore";
import { loadSubLocations } from "src/actions/subLoactionActions";
import internetChanged from "src/actions/internetActions";
import LangService from "src/services/langService";
import Opener from "src/services/SettingsService";
import { errorHappened } from "src/actions/errorActions";
import downloadManager from "src/services/DownloadTasksManager";
import FullScreenVideoScreen from "src/components/screens/FullScreenVideoScreen";
import { loadGuides } from "src/actions/guideActions";
import { fetchGuideGroups } from "src/actions/guideGroupActions";
import { fetchNavigation } from "src/actions/navigationActions";
import LocationService from "src/services/locationService";

export default class GuideHbg extends Component {
  static openInternetSettings() {
    if (Platform.OS === "android") {
      Opener.openWifiSetting();
    } else {
      Linking.openURL("app-settings:");
    }
  }

  static init() {
    LangService.loadStoredLanguage()
      .then(() => {
        // Check the network and load the content.
        GuideHbg.loadContents(LangService.code);
      })
      .catch(error => store.dispatch(errorHappened(error)));
  }

  static loadContents(langCode) {
    NetInfo.isConnected.fetch().then((isConnected) => {
      if (isConnected) {
        store.dispatch(fetchNavigation(langCode));
        store.dispatch(loadGuides(langCode)); // old guide groups
        store.dispatch(fetchGuideGroups(langCode)); // new guide groups
        store.dispatch(loadSubLocations(langCode));
        LangService.getLanguages();
      }
    });
  }

  static alert() {
    Alert.alert(
      LangService.strings.NO_INTERNET_CONNECTION,
      LangService.strings.NO_INTERNET_CONNECTION_MESSAGE,
      [
        {
          text: LangService.strings.SETTINGS,
          onPress: GuideHbg.openInternetSettings,
        },
        { text: LangService.strings.CLOSE, onPress: () => { }, style: "cancel" },
      ],
      { cancelable: false },
    );
  }

  static loadExistingDownloads() {
    getStoredState({ storage: AsyncStorage }, (err, state) => {
      if (state && state.downloads && state.downloads.length) {
        downloadManager.loadExistingTasks(state.downloads);
      }
    });
  }

  constructor() {
    super();
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    this.handleConnectivityChange = this.handleConnectivityChange.bind(this);
  }

  componentDidMount() {
    const locationService = LocationService.getInstance();
    locationService.watchGeoLocation().catch(() => {
      locationService.askForPermission().then((permission) => {
        if (permission === "granted") locationService.watchGeoLocation();
      });
    });

    LangService.loadStoredLanguage();
    this.startListeningToNetworkChanges();
    GuideHbg.loadExistingDownloads();
  }

  componentWillUnmount() {
    this.stopListeningToNetworkChanges();
  }

  startListeningToNetworkChanges() {
    NetInfo.isConnected.addEventListener("connectionChange", this.handleConnectivityChange);
  }

  stopListeningToNetworkChanges() {
    NetInfo.isConnected.removeEventListener("connectionChange", this.handleConnectivityChange);
  }

  handleConnectivityChange(isConnected) {
    if (!isConnected) {
      store.dispatch(internetChanged(false));
      this.noNetworkTimer = setTimeout(() => GuideHbg.alert(), 2500);
      return;
    }

    store.dispatch(internetChanged(true));

    if (this.noNetworkTimer) {
      clearTimeout(this.noNetworkTimer);
      this.noNetworkTimer = null;
    }

    GuideHbg.init();
  }

  render() {
    return (
      <Provider store={store}>
        <Nav />
      </Provider>
    );
  }
}

AppRegistry.registerComponent("GuideHbg", () => GuideHbg);
AppRegistry.registerComponent("VideoApp", () => FullScreenVideoScreen);
