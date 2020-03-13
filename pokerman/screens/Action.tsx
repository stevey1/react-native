import React, { Component } from "react";
import { Picker, TextInput, Text, View } from "react-native";
import { ISeat, Nullable } from ".\..\constants\DataTypes";

export class Action extends Component<
  { bigBlind?: number; dealer?: ISeat; seats: ISeat[] },
  {
    amount: number;
    raiser: Nullable<ISeat>;
    callers: ISeat[];
  }
> {
  readonly state = {
    amount: this.props.bigBlind || 0,
    raiser: this.props.dealer || null,
    callers: [] as ISeat[]
  };
  handleChange = (name, value) => {
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
        if (!isNaN(value)) return;
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
        return;
    }

    if (raiser && amount > 0) {
      //this.props.handleRaiser(raiser, amount);
    }
  };

  render() {
    return (
      <View>
        <Picker
          key="raiser"
          selectedValue={
            (this.state.raiser && this.state.raiser.seatNumber) || "0"
          }
          onValueChange={itemValue => this.handleChange("raiser", itemValue)}
        >
          <Picker.Item key="s1" label="Seat 1" value="1" />
          <Picker.Item key="s2" label="Seat 2" value="2" />
          <Picker.Item key="s3" label="Seat 3" value="3" />
          <Picker.Item key="s4" label="Seat 4" value="4" />
          <Picker.Item
            key="s0"
            style={{ display: "none" }}
            label=""
            value="0"
          />
        </Picker>
        <Text>Amount:</Text>
        <TextInput
          key="Amount"
          style={{ borderColor: "gray", borderWidth: 1 }}
          onChangeText={text => this.handleChange("amount", text)}
          value={this.state.amount}
          //keyboardType="numeric"
          //maxLength={4}
        />
      </View>
    );
  }
}

export default Action;
