import React, { Component } from "react";
import { Picker, TextInput } from "react-native";

export class Action extends Component {
  state = {
    amount: 0, //this.props.defaultBet ? this.props.defaultBet : 0,
    raiser: null, //this.props.bigBlind ? this.props.bigBlind : null,
    callers: []
  };
  handleChange = (name, value) => {
    let amount = this.state.amount;
    let raiser = this.state.raiser;
    /*
    switch (name) {
      case "raiser":
        raiser = this.props.seats.find(x => x.seatNumber === parseInt(value));

        amount = 0;
        this.setState({ amount: amount });
        this.setState({ raiser: raiser });
        this.setState({ callers: [] });

        break;
      case "amount":
        amount = parseInt(value);
        this.setState({ amount: amount });
        break;
      case "callers":
        const callers = this.props.seats.filter(x =>
          value.includes(x.seatNumber)
        );
        this.setState({ callers: callers });
        if (amount > 0) {
          this.props.handleCallers(callers);
        }
        return;
    }

    if (raiser && amount > 0) {
      this.props.handleRaiser(raiser, amount);
    }*/
  };

  render() {
    return (
      <view>
        <Picker
          key="raiser"
          selectedValue={this.state.suit}
          onValueChange={itemValue =>
            handleChange((name = "raiser"), (value = itemValue))
          }
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
        Amount:
        <TextInput
          key="Amount"
          style={{ borderColor: "gray", borderWidth: 1 }}
          // onChangeText={text => handleChange((name = "amount"), (value = text))}
          value={this.state.amount || ""}
          keyboardType="numeric"
          maxLength={4}
        />
      </view>
    );
  }
}

export default Action;
