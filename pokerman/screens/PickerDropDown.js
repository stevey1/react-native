import React from "react";
import { Platform } from "react-native";
import { Button } from "react-native-elements";
import { Picker, View, Text } from "react-native";

export default class PickerDropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showButton: true,
      label: "Pick"
    };
  }

  showButton = () =>
    !this.state.showButton ? (
      <View></View>
    ) : (
      <Button
        buttonStyle={{
          backgroundColor: "#D1D1D1"
        }}
        onPress={this.toggle()}
        color="#fff000"
        title={this.state.label}
        onPress={this.changeOpacity}
      />
    );
  changeOpacity = () => {
    this.setState({
      pickerOpacity: 1,
      opacityOfOtherItems: 0,
      showButton: false
    });
  };
  showPicker = () =>
    this.state.showButton ? (
      <View></View>
    ) : (
      <Picker
        selectedValue={this.state.selected}
        style={{
          height: 50,
          alignSelf: "center",
          marginBottom: 30,
          width: 250
        }}
        onValueChange={(itemValue, itemIndex) => {
          this.setState({
            selected: itemValue,
            label: itemValue
          });
          this.toggle();
        }}
      >
        <Picker.Item label="Your Label" value="yourValue" />
        <Picker.Item label="Your Label" value="yourValue2" />
        <Picker.Item label="Your Label" value="yourValue3" />
        <Picker.Item label="Your Label" value="yourValue4" />
      </Picker>
    );
  toggle = () => {
    //if (Platform.OS === "ios") {
    if (!this.state.showButton) {
      this.setState({
        showButton: true
      });
    }
  };
  render() {
    return (
      <View>
        {this.showButton()}
        {this.showPicker()}
      </View>
    );
  }
}
