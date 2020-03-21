import React, { Component } from "react";
import { TextInput, Text, View } from "react-native";
import { ISeat, Nullable, IAction } from "./../constants/DataTypes";
import i18n from "../i18n";
import MyPicker from "../components/MyPicker";
import MyButton from "../components/MyButton";
export class Action extends Component<
  {
    bigBlind?: number;
    seats: ISeat[];
    handleAction: (action: IAction) => void;
  },
  {
    seatModalVisible: boolean;
    amount: number;
    raiser: Nullable<ISeat>;
    raiserSelected: string;
  }
> {
  readonly state = {
    seatModalVisible: false,
    amount: this.props.bigBlind ?? 0,
    raiser: this.props.bigBlind
      ? this.props.seats[this.props.seats.length - 1]
      : null,
    raiserSelected: this.props.bigBlind
      ? this.props.seats[this.props.seats.length - 1].player.name
      : ""
  };

  handleChange = e => {
    const amount = parseInt(e.nativeEvent.text);
    this.setState({ amount: amount });

    if (this.state.raiser && amount) {
      this.props.handleAction({
        raiser: this.state.raiser,
        amount: amount,
        callers: [] as ISeat[],
        checkRaise: false,
        raises: 1
      });
    }
  };

  handleRaiserSelected = (index: number) => {
    const raiser = this.props.seats[index];
    this.setState({
      raiser: raiser,
      amount: 0,
      seatModalVisible: false,
      raiserSelected: raiser.player.name
    });
  };

  getSeatList = () =>
    this.props.seats.map(seat => ({
      text: seat.player.name,
      value: seat.seatNumber.toString()
    }));
  showSeatDropDown = () =>
    !this.state.seatModalVisible ? (
      <View></View>
    ) : (
      <MyPicker
        modalVisible={this.state.seatModalVisible}
        value={this.state.raiser?.seatNumber.toString() ?? ""}
        itemSelected={this.handleRaiserSelected}
        listItems={this.getSeatList()}
      ></MyPicker>
    );

  mapToSeatIndex = (seatNumber: number) =>
    this.props.seats.findIndex(seat => seat.seatNumber === seatNumber);

  render() {
    return (
      <View style={{ flexDirection: "row" }}>
        <MyButton
          style={{
            width: 80
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
