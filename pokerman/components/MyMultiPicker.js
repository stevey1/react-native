import React, { useState } from "react";
import { CheckBox, Button, Overlay } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { View } from "react-native";
// import CheckBox from "./CheckBox";
import i18n from "../i18n";

export default function MyMultiPicker(props) {
  const [Selected, setSelected] = useState(
    props.listItems.map(item => props.values.includes(item.value))
  );

  const onChange = index => {
    if (
      props.hightlightValue &&
      props.listItems[index].value === props.hightlightValue
    )
      return;
    const selected = [...Selected];
    selected[index] = !selected[index];

    setSelected(selected);
  };
  const submitItems = () => {
    const selectedIndexes = Selected.map((value, index) => ({ value, index }))
      .filter(item => item.value)
      .map(item => item.index);
    props.itemsSelected(selectedIndexes);
  };
  const getCheckBoxes = countPerRow => {
    let control = [];
    const rows = Math.ceil(props.listItems.length / countPerRow);
    for (let r = 0; r < rows; r++) {
      let row = [];

      for (
        let i = r * countPerRow;
        i < (r + 1) * countPerRow && i < props.listItems.length;
        i++
      ) {
        row.push(
          <CheckBox
            key={"c" + i}
            checked={Selected[i]}
            onPress={() => onChange(i)}
            title={props.listItems[i].text}
            textStyle={
              props.hightlightValue &&
              props.listItems[i].value === props.hightlightValue
                ? { color: "#ff0000" }
                : {}
            }
            containerStyle={{
              margin: 0,
              borderColor: "#F5F5F5",
              backgroundColor: "#F5F5F5"
            }}
          ></CheckBox>
        );
      }
      control.push(
        <View key={"m" + r} style={{ flexDirection: "row" }}>
          {row}
        </View>
      );
    }
    return control;
  };

  return (
    <Overlay
      overlayBackgroundColor="#F5F5F5"
      width="90%"
      height="80%"
      isVisible={props.modalVisible}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View>{getCheckBoxes(1)}</View>
          <Button
            buttonStyle={{
              backgroundColor: "#D1D1D1"
            }}
            title={i18n.t("button.return")}
            titleStyle={{ color: "#000000" }}
            onPress={submitItems}
          />
        </View>
      </ScrollView>
    </Overlay>
  );
}
