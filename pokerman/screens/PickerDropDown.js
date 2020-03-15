import React from "react";
import { Platform } from "react-native";
import { Button } from "react-native-elements";
import {
  Modal,
  Picker,
  Text,
  TouchableHighlight,
  View,
  Alert
} from "react-native";

export default class PickerDropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showButton: true,
      modalVisible: false,
      label: "Pick"
    };
  }

  toggle = () => {
    this.setState({
      modalVisible: !this.state.modalVisible
    });
  };
  render() {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
        >
          <View style={{ flex: 1 }}>
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
              }}
            >
              <Picker.Item label="Your Label" value="yourValue" />
              <Picker.Item label="Your Label" value="yourValue2" />
              <Picker.Item label="Your Label" value="yourValue3" />
              <Picker.Item label="Your Label" value="yourValue4" />
            </Picker>
          </View>
          <Button
            buttonStyle={{
              backgroundColor: "#D1D1D1"
            }}
            title="Done"
            onPress={this.toggle}
          />
        </Modal>
        <Button
          buttonStyle={{
            backgroundColor: "#D1D1D1"
          }}
          title={this.state.label}
          onPress={this.toggle}
        />
      </View>
    );
  }
}
