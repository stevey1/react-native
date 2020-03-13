import React, { Component } from "react";
import { Picker, View } from "react-native";
import { Suit, ICard } from "../constants/DataTypes";
import {
  getCardNumberText,
  getSuitIcon,
  setCardColor
} from "../constants/helper";

export default class Card extends Component<{}, { card: ICard }> {
  state = { card: { cardNumber: 0, suit: Suit.unknow } };

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
          selectedValue={this.state.card.suit}
          onValueChange={itemValue => {
            const card = this.state.card;
            card.suit = parseInt(itemValue);
            this.setState({ card: card });
            if (card.suit > 0 && this.state.card.cardNumber > 0)
              this.props.handleCard(card);
          }}
          style={[setCardColor(this.state.card.suit), { width: "50px" }]}
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
          selectedValue={this.state.card.cardNumber}
          onValueChange={itemValue => {
            const card = this.state.card;
            card.cardNumber = parseInt(itemValue);
            this.setState({ card: card });
            if (card.cardNumber > 0 && this.state.card.suit > 0)
              this.props.handleCard(card);
          }}
          style={[setCardColor(this.state.card.suit), { width: "50px" }]}
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
