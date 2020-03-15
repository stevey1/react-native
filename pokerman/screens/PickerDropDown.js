import React from "react";
import { Button } from "react-native-elements";
import { Modal, Picker, Text, TouchableHighlight, View } from "react-native";

export default class PickerDropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      selected: ""
    };
  }

  toggle = () => {
    if (this.props.modalVisible) this.props.modalHide();
  };
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
              selectedValue={this.state.selected}
              style={{
                height: 50,
                alignSelf: "center",
                marginBottom: 30,
                width: 250
              }}
              onValueChange={(itemValue, itemIndex) => {
                if (this.props.modalVisible) {
                  this.setState({
                    selected: itemValue
                  });
                }
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
      </View>
    );
  }
}
