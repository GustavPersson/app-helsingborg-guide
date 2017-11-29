import React, { Component } from "react";
import { View, ListView, StyleSheet } from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ViewContainer from "../shared/view_container";
import downloadManager from "../../services/DownloadTasksManager";
import DownloadItemView from "../shared/DownloadItemView";
import * as downloadActions from "../../actions/downloadActions";
import LangService from "../../services/langService";
import {
  Colors,
} from "../../styles/";

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

const styles = StyleSheet.create({
  fo: {
    color: Colors.lightPink,
  },
  mainContainer: {
    backgroundColor: Colors.white,
  },
  itemsScroll: {},
});

class DownloadsScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    downloads: PropTypes.array.isRequired,
  }

  static navigationOptions = () => {
    const title = LangService.strings.OFFLINE_CONTENT;
    return {
      title,
      headerRight: null,
    };
  };

  static renderFooter = () => (
    <View style={{ height: 60 }} />
  );

  static clearCache(id) {
    downloadManager.clearCache(id);
  }

  static toggleTask(id) {
    if (downloadManager.isExist(id)) {
      const task = downloadManager.getTaskById(id);
      if (task.isCanceled) downloadManager.resumeTask(task.id);
      else downloadManager.cancelTask(task.id);
    }
  }

  // #################################################

  renderRow = item => (
    <DownloadItemView
      key={item.id}
      imageSource={{ uri: item.avatar }}
      title={item.title}
      total={item.urls.length}
      currentPos={item.currentPos}
      isCanceled={item.isCanceled}
      progress={item.currentPos / item.urls.length}
      onClosePress={() => DownloadsScreen.toggleTask(item.id)}
      onClearPress={() => DownloadsScreen.clearCache(item.id)}
    />
  );

  render() {
    return (
      <ViewContainer style={styles.mainContainer}>
        <ListView
          ref={(ref) => {
            this.itemsListView = ref;
          }}
          enableEmptySections
          dataSource={ds.cloneWithRows(this.props.downloads)}
          renderRow={this.renderRow}
          renderFooter={DownloadsScreen.renderFooter}
        />
      </ViewContainer>
    );
  }
}

// store config
function mapStateToProps(state) {
  return {
    downloads: state.downloads,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    downloadActions: bindActionCreators(downloadActions, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(DownloadsScreen);
