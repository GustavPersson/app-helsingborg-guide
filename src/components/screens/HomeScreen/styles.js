import { StyleSheet } from "react-native";
import { Colors, TextStyles } from "../../../styles";
import { StyleSheetUtils } from "../../../utils";

export default StyleSheet.create({
  viewContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
    backgroundColor: Colors.white,

  },
  container: {
    paddingHorizontal: "4%",
    backgroundColor: Colors.white,
    flex: 1,

  },
  barButtonItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.75,
    paddingHorizontal: 14,
  },
  barButtonImage: {
    maxHeight: 44,
    maxWidth: 44,
  },
  loadingSpinner: {
    height: "100%",
    width: "100%",
  },
  sectionContainer: {
    paddingVertical: 20,
  },
  sectionTitle: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily, {
      fontSize: 32,
      fontWeight: "bold",
      fontStyle: "normal",
      color: Colors.black,
    },
  ]),
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
  listItemTextContainer: {
    padding: "4%",
  },
  imageWrapper: {
    overflow: "hidden",
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  listItemImage: {
    height: "auto",
    width: "100%",
    aspectRatio: 339 / 154,
  },
  listItemTitle: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily, {
      fontSize: 18,
      fontWeight: "bold",
      fontStyle: "normal",
      color: Colors.black,
    },
  ]),
  listItemGuideCount: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily, {
      fontSize: 12,
      fontWeight: "500",
      fontStyle: "normal",
      letterSpacing: 1,
      color: Colors.warmGrey,
    },
  ]),
});
