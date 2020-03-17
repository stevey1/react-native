import React, { Component } from "react";
import { Picker, TextInput, Text, View } from "react-native";
import { ISeat, Nullable, IAction } from "./../constants/DataTypes";
import { getNumberText } from "./../constants/helper";
import i18n from "../i18n";
import PickerDropDown from "./PickerDropDown";
import OptionButton from "./OptionButton";
export class Action extends Component<
  {
    bigBlind?: number;
    raiser?: ISeat;
    seats: ISeat[];
    handleAction: (action: IAction) => void;
  },
  {
    seatModalVisible: boolean;
    amount: number;
    raiser: Nullable<ISeat>;
  }
> {
  readonly state = {
    seatModalVisible: false,
    amount: this.props.bigBlind || 0,
    raiser: this.props.raiser || null,
    raiserSelected: this.props.raiser
      ? i18n.t("action.seat") +
        " " +
        getNumberText(this.props.raiser.seatNumber)
      : ""
  };

  handleChange = e => {
    const value = e.nativeEvent.text;
    const amount = parseInt(value);
    this.setState({ amount: amount });

    if (this.state.raiser && amount > 0) {
      this.props.handleAction({
        raiser: this.state.raiser,
        amount: amount,
        callers: []
      });
    }
  };

  handleRaiserSelected = (index: number) => {
    const raiser = this.props.seats[index];
    this.setState({
      raiser: raiser,
      amount: 0,
      seatModalVisible: false,
      raiserSelected:
        i18n.t("action.seat") + " " + getNumberText(raiser.seatNumber)
    });
    if (this.state.amount > 0) {
      this.props.handleAction({
        raiser: raiser,
        amount: this.state.amount,
        callers: []
      });
    }
  };

  getSeatList = () =>
    this.props.seats.map(seat => ({
      text: i18n.t("action.seat") + " " + getNumberText(seat.seatNumber),
      value: seat.seatNumber.toString()
    }));
  showSeatDropDown = () => {
    if (!this.state.seatModalVisible) {
      return <View></View>;
    }
    return (
      <PickerDropDown
        modalVisible={this.state.seatModalVisible}
        value={this.props.raiser ? this.props.raiser.seatNumber : ""}
        itemSelected={this.handleRaiserSelected}
        listItems={this.getSeatList()}
      ></PickerDropDown>
    );
  };
  mapToSeatIndex = (seatNumber: number) =>
    this.props.seats.findIndex(seat => seat.seatNumber === seatNumber);

  render() {
    return (
      <View style={{ flexDirection: "row" }}>
        <OptionButton
          style={{
            width: 110
          }}
          label={this.state.raiserSelected}
          onPress={() => this.setState({ seatModalVisible: true })}
        />
        {this.showSeatDropDown()}
        <Text
          style={{
            width: 70,
            textAlign: "right"
          }}
        >
          {i18n.t("action.amount")}:
        </Text>
        <TextInput
          key="amount"
          onChange={this.handleChange}
          value={this.state.amount ? this.state.amount.toString() : ""}
          keyboardType={"numeric"}
          maxLength={4}
          selectTextOnFocus={true}
          style={{
            width: 50,
            marginLeft: 5,
            paddingLeft: 5,
            backgroundColor: "#D1D1D1",
            borderWidth: 1
          }}
        />
      </View>
    );
  }
}

export default Action;
