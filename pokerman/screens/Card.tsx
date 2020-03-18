import React, { Component } from "react";
import { View } from "react-native";
import { Suit } from "../constants/DataTypes";
import { getNumberText, setCardColor, getSuitText } from "../constants/helper";
import MyPicker from "../components/MyPicker";
import MyButton from "../components/MyButton";
export default class Card extends Component<
  {},
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
    cardNumber: 0,
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
  };
  handleCardSelected = (index: number, value: string) => {
    const cardNmber = parseInt(value);
    this.setState({
      cardVisible: false,
      cardNumber: cardNmber,
      cardSelected: getNumberText(cardNmber)
    });
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
      modalVisible={this.state.suitVisible}
      itemSelected={this.handleSuitSelected}
      listItems={this.getSuitList()}
    ></MyPicker>
  );
  showCardDropDown = () => (
    <MyPicker
      key="card"
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
          onPress={() => this.setState({ suitVisible: true })}
        />
        <MyButton
          key="c"
          style={{
            marginRight: 2,
            width: 45
          }}
          label={this.state.cardSelected}
          onPress={() => this.setState({ cardVisible: true })}
        />
        {this.showSuitDropDown()}
        {this.showCardDropDown()}
      </View>
    );
  }
}
