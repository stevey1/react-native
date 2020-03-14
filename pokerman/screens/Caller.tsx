import React, { Component } from "react";
import { Picker, TextInput, Text, View } from "react-native";
import { ISeat, Nullable, IAction } from "./../constants/DataTypes";
import MultiSelect from "./MultiSelect";
export class Caller extends Component<
  {
    seats: ISeat[];
    handleCallers: (callers: ISeat[]) => void;
  },
  {
    callers: ISeat[];
  }
> {
  readonly state = {
    amount: this.props.bigBlind || 0,
    raiser: this.props.raiser || null,
    callers: [] as ISeat[],
    selectedItems: []
  };
  render() {
    return (
      <View>
        <MultiSelect
          seats={this.props.seats}
          handleCallers={this.props.handleCallers}
        />
      </View>
    );
  }
}

export default Caller;
