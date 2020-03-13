import React, { Component } from "react";
import { Picker, TextInput, Text, View } from "react-native";
import { ISeat, Nullable } from "./../constants/DataTypes";

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
        return;
    }

    if (raiser && amount > 0) {
      //this.props.handleRaiser(raiser, amount);
    }
  };

  render() {
    return (
      <View style={{ flexDirection: "row" }}>
        <Picker
          key="raiser"
          name="raiser"
          selectedValue={
            (this.state.raiser && this.state.raiser.seatNumber) || "0"
          }
          onChange={this.handleChange}
          style={{ width: "75px" }}
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
        <Text
          key="a"
          style={{
            width: "70px",
            paddingRight: "5px",
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
          style={{ width: "50px", textAlign: "right" }}
        />
      </View>
    );
  }
}

export default Action;
