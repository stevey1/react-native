import React from "react";
import { Button } from "react-native-elements";
import { Modal, Text, View } from "react-native";
import CheckBox from "./CheckBox";

export default class MultiPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemSelected
    };
  }
  onChange = (index: number) => {
    const indexes = this.state.indexes;
    indexes[index] =
      this.state.indexes[index] == null ? true : !this.state.indexes[index];

    this.setState({ indexes: indexes });
  };
  submitItems = () => {
    const itemsSelected = this.props.items.filter(
      (item, index) => this.state.indexes[index]
    );
    this.props.itemsSelected(itemsSelected);
  };
  getCheckBoxes(countPerRow: number) {
    let control = [];
    const rows = Math.ceil(this.props.listItems.length / countPerRow);
    for (let r = 0; r < rows; r++) {
      let row = [];

      for (
        let i = r * countPerRow;
        i < (r + 1) * countPerRow && i < this.props.listItems.length;
        i++
      ) {
        row.push(
          <CheckBox
            key={"c" + i}
            selected={this.state.itemSelected[i] || false}
            onPress={() => this.onChange(i)}
            text={this.props.listItems[i].text}
            value={this.props.listItems[i].value}
          />
        );
      }
      control.push(
        <View
          key={"m" + r}
          style={{ flex: 1, flexDirection: "row", marginLeft: 15 }}
        >
          {row}
        </View>
      );
    }
    return control;
  }
  render() {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.props.modalVisible}
        >
          <View style={{ flex: 1 }}>{this.showCheckBoxes(4)}</View>
          <Button
            buttonStyle={{
              backgroundColor: "#D1D1D1"
            }}
            title="Done"
            onPress={this.submitItems}
          />
        </Modal>
      </View>
    );
  }
}
