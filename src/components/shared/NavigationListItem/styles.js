import { StyleSheet } from "react-native";
import { Colors, TextStyles } from "../../../styles";
import { StyleSheetUtils } from "../../../utils";

export default StyleSheet.create({
  imageWrapper: {
    overflow: "hidden",
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  listItemContainer: {
    borderRadius: 2,
    elevation: 3,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOpacity: 0.15,
    shadowRadius: 15,
    shadowOffset: { width: 5, height: 0 },
    marginBottom: 20,
  },
  listItemGuideCount: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily, {
      fontSize: 12,
      fontWeight: "500",
      fontStyle: "normal",
      letterSpacing: 1,
      color: Colors.warmGrey,
    },
  ]),
  listItemImage: {
    height: "auto",
    width: "100%",
    aspectRatio: 339 / 154,
  },
  listItemTextContainer: {
    padding: "4%",
  },
  listItemTitle: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily, {
      fontSize: 18,
      fontWeight: "bold",
      fontStyle: "normal",
      color: Colors.black,
    },
  ]),
});
