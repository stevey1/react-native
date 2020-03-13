import React, { Component } from "react";
import { Picker, View } from "react-native";
import { Suit, ICard } from "../constants/DataTypes";

export default class Card extends Component<{}, { card: ICard }> {
  state = { card: { cardNumber: 0, suit: Suit.unknow } };
  setCardColor() {
    return this.state.card.suit === Suit.d || this.state.card.suit === Suit.h
      ? { color: "#FF0000" }
      : { color: "#000000" };
  }
  getCardNumbers = () => {
    let cardNumbers = [];
    for (let i = 14; i > 1; i--) {
      cardNumbers.push(
        <Picker.Item
          key={"c" + i}
          label={this.getCardNumberText(i).toString()}
          value={i}
        />
      );
    }
    return cardNumbers;
  };

  getCardNumberText = cardNumber => {
    switch (cardNumber) {
      case 14:
        return "A";
      case 13:
        return "K";
      case 12:
        return "Q";
      case 11:
        return "J";
      case 0:
      case 1:
        return "";
      default:
        return cardNumber;
    }
  };
  render() {
    return (
      <View>
        <Picker
          key="suit"
          selectedValue={this.state.card.suit}
          onValueChange={itemValue => {
            const card = this.state.card;
            card.suit = parseInt(itemValue);
            this.setState({ card: card });
            if (card.suit > 0 && this.state.card.cardNumber > 0)
              this.props.handleCard(card);
          }}
          style={this.setCardColor()}
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
            const card = this.state.card;
            card.suit = parseInt(itemValue);
            this.setState({ card: card });
            if (card.cardNumber > 0 && this.state.card.suit > 0)
              this.props.handleCard(card);
          }}
          style={this.setCardColor()}
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
