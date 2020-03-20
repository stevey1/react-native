import React, { Component } from "react";
import { View } from "react-native";

import { ISeat } from "./../constants/DataTypes";
import MyMultiPicker from "../components/MyMultiPicker";
export class Caller extends Component<{
  modalVisible: boolean;
  raiserSeatNumber: string;
  seats: ISeat[];
  callersSelected: (callers: ISeat[]) => void;
}> {
  handleItemsSelected = (indexes: number[]) => {
    const callers = indexes.map(index => this.props.seats[index]);
    this.props.callersSelected(callers);
  };

  getListItems = () =>
    this.props.seats.map((seat, i) => ({
      text: seat.player.name,
      value: seat.seatNumber
    }));

  render() {
    return (
      <View>
        <MyMultiPicker
          modalVisible={this.props.modalVisible}
          hightlightValue={this.props.raiserSeatNumber}
          listItems={this.getListItems()}
          itemsSelected={this.handleItemsSelected}
        />
      </View>
    );
  }
}

export default Caller;
