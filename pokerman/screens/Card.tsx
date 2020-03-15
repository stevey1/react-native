import React, { Component } from "react";
import { View } from "react-native";
import { Suit } from "../constants/DataTypes";
import { getNumberText, setCardColor, getSuitText } from "../constants/helper";
import PickerDropDown from "./PickerDropDown";
import { Button } from "react-native-elements";

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
    cardSelected: "C",
    suit: Suit.unknow,
    suitSelected: "s",
    suitVisible: false,
    cardVisible: false
  };
  handleSuitSelected = (index: number) => {
    this.setState({
      suitVisible: false,
      suit: index,
      suitSelected: getSuitText(index)
    });

    // if (index >= 0 && this.state.cardNumber >= 0)
    //   this.props.handleCard({
    //     suit: index,
    //     cardNumber: this.state.cardNumber
    //   });
  };
  handleCardSelected = (index: number) => {
    this.setState({
      cardVisible: false,
      cardNumber: index,
      cardSelected: getNumberText(index)
    });
    // if (index >= 0 && this.state.suit >= 0)
    //   this.props.handleCard({
    //     suit: this.state.suit,
    //     cardNumber: index
    //   });
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
    <PickerDropDown
      key="suit"
      modalVisible={this.state.suitVisible}
      itemSelected={this.handleSuitSelected}
      listItems={this.getSuitList()}
    ></PickerDropDown>
  );
  showCardDropDown = () => (
    <PickerDropDown
      key="card"
      modalVisible={this.state.cardVisible}
      itemSelected={this.handleCardSelected}
      listItems={this.getCardList()}
    ></PickerDropDown>
  );
  render() {
    return (
      <View style={{ flexDirection: "row" }}>
        <Button
          key="s"
          buttonStyle={{
            backgroundColor: "#D1D1D1",
            width: 60
          }}
          title={this.state.suitSelected}
          onPress={() => this.setState({ suitVisible: true })}
        />
        {this.showSuitDropDown()}
        <Button
          key="c"
          buttonStyle={{
            backgroundColor: "#D1D1D1",
            width: 60
          }}
          title={this.state.cardSelected}
          onPress={() => this.setState({ cardVisible: true })}
        />
        {this.showCardDropDown()}
      </View>
    );
  }
}
