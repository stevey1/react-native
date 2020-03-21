import React, { Component } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Card from "./Card";
import Action from "./Action";
import Caller from "./Caller";
import i18n from "../i18n";
import { getRoundText, getCardColor, getCardText } from "../constants/helper";
import { RaiseType, CallType } from "../constants/DataTypes";
import MyButton from "../components/MyButton";
import styles from "./styles";

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
    seats: ISeat[];
  },
  {
    myHand: ICard[];
    board: ICard[];
    actions: IAction[];
    allActions: IActionHistory[];
    currentRound: Round;
    callerModalVisible: boolean;
  }
> {
  state = {
    myHand: [] as ICard[],
    board: [] as ICard[],
    actions: [] as IAction[],
    allActions: [] as IActionHistory[],
    currentRound: Round.Preflop,
    callerModalVisible: false
  };
  constructor(props: { bigBlind: number; seats: ISeat[] }) {
    super(props);
    const raiser = this.getBigBlindSeat();
    const action: IAction = {
      raiser: raiser,
      amount: this.props.bigBlind,
      callers: [] as ISeat[],
      raises: 0,
      checkRaise: false
    };
    const actions = this.state.actions;
    actions[Round.Preflop] = action;

    const allActions = this.state.allActions;
    allActions.push({ action: action, round: Round.Preflop });
    // don't need to call this; be carefull when using object or object arry in props and stats, it update them
    // this.props.seat.seatNumber+1, seatNumber get updated, crazy!!!
    //this.setState({ actions: actions, allActions: allActions });
    this.state = {
      myHand: [] as ICard[],
      board: [] as ICard[],
      actions: actions,
      allActions: allActions,
      currentRound: Round.Preflop,
      callerModalVisible: false
    };
  }

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
    let allActions = this.state.allActions;
    let actions = this.state.actions;
    const lastAction = actions[round];

    if (lastAction) {
      if (
        lastAction.raiser.seatNumber === action.raiser.seatNumber &&
        lastAction.raises > 0
      ) {
        // the same person
        action.raises = lastAction.raises;
        action.checkRaise = lastAction.checkRaise;
        allActions[allActions.length - 1].action = action;
      } else {
        action.raises = lastAction.raises + 1;
        action.checkRaise =
          action.raises > 1 &&
          this.setCheckRaise(
            lastAction.raiser.betOrder,
            action.raiser.betOrder,
            round
          );
        allActions.push({ action: action, round: round });
      }
    } else {
      action.raises = 1;
      action.checkRaise = false;
      allActions.push({ action: action, round: round });
    }

    actions[round] = action;

    this.setState({
      allActions: allActions,
      actions: actions,
      currentRound: round
    });
  };
  handleCallers = (callers: ISeat[]) => {
    this.setState({ callerModalVisible: false });
    if (callers.length == 0) return;
    const allActions = this.state.allActions;
    allActions[allActions.length - 1].action.callers = callers;

    const actions = this.state.actions;
    actions[this.state.currentRound].callers = callers;

    this.setState({ actions: actions, allActions: allActions });
    let currentRound = this.state.currentRound;

    if (this.state.currentRound !== Round.River) {
      currentRound++;
      this.setState({ currentRound: currentRound });
    }
  };

  setCheckRaise = (betOrder1: number, betOrder2: number, round: Round) => {
    return (
      this.getBetOrder(betOrder2, round) < this.getBetOrder(betOrder1, round)
    );
  };

  getBetOrder = (betOrder: number, round: Round) => {
    if (round !== Round.Preflop) return betOrder;
    const seatIndex = this.props.seats.findIndex(s => s.betOrder === betOrder);
    const indexFromDealer = this.props.seats.length - 1 - seatIndex;
    if (indexFromDealer === 1 || indexFromDealer == 2) {
      return betOrder + this.props.seats.length;
    }
    return betOrder;
  };

  displayCards = (cards: ICard[]) =>
    cards
      .sort((a, b) => a.cardNumber - b.cardNumber)
      .map(card => (
        <Text
          key={"c" + card.cardNumber.toString() + card.suit.toString()}
          style={getCardColor(card.suit)}
        >
          {getCardText(card)}
        </Text>
      ));
  displayAction = () => {
    if (this.state.actions.length === 0) return <View></View>;
    let display = [];
    display.push(this.displayRoundAction(Round.Preflop));
    if (this.state.actions.length === 1) return display;

    display.push(this.displayRoundAction(Round.Flop));
    if (this.state.actions.length === 2) return display;

    display.push(this.displayRoundAction(Round.Turn));
    if (this.state.actions.length === 3) return display;

    display.push(this.displayRoundAction(Round.River));
    return display;
  };
  displayRoundAction = (round: Round) => {
    const action = this.state.actions[round];
    return action ? (
      <View>
        <Text
          key={"c" + round}
          style={
            action.checkRaise && !action.raiser.player.isMe
              ? { color: "#ff0000", fontSize: 16 }
              : {}
          }
        >
          {action.checkRaise && !action.raiser.player.isMe
            ? "***" + i18n.t("action.checkRaise") + "***"
            : ""}
        </Text>
        <Text
          key={"a" + round}
          style={
            action.raises > 1 && !action.raiser.player.isMe
              ? { color: "#ff0000", fontSize: 16 }
              : { fontSize: 14 }
          }
        >
          {action.raiser.player.name +
            ((!action.raiser.player.isMe &&
              "_" + RaiseType[action.raiser.player.raiseType]) ||
              "") +
            " " +
            action.raises +
            i18n.t("action.raise") +
            " " +
            action.amount +
            "$; " +
            i18n.t("action.players") +
            ": " +
            (action.callers.length + 1) +
            action.callers.reduce(
              (p, c) =>
                p +
                ((p !== " - " && ", ") || "") +
                c.player.name +
                (c.player.isMe ? "" : "_" + CallType[c.player.callType]),
              " - "
            )}
        </Text>
      </View>
    ) : (
      <View></View>
    );
  };
  displayPot = () => {
    const pot = this.state.allActions.reduce(
      (preAction, currentAction) =>
        preAction +
        currentAction.action.amount * (currentAction.action.callers.length + 1),
      0
    );
    return (
      <Text style={{ fontSize: 14 }}>
        {i18n.t("action.pot") + ":" + pot.toString()}$
      </Text>
    );
  };

  getBigBlindSeat = () => {
    const bigBlindSeatIndex =
      (this.props.seats.length - 1 + 2) % this.props.seats.length;

    return this.props.seats[bigBlindSeatIndex];
  };
  private getSeatsInPlay = (round: Round) => {
    if (round === Round.Preflop) {
      const totalSeats = this.props.seats.length;
      const seats = this.props.seats.map((s, index) => ({
        ...s,
        betOrder:
          index === 0
            ? totalSeats - 2
            : index === 1
            ? totalSeats - 1
            : s.betOrder - 2
      }));
      return this.sortSeats(seats);
    }
    const action = this.state.actions[round - 1];
    return this.sortSeats([action.raiser, ...action.callers]);
  };
  sortSeats = (seats: ISeat[]) =>
    seats.sort((s1, s2) => s1.betOrder - s2.betOrder);
  private showCallerButton = () => (
    <View style={styles.control}>
      <Text key="p" style={styles.label}>
        {i18n.t("play.callers")}:
      </Text>
      <MyButton
        label=""
        onPress={() => {
          if (!this.state.actions[this.state.currentRound])
            this.setState({ currentRound: this.state.currentRound - 1 });
          this.setState({ callerModalVisible: true });
        }}
        style={{ width: 100 }}
      />
    </View>
  );
  showCaller = () =>
    this.state.callerModalVisible ? (
      <Caller
        modalVisible={this.state.callerModalVisible}
        raiserSeatNumber={
          (this.state.actions[this.state.currentRound] &&
            this.state.actions[this.state.currentRound].raiser.seatNumber) ||
          0
        }
        seats={this.getSeatsInPlay(this.state.currentRound)}
        callers={this.state.actions[this.state.currentRound].callers.map(
          c => c.seatNumber
        )}
        callersSelected={this.handleCallers}
      ></Caller>
    ) : (
      <View></View>
    );
  showCurrentRound = () => {
    if (this.state.currentRound === Round.Preflop) return <View></View>;
    let roundData = [
      <View key="r1">
        {this.getRoundData(0, 3, getRoundText(Round.Flop), Round.Flop)}
      </View>
    ];
    if (this.state.currentRound === Round.Flop) return <View>{roundData}</View>;

    roundData.push(
      <View key="r2">
        {this.getRoundData(3, 1, getRoundText(Round.Turn), Round.Turn)}
      </View>
    );
    if (this.state.currentRound === Round.Turn) return <View>{roundData}</View>;

    roundData.push(
      <View key="r3">
        {this.getRoundData(4, 1, getRoundText(Round.River), Round.River)}
      </View>
    );
    return <View>{roundData}</View>;
  };
  getCards = (start: number, totalCards: number) => {
    let cards = [];
    for (let i = start; i < start + totalCards; i++) {
      cards.push(
        <Card
          key={"c" + i}
          handleCard={(c: ICard) => this.handleBoard(c, i)}
        ></Card>
      );
    }
    return <View style={styles.control}>{cards}</View>;
  };
  getRoundData = (
    start: number,
    totalCards: number,
    label: string,
    round: Round
  ) => {
    return (
      <View>
        <View key="l" style={styles.control}>
          <Text key="f" style={styles.label}>
            {label}:
          </Text>
          {this.getCards(start, totalCards)}
        </View>
        <View key="c" style={styles.control}>
          <Text key="t" style={styles.label}>
            {i18n.t("play.raise")}:
          </Text>
          <Action
            key="a"
            seats={this.getSeatsInPlay(round)}
            handleAction={a => this.handleAction(a, round)}
          ></Action>
        </View>
        {this.displayRoundAction(round)}
      </View>
    );
  };
  render() {
    return (
      <ScrollView>
        <View style={styles.control}>
          <Text key="my" style={styles.label}>
            {i18n.t("play.myHand")}:
          </Text>
          <Card
            key="m0"
            handleCard={(c: ICard) => this.handleMyHand(c, 0)}
          ></Card>
          <Card key="m1" handleCard={c => this.handleMyHand(c, 1)}></Card>
        </View>
        <View style={styles.control}>
          <Text key="p" style={styles.label}>
            {i18n.t("play.preFlop")}:
          </Text>
          <Action
            key="pre"
            bigBlind={this.props.bigBlind}
            seats={this.getSeatsInPlay(Round.Preflop)}
            handleAction={a => this.handleAction(a, Round.Preflop)}
          ></Action>
        </View>
        {this.displayRoundAction(Round.Preflop)}

        {this.showCurrentRound()}
        {this.showCallerButton()}
        {this.showCaller()}
        <View style={{ flexDirection: "row" }}>
          <Text>{i18n.t("play.myHand")}:</Text>
          {this.displayCards(this.state.myHand)}
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>{i18n.t("play.flop")}:</Text>
          {this.displayCards(this.state.board)}
        </View>
        <View>{this.displayPot()}</View>
      </ScrollView>
    );
  }
}
