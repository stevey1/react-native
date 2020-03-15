import React, { Component } from "react";
import { Picker, View, ActionSheetIOS } from "react-native";
import { Suit } from "../constants/DataTypes";
import { getNumberText, setCardColor, getSuitText } from "../constants/helper";
import i18n from "../i18n";
export default class Card extends Component<
  {},
  { cardNumber: number; suit: Suit }
> {
  state = { cardNumber: 0, suit: Suit.unknow };

  getCardNumbers = () => {
    let cardNumbers = [];
    for (let i = 14; i > 1; i--) {
      cardNumbers.push(
        <Picker.Item key={"c" + i} label={getNumberText(i)} value={i} />
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
          style={[setCardColor(this.state.suit), { width: 50 }]}
        >
          <Picker.Item
            key="s0"
            label={getSuitText(Suit.c)}
            color="#000000"
            value="0"
          />
          <Picker.Item
            key="s1"
            label={getSuitText(Suit.d)}
            color="#FF0000"
            value="1"
          />
          <Picker.Item
            key="s2"
            label={getSuitText(Suit.h)}
            color="#FF0000"
            value="2"
          />
          <Picker.Item
            key="s3"
            label={getSuitText(Suit.s)}
            color="#000000"
            value="3"
          />
          <Picker.Item
            key="s"
            style={{ display: "none" }}
            label=""
            value="-1"
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
          style={[setCardColor(this.state.suit), { width: 50 }]}
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
