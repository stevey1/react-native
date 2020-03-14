import React, { Component } from "react";
import { ISeat } from "../constants/DataTypes";
import {
  StyleSheet,
  TouchableHighlight,
  View,
  Button,
  Text,
  Modal
} from "react-native";
import CheckBox from "./CheckBox";

export class MultiSelect extends Component<
  { callers: ISeat[]; enabled: boolean },
  {
    isModalVisible: boolean;
    selectedCallers: boolean[];
    handleCallers: (callers: ISeat[]) => void;
  }
> {
  state = {
    isModalVisible: false,
    selectedCallers: [] as boolean[]
  };
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  callerSelected = (id: string) => {
    const index = parseInt(id);
    const selectedCallers = this.state.selectedCallers;
    selectedCallers[index] = !this.state.selectedCallers[index];
    console.log("selectedCallers", selectedCallers);
    this.setState({ selectedCallers: selectedCallers });
  };
  submitCallers = () => {
    if (!this.props.enabled) return;
    const callers = this.props.callers.filter(
      (caller, index) => this.state.selectedCallers[index]
    );
    this.props.handleCallers(callers);
    this.toggleModal();
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Button title="Submit" onPress={this.submitCallers} />

        {this.props.callers.map((seat, index) => (
          <CheckBox
            key={"c" + index}
            //              color="#fc5185"
            selected={this.state.selectedCallers[index]}
            onPress={() => this.callerSelected(index)}
            text={"Seat " + seat.seatNumber}
          />
        ))}
      </View>
    );
  }
}

export default MultiSelect;
