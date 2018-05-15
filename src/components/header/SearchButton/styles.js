import { StyleSheet } from "react-native";
import { Colors, TextStyles } from "../../../styles";
import { StyleSheetUtils } from "../../../utils";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    marginHorizontal: 14,
  },
  text: StyleSheetUtils.flatten([
    TextStyles.description, {
      color: Colors.white,
      marginRight: 8,
    },
  ]),
  image: {
    height: 16,
    width: 16,
  },
});
