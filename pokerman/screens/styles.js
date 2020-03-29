import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  label: {
    paddingTop: 2,
    paddingRight: 7,
    textAlign: "right",
    width: 75
  },
  label_player: {
    paddingRight: 7,
    textAlign: "right",
    paddingTop: 2,
    width: 120
  },

  control: { flexDirection: "row", margin: 1 },
  textInput: {
    width: 50,
    paddingLeft: 5,
    backgroundColor: "#D1D1D1",
    borderWidth: 1,
    height: 35
  },
  button: {},
  overlay: {},
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 2,
    paddingTop: 5
  },
  text: {
    fontSize: 16
  }
});
export default styles;
