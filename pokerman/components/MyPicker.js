import React, { useState } from "react";
import { Button, Overlay } from "react-native-elements";
import { Picker, View } from "react-native";
import i18n from "../i18n";

export default function MyPicker(props) {
  const [ItemIndex, setItemIndex] = useState(
    props.value == null
      ? 0
      : props.listItems.findIndex(x => x.value === props.value)
  );
  const [ItemValue, setItemValue] = useState(
    (props.value != null && props.value) || props.listItems[0].value
  );

  return (
    <Overlay
      overlayBackgroundColor="#F5F5F5"
      width="90%"
      height="70%"
      isVisible={props.modalVisible}
    >
      <View style={{ flexGrow: 1, justifyContent: "space-between" }}>
        <View>
          <Picker
            selectedValue={ItemValue}
            style={{
              alignSelf: "center",
              marginBottom: 10,
              width: 300
            }}
            onValueChange={(itemValue, itemIndex) => {
              if (props.modalVisible) {
                setItemValue(itemValue);
                setItemIndex(itemIndex);
              }
            }}
          >
            {props.listItems.map(listItem => (
              <Picker.Item
                color={
                  listItem.text === "方" ||
                  listItem.text === "红" ||
                  listItem.text === "♦" ||
                  listItem.text === "♥"
                    ? "red"
                    : ""
                }
                key={"k" + listItem.value}
                label={listItem.text}
                value={listItem.value}
              />
            ))}
          </Picker>
        </View>
        <Button
          buttonStyle={{
            backgroundColor: "#D1D1D1"
          }}
          title={i18n.t("button.done")}
          titleStyle={{ color: "#000000" }}
          onPress={() => props.itemSelected(ItemIndex, ItemValue)}
        />
      </View>
    </Overlay>
  );
}
