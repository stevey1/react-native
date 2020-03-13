import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RectButton, ScrollView } from "react-native-gesture-handler";
import Card from "./Card";
import Action from "./Action";

export default class Play extends Component
/*<
  {},
  {
    myHand: { cardNumber: number; suit: number }[];
    board: { cardNumber: number; suit: number }[];
  }
>*/
{
  state = { myHand: [], boards: [] };

  handleMyHand = (card, cardId) => {
    const cards = this.state.myHand || [];
    cards[cardId] = card;
    this.setState({ myHand: cards });
  };
  handleBoard = (card, cardId) => {
    let cards = this.state.boards || [];
    cards[cardId] = card;
    this.setState({ boards: cards });
  };
  displayMyHand() {
    const cards = this.state.myHand || [];
    return cards.map(card => <Text>{card.cardNumber}</Text>);
  }
  render() {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <view>
          My Hands:
          <Card key="myhand1" handleCard={c => this.handleMyHand(c, 0)}></Card>
          <Card key="myhand2" handleCard={c => this.handleMyHand(c, 1)}></Card>
          {this.displayMyHand()}
        </view>
        <view>
          Preflop Raise:
          <Action key="pre"></Action>
        </view>
        <view>
          Flop:
          <Card key="board1" handleCard={c => this.handleBoard(c, 0)}></Card>
          <Card key="board2" handleCard={c => this.handleBoard(c, 1)}></Card>
          <Card key="board3" handleCard={c => this.handleBoard(c, 2)}></Card>
        </view>
        <view>
          Flop Raise:
          <Action key="pre"></Action>
        </view>
        <view>
          Turn:
          <Card key="board4" handleCard={c => this.handleBoard(c, 3)}></Card>
        </view>
        <view>
          Turn Raise:
          <Action key="pre"></Action>
        </view>
        <view>
          River:
          <Card key="board5" handleCard={c => this.handleBoard(c, 4)}></Card>
        </view>
        <view>
          River Raise:
          <Action key="pre"></Action>
        </view>
        <OptionButton
          icon="md-school"
          label="Read the Expo documentation"
          //onPress={() => WebBrowser.openBrowserAsync("https://docs.expo.io")}
        />
      </ScrollView>
    );
  }
}

function OptionButton({ icon, label, onPress, isLastOption }) {
  return (
    <RectButton
      style={[styles.option, isLastOption && styles.lastOption]}
      onPress={onPress}
    >
      <View style={{ flexDirection: "row" }}>
        <View style={styles.optionIconContainer}>
          <Ionicons name={icon} size={22} color="rgba(0,0,0,0.35)" />
        </View>
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>{label}</Text>
        </View>
      </View>
    </RectButton>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa"
  },
  contentContainer: {
    paddingTop: 15
  },
  optionIconContainer: {
    marginRight: 12
  },
  option: {
    backgroundColor: "#fdfdfd",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: "#ededed"
  },
  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  optionText: {
    fontSize: 15,
    alignSelf: "flex-start",
    marginTop: 1
  }
});
