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
    if (indexes.length > 0) {
      this.props.callersSelected(indexes.map(index => this.props.seats[index]));
    }
  };

  getListItems = () => {
    this.props.seats.map((seat, i) => ({
      text:
        i18n.t("action.seat") +
        " " +
        getNumberText(this.props.seats[i].seatNumber),
      value: seat.seatNumber
    }));
  };
  render() {
    return (
      <View>
        <MultiPicker
          modalVisible={this.props.modalVisible}
          listItems={this.getListItems}
          itemsSelected={this.handleItemsSelected}
        />
      </View>
    );
  }
}

export default Caller;
