import React from "react";
import { Button } from "react-native-elements";
import { Modal, Text, View } from "react-native";
import CheckBox from "./CheckBox";

export default class MultiPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: props.listItems.map(item => false)
    };
  }
  onChange = index => {
    const selected = this.state.selected;
    selected[index] =
      this.state.selected[index] == null ? true : !this.state.selected[index];

    this.setState({ selected: selected });
  };
  submitItems = () => {
    const selectedIndexes = this.state.selected
      .map((value, index) => ({ value, index }))
      .filter(item => item.value)
      .map(item => item.index);
    this.props.itemsSelected(selectedIndexes);
  };
  getCheckBoxes(countPerRow) {
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
            selected={this.state.selected[i] || false}
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
          <View style={{ flex: 1 }}>{this.getCheckBoxes(4)}</View>
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
