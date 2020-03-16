import React from "react";
import { Button } from "react-native-elements";
import { Modal, Picker, Text, TouchableHighlight, View } from "react-native";

export default class MyPicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      itemIndex: 0,
      itemValue: props.value || props.listItems[0].value
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
                height: 50,
                alignSelf: "center",
                marginBottom: 30,
                width: 250
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
            title="Done"
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
