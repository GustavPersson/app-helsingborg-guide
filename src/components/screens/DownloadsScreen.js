// @flow
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
import { Colors } from "../../styles/";

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.white,
  },
  footer: {
    height: 60,
  },
});

class DownloadsScreen extends Component {
  static propTypes = {
    downloads: PropTypes.array.isRequired,
  };

  static navigationOptions = () => {
    const title = LangService.strings.OFFLINE_CONTENT;
    return {
      title,
      headerRight: null,
    };
  };

  static renderFooter = () => <View style={styles.footer} />;

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
      imageSource={{ uri: item.avatar }} // TODO: ?
      title={item.guide.name}
      progress={item.progress}
      isPaused={item.status === "paused"}
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
function mapStateToProps(state: RootState) {
  return {
    downloads: state.downloadedGuides.offlineGuides,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    downloadActions: bindActionCreators(downloadActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadsScreen);
