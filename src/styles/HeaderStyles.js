import { StyleSheet } from "react-native";
import {
  Colors,
  TextStyles,
} from "../styles/";

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: Colors.darkPurple,
    borderBottomWidth: 0,
  },
  noElevation: {
    backgroundColor: Colors.darkPurple,
    borderBottomWidth: 0,
    elevation: 0,
  },
});

const defaultHeader = {
  headerStyle: styles.headerStyle,
  headerTintColor: Colors.white,
  headerTitleStyle: TextStyles.headerTitleLabel,
  headerBackTitleStyle: TextStyles.defaultFontFamily,
  headerBackTitle: " ",
};

const noElevation = {
  headerStyle: styles.noElevation,
  headerTintColor: Colors.white,
  headerTitleStyle: TextStyles.headerTitleLabel,
  headerBackTitleStyle: TextStyles.defaultFontFamily,
  headerBackTitle: " ",
};

export default {
  default: defaultHeader,
  noElevation,
};