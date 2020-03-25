import React from "react";
import { Button, Overlay } from "react-native-elements";
import { Modal, View } from "react-native";
import CheckBox from "./CheckBox";
import i18n from "../i18n";

export default class MyMultiPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: props.listItems.map(item => props.values.includes(item.value))
    };
  }
  onChange = index => {
    if (
      this.props.hightlightValue &&
      this.props.listItems[index].value === this.props.hightlightValue
    )
      return;

    const selected = this.state.selected;
    selected[index] = !this.state.selected[index];

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
            textStyle={
              this.props.hightlightValue &&
              this.props.listItems[i].value === this.props.hightlightValue
                ? { color: "#ff0000" }
                : {}
            }
          />
        );
      }
      control.push(
        <View
          key={"m" + r}
          style={{ flexDirection: "row", width: 50, height: 40 }}
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
        <Overlay
          windowBackgroundColor="rgba(255, 255, 255, .5)"
          width="auto"
          height="auto"
          isVisible={this.props.modalVisible}
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            {this.getCheckBoxes(1)}
          </View>
          <Button
            buttonStyle={{
              backgroundColor: "#D1D1D1"
            }}
            title={i18n.t("button.done")}
            titleStyle={{ color: "#000000" }}
            onPress={this.submitItems}
          />
        </Overlay>
      </View>
    );
  }
}
