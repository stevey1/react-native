import React, { Component } from "react";
import { Picker, TextInput, Text, View } from "react-native";
import { ISeat, Nullable, IAction } from "./../constants/DataTypes";

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
    callers: ISeat[];
  }
> {
  readonly state = {
    amount: this.props.bigBlind || 0,
    raiser: this.props.raiser || null,
    callers: [] as ISeat[]
  };
  handleChange = e => {
    const { name, value } = e.target;
    let amount: number = 0;
    let raiser: Nullable<ISeat> = null;
    switch (name) {
      case "raiser":
        raiser = this.props.seats.find(x => x.seatNumber === parseInt(value));
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

  render() {
    return (
      <View style={{ flexDirection: "row" }}>
        <Picker
          key="raiser"
          name="raiser"
          selectedValue={
            this.state.raiser && this.state.raiser.seatNumber >= 0
              ? this.state.raiser.seatNumber.toString()
              : "-1"
          }
          onChange={this.handleChange}
          style={{ width: "75px" }}
        >
          <Picker.Item key="s1" label="Seat 1" value="0" />
          <Picker.Item key="s2" label="Seat 2" value="1" />
          <Picker.Item key="s3" label="Seat 3" value="2" />
          <Picker.Item key="s4" label="Seat 4" value="3" />
          <Picker.Item key="s5" label="Seat 5" value="4" />
          <Picker.Item key="s6" label="Seat 6" value="5" />
          <Picker.Item key="s7" label="Seat 7" value="6" />
          <Picker.Item key="s8" label="Seat 8" value="7" />
          <Picker.Item key="s9" label="Seat 9" value="8" />
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
      </View>
    );
  }
}

export default Action;
