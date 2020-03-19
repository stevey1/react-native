import React, { Component } from "react";
import { View } from "react-native";
import { Suit, ICard } from "../constants/DataTypes";
import { getNumberText, getCardColor, getSuitText } from "../constants/helper";
import MyPicker from "../components/MyPicker";
import MyButton from "../components/MyButton";
export default class Card extends Component<
  { handleCard: (card: ICard) => void },
  {
    cardNumber: number;
    cardSelected: string;
    suit: Suit;
    suitSelected: string;
    suitVisible: boolean;
    cardVisible: boolean;
  }
> {
  state = {
    cardNumber: -1,
    cardSelected: "",
    suit: Suit.unknow,
    suitSelected: "",
    suitVisible: false,
    cardVisible: false
  };
  handleSuitSelected = (index: number) => {
    this.setState({
      suitVisible: false,
      suit: index,
      suitSelected: getSuitText(index)
    });
    if (index >= 0 && this.state.cardNumber >= 0) {
      this.props.handleCard({ cardNumber: this.state.cardNumber, suit: index });
    }
  };
  handleCardSelected = (index: number, value: string) => {
    const cardNumber = parseInt(value);
    this.setState({
      cardVisible: false,
      cardNumber: cardNumber,
      cardSelected: getNumberText(cardNumber)
    });
    if (cardNumber >= 0 && this.state.suit >= 0) {
      this.props.handleCard({ cardNumber: cardNumber, suit: this.state.suit });
    }
  };
  getCardList = () =>
    [14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2].map(i => ({
      text: getNumberText(i),
      value: i.toString()
    }));
  getSuitList = () =>
    [0, 1, 2, 3].map(i => ({
      text: getSuitText(i),
      value: i.toString()
    }));

  showSuitDropDown = () => (
    <MyPicker
      key="suit"
      style={getCardColor(this.state.suit)}
      modalVisible={this.state.suitVisible}
      itemSelected={this.handleSuitSelected}
      listItems={this.getSuitList()}
    ></MyPicker>
  );
  showCardDropDown = () => (
    <MyPicker
      key="card"
      style={getCardColor(this.state.suit)}
      modalVisible={this.state.cardVisible}
      itemSelected={this.handleCardSelected}
      listItems={this.getCardList()}
    ></MyPicker>
  );
  render() {
    return (
      <View style={{ flexDirection: "row" }}>
        <MyButton
          key="s"
          style={{
            width: 45,
            margin: 0
          }}
          label={this.state.suitSelected}
          labelStyle={getCardColor(this.state.suit)}
          onPress={() => this.setState({ suitVisible: true })}
        />
        <MyButton
          key="c"
          style={{
            marginRight: 2,
            width: 45
          }}
          labelStyle={getCardColor(this.state.suit)}
          label={this.state.cardSelected}
          onPress={() => this.setState({ cardVisible: true })}
        />
        {this.showSuitDropDown()}
        {this.showCardDropDown()}
      </View>
    );
  }
}
