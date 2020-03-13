import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RectButton, ScrollView } from "react-native-gesture-handler";
import Card from "./Card";
import Action from "./Action";
import {
  ISeat,
  ICard,
  IAction,
  IActionHistory,
  Round
} from "../constants/DataTypes";

export default class Play extends Component<
  {
    bigBlind: number;
    dealer: number;
    seats: ISeat[];
  },
  {
    myHand: ICard[];
    board: ICard[];
    actions: IAction[];
    allActions: IActionHistory[];
  }
> {
  state = {
    myHand: [] as ICard[],
    board: [] as ICard[],
    actions: [] as IAction[],
    allActions: [] as IActionHistory[]
  };
  constructor(props: { bigBlind: number; dealer: ISeat; seats: ISeat[] }) {
    super(props);
  }

  componentDidMount = () => {
    const raiser = this.getBigBlindSeat();
    const action: IAction = {
      raiser: raiser,
      amount: this.props.bigBlind,
      callers: [] as ISeat[]
    };
    const actions = this.state.actions;
    actions[Round.Preflop] = action;
    this.setState({ actions: actions });
    const allActions = this.state.allActions;
    allActions.push({ action: action, round: Round.Preflop });
    this.setState({ allActions: allActions });
  };
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
  handleAction = (action: IAction, round: Round) => {
    if (action.raiser && action.amount > 0) {
      let allActions = this.state.allActions;
      if (allActions.length > 0) {
        const lastAction = allActions[allActions.length - 1];
        if (
          lastAction.round === round &&
          lastAction.action.raiser.seatNumber === action.raiser.seatNumber
        ) {
          allActions[allActions.length - 1].action.amount = action.amount;
        } else {
          allActions.push({ action: action, round: round });
        }
      } else {
        allActions.push({ action: action, round: round });
      }
      this.setState({ allActions: allActions });
      let actions = this.state.actions;
      actions[round] = action;
      this.setState({ actions: actions });
    } else {
      let allActions = this.state.allActions;
      allActions[allActions.length - 1].action.callers = action.callers;
      this.setState({ allActions: allActions });

      let actions = this.state.actions;
      actions[round].callers = action.callers;
      this.setState({ actions: actions });
    }
  };

  displayMyHand = (cards: ICard[]) =>
    cards.map(card => (
      <Text key={"c" + card.cardNumber}>{card.cardNumber}</Text>
    ));

  getBigBlindSeat = () => {
    const bigBlindSeatNumber =
      (this.props.dealer+2) % (this.props.seats.length + 1);

    const blindSeat = this.props.seats.find(
      seat => (seat.seatNumber = bigBlindSeatNumber)
    );
    return blindSeat;
  };
  render() {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.control}>
          <Text key="my" style={styles.label}>
            My Hands:
          </Text>
          <Card
            key="m0"
            handleCard={(c: ICard) => this.handleMyHand(c, 0)}
            style={{ margin: "3px" }}
          ></Card>
          <Card
            key="m1"
            handleCard={(c: ICard) => this.handleMyHand(c, 1)}
            style={{ margin: "3px" }}
          ></Card>
          {this.displayMyHand(this.state.myHand)}
        </View>
        <View style={styles.control}>
          <Text key="p" style={styles.label}>
            Preflop Bet:
          </Text>
          <Action
            key="pre"
            bigBlind={this.props.bigBlind}
            raiser={this.getBigBlindSeat()}
            seats={this.props.seats}
            handleAction={a => this.handleAction(a, Round.Preflop)}
          ></Action>
        </View>
        <View style={styles.control}>
          <Text key="f" style={styles.label}>
            Flop:
          </Text>
          <Card
            key="b0"
            handleCard={(c: ICard) => this.handleBoard(c, 0)}
          ></Card>
          <Card
            key="b1"
            handleCard={(c: ICard) => this.handleBoard(c, 1)}
          ></Card>
          <Card
            key="b2"
            handleCard={(c: ICard) => this.handleBoard(c, 2)}
          ></Card>
        </View>
        <View style={styles.control}>
          <Text key="fr" style={styles.label}>
            Flop Bet:
          </Text>
          <Action
            key="flop"
            seats={this.props.seats}
            handleAction={a => this.handleAction(a, Round.Flop)}
          ></Action>
        </View>
        <View style={styles.control}>
          <Text key="t" style={styles.label}>
            Turn:
          </Text>
          <Card
            key="b3"
            handleCard={(c: ICard) => this.handleBoard(c, 3)}
          ></Card>
        </View>
        <View style={styles.control}>
          <Text key="tr" style={styles.label}>
            Turn Bet:
          </Text>
          <Action
            key="turn"
            seats={this.props.seats}
            handleAction={a => this.handleAction(a, Round.Turn)}
          ></Action>
        </View>
        <View style={styles.control}>
          <Text key="r" style={styles.label}>
            River:
          </Text>
          <Card
            key="b4"
            handleCard={(c: ICard) => this.handleBoard(c, 4)}
          ></Card>
        </View>
        <View style={styles.control}>
          <Text key="rb" style={styles.label}>
            River Bet:
          </Text>
          <Action
            key="river"
            seats={this.props.seats}
            handleAction={a => this.handleAction(a, Round.River)}
          ></Action>
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
  },
  label: { paddingRight: "7px", textAlign: "right", width: "100px" },
  control: { flex: 1, flexDirection: "row", margin: "3px" }
});
