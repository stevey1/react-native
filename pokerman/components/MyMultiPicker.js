import React, { useState } from "react";
import { CheckBox, Button, Overlay } from "react-native-elements";
import { Modal, View } from "react-native";
// import CheckBox from "./CheckBox";
import i18n from "../i18n";

export default function MyMultiPicker(props) {
  const [Selected, setSelected] = useState(
    props.listItems.map(item => props.values.findIndex(v => v == item.value))
  );

  const onChange = index => {
    if (
      props.hightlightValue &&
      props.listItems[index].value == props.hightlightValue
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
            title={props.listItems[i].text + Selected[i]}
          ></CheckBox>
          // <CheckBox
          //   key={"c" + i}
          //   selected={Selected[i] || false}
          //   onPress={() => onChange(i)}
          //   text={props.listItems[i].text}
          //   value={props.listItems[i].value}
          //   textStyle={
          //     props.hightlightValue &&
          //     props.listItems[i].value == props.hightlightValue
          //       ? { color: "#ff0000" }
          //       : {}
          //   }
          // />
        );
      }
      control.push(
        <View
          key={"m" + r}
          style={{ flexDirection: "row", width: 50, height: 40 }}
        >
          {row}
        </View>
      );
    }
    return control;
  };

  return (
    <View>
      <Overlay
        windowBackgroundColor="rgba(255, 255, 255, .5)"
        width="auto"
        height="auto"
        isVisible={props.modalVisible}
      >
        <View>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            {getCheckBoxes(1)}
          </View>
          <Button
            buttonStyle={{
              backgroundColor: "#D1D1D1"
            }}
            title={i18n.t("button.done")}
            titleStyle={{ color: "#000000" }}
            onPres
            s={submitItems}
          />
        </View>
      </Overlay>
    </View>
  );
}
