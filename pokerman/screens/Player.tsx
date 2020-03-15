import PickerDropDown from "./PickerDropDown";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";

import React, { Component } from "react";

export class Player extends Component<{}, { modalVisible: boolean }> {
  state = { modalVisible: false };
  handleItemSelected = (value: string, index: number) => {
    this.setState({ modalVisible: false });
  };
  listItems = [
    { text: "try 1", value: "1" },
    { text: "try 2", value: "2" },
    { text: "try 3", value: "3" }
  ];
  showDropDown = () => (
    <PickerDropDown
      modalVisible={this.state.modalVisible}
      itemSelected={this.handleItemSelected}
      listItems={this.listItems}
    ></PickerDropDown>
  );
  render() {
    return (
      <View>
        <Button
          buttonStyle={{
            backgroundColor: "#D1D1D1",
            width: 100
          }}
          title="show it"
          onPress={() => this.setState({ modalVisible: true })}
        />
        {this.showDropDown()}
      </View>
    );
  }
}
export default Player;
