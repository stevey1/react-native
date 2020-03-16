import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RectButton, ScrollView } from "react-native-gesture-handler";

export default function OptionButton(props: {
  style: any;
  label: string;
  onPress: () => void;
}) {
  return (
    <RectButton style={[styles.option, props.style]} onPress={props.onPress}>
      <View style={{ flexDirection: "row" }}>
        <Text style={{ flex: 3, textAlign: "left" }}>{props.label}</Text>
        <Text style={{ flex: 1, textAlign: "right" }}>▼</Text>
      </View>
    </RectButton>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa"
  },

  option: {
    backgroundColor: "#D1D1D1", //#fdfdfd
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: "#ededed",
    borderRadius: 6
  },

  optionText: {
    fontSize: 15,
    alignSelf: "flex-start",
    marginTop: 1
  }
});
