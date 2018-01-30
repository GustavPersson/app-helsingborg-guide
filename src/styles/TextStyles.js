import {
  StyleSheet,
} from "react-native";
import {
  Colors,
} from "../styles/";

const defaultFont = {
  fontFamily: "Roboto",
};

export default StyleSheet.create({
  defaultFontFamily: {
    ...defaultFont,
  },
  body: {
    ...defaultFont,
    fontSize: 17,
    lineHeight: 23,
  },
  headerTitleLabel: {
    ...defaultFont,
    fontSize: 18,
    fontWeight: "300",
    lineHeight: 23.0,
    textAlign: "center",
    color: Colors.white,
  },
  tabBarLabel: {
    ...defaultFont,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 23.0,
    textAlign: "center",
    color: Colors.white,
  },
  comingSoonText: {
    ...defaultFont,
    fontSize: 13,
    fontWeight: "bold",
  },
  title: {
    ...defaultFont,
    fontSize: 22,
    fontWeight: "500",
    letterSpacing: 0.11,
  },
  description: {
    ...defaultFont,
    fontSize: 16,
    lineHeight: 22.0,
  },
  pointProperty: {
    ...defaultFont,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24.0,
    paddingLeft: 9,
    color: Colors.warmGrey,
  },

});
