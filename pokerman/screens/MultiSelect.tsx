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
  { seats: ISeat[] },
  { isModalVisible: boolean; isSeatSelected: boolean[] }
> {
  state = {
    isModalVisible: false,
    isSeatSelected: []
  };
  toggleModal = () => {
    if (this.state.isModalVisible) console.log("toggled");
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  seatSelected = (id: string) => {
    console.log("i am here");
    console.log("id", id);
    const index = parseInt(id);
    const isSeatSelected = this.state.isSeatSelected;
    isSeatSelected[index] = !this.state.isSeatSelected[index];
    console.log("isSeatSelected", isSeatSelected);

    this.setState({ isSeatSelected: isSeatSelected });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.props.seats.map((seat, index) => (
          <View key={"v" + index}>
            <CheckBox
              checked={true}
              //              color="#fc5185"

              selected={this.state.isSeatSelected[index]}
              onPress={() => this.seatSelected(index)}
              text={"Seat " + seat.seatNumber}
            />
          </View>
        ))}
        <Button title="Show modal" onPress={this.toggleModal} />
      </View>
    );
  }
}

export default MultiSelect;
