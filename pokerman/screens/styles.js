import { StyleSheet } from "react-native";
export default styles = StyleSheet.create({
  label: {
    paddingRight: 7,
    textAlign: "right",
    width: 85
  },
  control: { flex: 1, flexDirection: "row", margin: 1, height: 40 },
  scrollView: {
    flexGrow: 1
  },
  container: {
    flex: 1,
    justifyContent: "space-between"
  },
  bigContainer: {
    padding: 10
  },
  footerContainer: {
    // justifyContent: "flex-end"
  }
});
