import React, { Component } from "react";
import { View } from "react-native";

import { ISeat } from "./../constants/DataTypes";
import MultiPicker from "./MultiPicker";
import i18n from "../i18n";
import { getNumberText } from "../constants/helper";
export class Caller extends Component<{
  modalVisible: boolean;
  seats: ISeat[];
  callersSelected: (callers: ISeat[]) => void;
}> {
  handleItemsSelected = (indexes: number[]) => {
    const callers = indexes.map(index => this.props.seats[index]);
    console.log("callers", callers.length);

    this.props.callersSelected(callers);
  };

  getListItems = () =>
    this.props.seats.map((seat, i) => ({
      text: i18n.t("action.seat") + " " + getNumberText(seat.seatNumber),
      value: seat.seatNumber
    }));

  render() {
    return (
      <View>
        <MultiPicker
          modalVisible={this.props.modalVisible}
          listItems={this.getListItems()}
          itemsSelected={this.handleItemsSelected}
        />
      </View>
    );
  }
}

export default Caller;
