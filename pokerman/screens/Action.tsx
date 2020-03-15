import React, { Component } from "react";
import { Picker, TextInput, Text, View } from "react-native";
import { ISeat, Nullable, IAction } from "./../constants/DataTypes";
import { getNumberText } from "./../constants/helper";
import i18n from "../i18n";
export class Action extends Component<
  {
    bigBlind?: number;
    raiser?: ISeat;
    seats: ISeat[];
    handleAction: (action: IAction) => void;
  },
  {
    amount: number;
    raiser: Nullable<ISeat>;
  }
> {
  readonly state = {
    amount: this.props.bigBlind || 0,
    raiser: this.props.raiser || null,
    callers: [] as ISeat[],
    selectedItems: []
  };

  handleChange = e => {
    const { name, value } = e.target;
    let amount: number = 0;
    let raiser: Nullable<ISeat> = null;
    switch (name) {
      case "raiser":
        raiser = this.props.seats[parseInt(value)];
        this.setState({ amount: amount });
        this.setState({ raiser: raiser });
        this.setState({ callers: [] });

        break;
      case "amount":
        if (isNaN(value)) return;
        amount = parseInt(value);
        raiser = this.state.raiser;
        this.setState({ amount: amount });
        break;
    }

    if (raiser && amount > 0) {
      this.props.handleAction({ raiser: raiser, amount: amount, callers: [] });
    }
  };

  mapToSeatIndex = (seatNumber: number) =>
    this.props.seats.findIndex(seat => seat.seatNumber === seatNumber);

  render() {
    return (
      <View style={{ flexDirection: "row" }}>
        <Picker
          key="raiser"
          name="raiser"
          selectedValue={
            this.state.raiser && this.state.raiser.seatNumber >= 0
              ? this.mapToSeatIndex(this.state.raiser.seatNumber).toString()
              : "-1"
          }
          onChange={this.handleChange}
          style={{ width: 90 }}
        >
          {this.props.seats.map((seat, i) => (
            <Picker.Item
              key={"s" + i}
              label={
                i18n.t("action.seat") + " " + getNumberText(seat.seatNumber)
              }
              value={i}
            />
          ))}
          <Picker.Item
            key="s0"
            style={{ display: "none" }}
            label=""
            value="-1"
          />
        </Picker>
        <Text
          key="a"
          style={{
            width: 70,
            textAlign: "right"
          }}
        >
          {i18n.t("action.amount")}:
        </Text>
        <TextInput
          key="amount"
          name="amount"
          onChange={this.handleChange}
          value={this.state.amount === 0 ? "" : this.state.amount.toString()}
          keyboardType={"numeric"}
          maxLength={4}
          selectTextOnFocus={true}
          style={{
            width: 50,
            marginLeft: 5,
            paddingLeft: 5,
            backgroundColor: "#FFFFFF",
            borderWidth: 1
          }}
        />
      </View>
    );
  }
}

export default Action;
