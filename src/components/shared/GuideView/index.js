// @flow

import React, { Component } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ExpandableText from "../ExpandableText";
import styles from "./styles";
import ImageView from "../ImageView";

declare type Props = {
  guide: Guide,
  onPressContentObject(obj: ContentObject): void
}

class GuideView extends Component<Props> {
  renderContentObject = (obj: ContentObject) => {
    const { images } = obj;
    // TODO return placeholder image
    const uri = images.length > 0 ? images[0].medium : null;
    return (
      <TouchableOpacity
        key={obj.id}
        style={styles.objectContainer}
        onPress={() => this.props.onPressContentObject(obj)}
      >
        <ImageView
          source={{ uri }}
          style={styles.objectImage}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  }

  renderContentObjects = (contentObjects: ContentObject[]) => (<View style={styles.objectsContainer} >
    {contentObjects.map(item => this.renderContentObject(item))}
  </View>
  )

  render() {
    const { guide } = this.props;
    return (<ScrollView style={styles.container}>
      <ImageView source={{ uri: guide.images.large }} style={styles.image} />
      <Text>{guide.name}</Text>
      <Text style={styles.title}>{guide.name}</Text>
      {guide.tagline ? <Text >{guide.tagline}</Text> : null}
      {guide.description ? <ExpandableText style={styles.descriptionContainer} text={guide.description} /> : null}
      {this.renderContentObjects(guide.contentObjects)}
    </ScrollView>);
  }
}


export default GuideView;
