import { StyleSheet } from "react-native";
import { Colors, TextStyles } from "../../../styles";
import { StyleSheetUtils } from "../../../utils";

export default StyleSheet.create({
  viewContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
    backgroundColor: Colors.white
  },
  container: {
    paddingHorizontal: "4%",
    backgroundColor: Colors.white,
    flex: 1
  },
  barButtonItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.75,
    paddingHorizontal: 14
  },
  barButtonImage: {
    maxHeight: 44,
    maxWidth: 44
  },
  loadingSpinner: {
    height: "100%",
    width: "100%"
  },
  sectionContainer: {
    paddingVertical: 20
  },
  sectionFooterContainer: {
    width: "100%",
    paddingBottom: "6%"
  },
  sectionFooterButton: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 45,
    backgroundColor: Colors.lightPink
  },
  sectionFooterText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 15,
      fontWeight: "bold",
      fontStyle: "normal",
      letterSpacing: 1,
      color: Colors.white
    }
  ]),
  sectionTitle: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 32,
      fontWeight: "bold",
      fontStyle: "normal",
      color: Colors.black
    }
  ]),
  sectionDescription: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 16,
      fontWeight: "normal",
      fontStyle: "normal",
      color: Colors.lightGrey
    }
  ]),
  sectionLoadingSpinner: {
    padding: 20
  }
});
