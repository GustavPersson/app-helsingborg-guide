// @flow
import React from "react";
import { Image, Text, TouchableOpacity } from "react-native";
import styles from "./styles";
import LangService from "../../../services/langService";

const searchIcon = require("../../../images/search-id.png");

type Props = {
  navigation: any
};

function onPress(navigation: any) {
  const { navigate } = navigation;
  navigate("SearchIdScreen");
}

const SearchButton = (props: Props) =>
  (<TouchableOpacity
    onPress={() => onPress(props.navigation)}
    style={styles.container}
  >
    <Text style={styles.text}>{LangService.strings.SEARCH_BY_NUMBER_SHORT}</Text>
    <Image style={styles.image} source={searchIcon} />
  </TouchableOpacity>);

export default SearchButton;
