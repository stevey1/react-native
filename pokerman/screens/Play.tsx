import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RectButton, ScrollView } from "react-native-gesture-handler";
import Card from "./Card";
import Action from "./Action";
import { ISeat, ICard } from "../constants/DataTypes";

export default class Play extends Component<
  {
    bigBlind: number;
    dealer: ISeat;
    seats: ISeat[];
  },
  {
    myHand: ICard[];
    board: ICard[];
  }
> {
  //console.log(this.props.bigBlind);
  readonly state = { myHand: [] as ICard[], board: [] as ICard[] };

  handleMyHand = (card: ICard, cardId: number) => {
    const cards = this.state.myHand || [];
    cards[cardId] = card;
    this.setState({ myHand: cards });
  };
  handleBoard = (card: ICard, cardId: number) => {
    let cards = this.state.board || [];
    cards[cardId] = card;
    this.setState({ board: cards });
  };
  displayMyHand() {
    const cards = this.state.myHand || [];
    return cards.map(card => (
      <Text key={"c" + card.cardNumber}>{card.cardNumber}</Text>
    ));
  }
  render() {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View>
          <Text key="my" style={{ width: "80px" }}>
            My Hands:
          </Text>
          <Card key="myhand1" handleCard={c => this.handleMyHand(c, 0)}></Card>
          <Card key="myhand2" handleCard={c => this.handleMyHand(c, 1)}></Card>
          {this.displayMyHand()}
        </View>
        <View>
          <Text key="p" style={{ width: "80px" }}>
            Preflop Raise:
          </Text>
          <Action
            key="pre"
            bigBlind={this.props.bigBlind}
            dealer={this.props.dealer}
            seats={this.props.seats}
          ></Action>
        </View>
        <View>
          <Text key="f" style={{ width: "80px" }}>
            Flop:
          </Text>
          <Card key="board1" handleCard={c => this.handleBoard(c, 0)}></Card>
          <Card key="board2" handleCard={c => this.handleBoard(c, 1)}></Card>
          <Card key="board3" handleCard={c => this.handleBoard(c, 2)}></Card>
        </View>
        <View>
          <Text key="fr" style={{ width: "80px" }}>
            Flop Raise:
          </Text>
          <Action key="flop" seats={this.props.seats}></Action>
        </View>
        <View>
          <Text key="t" style={{ width: "80px" }}>
            Turn:
          </Text>
          <Card key="board4" handleCard={c => this.handleBoard(c, 3)}></Card>
        </View>
        <View>
          <Text key="tr" style={{ width: "80px" }}>
            {" "}
            Turn Raise:
          </Text>
          <Action key="turn" seats={this.props.seats}></Action>
        </View>
        <View>
          <Text key="r" style={{ width: "80px" }}>
            River:
          </Text>
          <Card key="board5" handleCard={c => this.handleBoard(c, 4)}></Card>
        </View>
        <View>
          <Action key="river" seats={this.props.seats}></Action>
        </View>
        <OptionButton
          icon="md-school"
          label="Read the Expo documentation"
          isLastOption={false}
          //onPress={() => WebBrowser.openBrowserAsync("https://docs.expo.io")}
        />
      </ScrollView>
    );
  }
}

function OptionButton(props: {
  icon: string;
  label: string;
  isLastOption: boolean;
}) {
  return (
    <RectButton
      style={[styles.option, props.isLastOption && styles.lastOption]}
    >
      <View style={{ flexDirection: "row" }}>
        <View style={styles.optionIconContainer}>
          <Ionicons name={props.icon} size={22} color="rgba(0,0,0,0.35)" />
        </View>
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>{props.label}</Text>
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
