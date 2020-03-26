import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  label: {
    paddingTop: 5,
    paddingRight: 7,
    textAlign: "right",
    width: 85
  },
  label_player: {
    paddingRight: 7,
    textAlign: "right",
    paddingTop: 5,
    width: 120
  },

  control: { flexDirection: "row", margin: 1 },

  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 10
  }
});
export default styles;
