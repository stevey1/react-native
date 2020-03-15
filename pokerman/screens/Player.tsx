import PickerDropDown from "./PickerDropDown";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";

import React, { Component } from "react";

export class Player extends Component<{}, { modalVisible: boolean }> {
  state = { modalVisible: false };
  handleModalHide = () => {
    this.setState({ modalVisible: false });
  };
  showModal = () =>
    !this.state.modalVisible ? (
      <View></View>
    ) : (
      <PickerDropDown
        modalVisible={this.state.modalVisible}
        modalHide={this.handleModalHide}
      ></PickerDropDown>
    );
  render() {
    return (
      <View>
        <Button
          buttonStyle={{
            backgroundColor: "#D1D1D1"
          }}
          title="show it"
          onPress={() => this.setState({ modalVisible: true })}
        />
        {this.showModal()}
      </View>
    );
  }
}
export default Player;
