import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Play from "./screens/Play";
export default function App() {
  return (
    <View style={styles.container}>
      <Play />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between"
  }
});
