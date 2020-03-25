import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";

export default function MyDropDownButton(props: {
  style: any;
  label: string;
  labelStyle?: any;
  onPress: () => void;
}) {
  return (
    <RectButton style={[styles.option, props.style]} onPress={props.onPress}>
      <View style={{ flexDirection: "row" }}>
        <Text
          style={[{ flex: 1, textAlign: "center" }, props.labelStyle || {}]}
        >
          {props.label}
        </Text>
        <Text style={{ width: 10, textAlign: "right" }}>▼</Text>
      </View>
    </RectButton>
  );
}

const styles = StyleSheet.create({
  option: {
    backgroundColor: "#D1D1D1", //#fdfdfd
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderColor: "#D1D1D1",
    borderRadius: 6
  },

  optionText: {
    fontSize: 15,
    alignSelf: "flex-start",
    marginTop: 1
  }
});
