import React from "react";
import { Button } from "react-native-elements";
import { Modal, Picker, Text, TouchableHighlight, View } from "react-native";
import i18n from "../i18n";

export default class MyPicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      itemIndex:
        props.value == null
          ? 0
          : this.props.listItems.findIndex(x => x.value === props.value),
      itemValue:
        (props.value != null && props.value) || props.listItems[0].value
    };
  }
  render() {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.props.modalVisible}
        >
          <View style={{ flex: 1 }}>
            <Picker
              selectedValue={this.state.itemValue}
              style={{
                height: 0,
                alignSelf: "center",
                marginBottom: 10,
                width: 300
              }}
              onValueChange={(itemValue, itemIndex) => {
                if (this.props.modalVisible) {
                  this.setState({
                    itemValue: itemValue,
                    itemIndex: itemIndex
                  });
                }
              }}
            >
              {this.props.listItems.map(listItem => (
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
            onPress={() =>
              this.props.itemSelected(
                this.state.itemIndex,
                this.state.itemValue
              )
            }
          />
        </Modal>
      </View>
    );
  }
}
