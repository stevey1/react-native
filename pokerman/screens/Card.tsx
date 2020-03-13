import React, { Component } from "react";
import { Picker, View } from "react-native";
import { Suit } from "../constants/DataTypes";
import {
  getCardNumberText,
  setCardColor
} from "../constants/helper";

export default class Card extends Component<
  {},
  { cardNumber: number; suit: Suit }
> {
  state = { cardNumber: 0, suit: Suit.unknow };

  getCardNumbers = () => {
    let cardNumbers = [];
    for (let i = 14; i > 1; i--) {
      cardNumbers.push(
        <Picker.Item
          key={"c" + i}
          label={getCardNumberText(i).toString()}
          value={i}
        />
      );
    }
    return cardNumbers;
  };

  render() {
    return (
      <View style={{ flexDirection: "row" }}>
        <Picker
          key="suit"
          selectedValue={this.state.suit}
          onValueChange={itemValue => {
            const suit = parseInt(itemValue);
            this.setState({ suit: suit });
            if (suit > 0 && this.state.cardNumber > 0)
              this.props.handleCard({
                suit: suit,
                cardNumber: this.state.cardNumber
              });
          }}
          style={[setCardColor(this.state.suit), { width: "50px" }]}
        >
          <Picker.Item key="s1" label="&clubs;" color="#000000" value="1" />
          <Picker.Item key="s2" label="&diams;" color="#FF0000" value="2" />
          <Picker.Item key="s3" label="&hearts;" color="#FF0000" value="3" />
          <Picker.Item key="s4" label="&spades;" color="#000000" value="4" />
          <Picker.Item
            key="s0"
            style={{ display: "none" }}
            label=""
            value="0"
          />
        </Picker>
        <Picker
          key="card"
          selectedValue={this.state.cardNumber}
          onValueChange={itemValue => {
            const cardNumber = parseInt(itemValue);
            this.setState({ cardNumber: cardNumber });
            if (cardNumber > 0 && this.state.suit > 0)
              this.props.handleCard({
                cardNumber: cardNumber,
                suit: this.state.suit
              });
          }}
          style={[setCardColor(this.state.suit), { width: "50px" }]}
        >
          {this.getCardNumbers()}
          <Picker.Item
            key="c0"
            style={{ display: "none" }}
            value="0"
            label=""
          />
        </Picker>
      </View>
    );
  }
}
