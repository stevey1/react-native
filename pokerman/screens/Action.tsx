import React, { Component } from "react";
import { Picker, TextInput, Text, View } from "react-native";
import { ISeat, Nullable, IAction } from "./../constants/DataTypes";
import MultiSelect from "./MultiSelect";
export class Action extends Component<
  {
    bigBlind?: number;
    raiser?: ISeat;
    seats: ISeat[];
    handleAction: (action: IAction) => void;
    handleCallers: (callers: ISeat[]) => void;
  },
  {
    amount: number;
    raiser: Nullable<ISeat>;
    callers: ISeat[];
    selectedItems: [];
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
      case "callers":
        const callers = this.props.seats.filter(x =>
          value.includes(x.seatNumber)
        );
        this.setState({ callers: callers });
        //this.props.handleCallers(callers);
        this.props.handleAction({ raiser: null, amount: 0, callers: callers });
        return;
    }

    if (raiser && amount > 0) {
      this.props.handleAction({ raiser: raiser, amount: amount, callers: [] });
    }
  };
  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
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
          style={{ width: "75px" }}
        >
          {this.props.seats.map((seat, i) => (
            <Picker.Item
              key={"s" + i}
              label={"Seat " + seat.seatNumber}
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
            width: "70px",
            textAlign: "right"
          }}
        >
          Amount:
        </Text>
        <TextInput
          key="amount"
          name="amount"
          style={{ borderColor: "gray", borderWidth: 1 }}
          onChange={this.handleChange}
          value={this.state.amount === 0 ? "" : this.state.amount.toString()}
          keyboardType={"numeric"}
          maxLength={4}
          selectTextOnFocus={true}
          style={{ width: "50px", marginLeft: "5px", paddingLeft: "5px" }}
        />
        <MultiSelect
          enabled={this.state.raiser && this.state.amount > 0}
          callers={this.props.seats}
          handleCallers={this.props.handleCallers}
        />
      </View>
    );
  }
}

export default Action;
