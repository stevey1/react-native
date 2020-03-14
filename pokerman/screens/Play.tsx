import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { RectButton, ScrollView } from "react-native-gesture-handler";
import Card from "./Card";
import Action from "./Action";
import Caller from "./Caller";
import OptionButton from "./OptionButton";
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
    dealerSeatIndex: number;
    seats: ISeat[];
  },
  {
    myHand: ICard[];
    board: ICard[];
    actions: IAction[];
    allActions: IActionHistory[];
    showCaller: boolean;
  }
> {
  state = {
    myHand: [] as ICard[],
    board: [] as ICard[],
    actions: [] as IAction[],
    allActions: [] as IActionHistory[],
    showCaller: false
  };

  componentDidMount = () => {
    const raiser = this.getBigBlindSeat();
    const action: IAction = {
      raiser: raiser,
      amount: this.props.bigBlind,
      callers: [] as ISeat[],
      raises: 1,
      checkRaise: false
    };
    const actions = this.state.actions;
    actions[Round.Preflop] = action;
    this.setState({ actions: actions });
    const allActions = this.state.allActions;
    allActions.push({ action: action, round: Round.Preflop });
    // don't need to call this; be carefull when using object or object arry in props and stats, it update them
    // this.props.seat.seatNumber+1, seatNumber get updated, crazy!!!
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
    action.raises = 1;
    action.checkRaise = false;
    let allActions = this.state.allActions;
    let actions = this.state.actions;
    if (allActions.length > 0) {
      if (allActions[allActions.length - 1].round === round) {
        const lastAction = allActions[allActions.length - 1].action;
        if (
          lastAction.raiser.seatNumber === action.raiser.seatNumber ||
          (round === Round.Preflop &&
            allActions.length === 1 &&
            lastAction.amount === this.props.bigBlind)
        ) {
          // the same person or overrid big blind
          allActions[allActions.length - 1].action = action;
        } else {
          action.raises = lastAction.raises + 1;
          action.checkRaise = this.setCheckRaise(
            lastAction.raiser.seatNumber,
            action.raiser.seatNumber,
            round
          );
          allActions.push({ action: action, round: round });
        }
      } else {
        allActions.push({ action: action, round: round });
      }
    } else {
      allActions.push({ action: action, round: round });
    }
    this.setState({ allActions: allActions });

    actions[round] = action;
    this.setState({ actions: actions });
  };
  handleCallers = (callers: ISeat[], round: Round) => {
    const allActions = this.state.allActions;
    allActions[allActions.length - 1].action.callers = callers;
    this.setState({ allActions: allActions });

    const actions = this.state.actions;
    actions[round].callers = callers;
    this.setState({ actions: actions });
  };

  setCheckRaise = (previousSeat: number, currentSeat: number, round: Round) => {
    return (
      this.getActionOrder(currentSeat, round) <
      this.getActionOrder(previousSeat, round)
    );
  };

  getActionOrder = (seatNumber: number, round: Round) => {
    const dealerSeatIndex =
      round === Round.Preflop
        ? (this.props.dealerSeatIndex + 2) % this.props.seats.length
        : this.props.dealerSeatIndex;
    const dealerSeatNumber = this.props.seats[dealerSeatIndex].seatNumber;
    // const seatIndex = this.getSeatIndex(seatNumber);
    return seatNumber > dealerSeatNumber ? seatNumber : seatNumber + 10; //this.props.seats.length;
  };

  displayMyHand = (cards: ICard[]) =>
    cards.map(card => (
      <Text key={"c" + card.cardNumber}>{card.cardNumber}</Text>
    ));

  getBigBlindSeat = () => {
    const bigBlindSeatIndex =
      (this.props.dealerSeatIndex + 2) % this.props.seats.length;

    return this.props.seats[bigBlindSeatIndex];
  };
  private getSeatsInPlay = (round: Round) => {
    let seats = this.props.seats;
    if (round === Round.Preflop) return seats;

    let action = this.getLastAction(Round.Preflop);
    if (action) {
      seats = [action.raiser as any, ...action.callers];
    }
    if (round === Round.Flop) return seats;

    action = this.getLastAction(Round.Flop);
    if (action) {
      seats = [action.raiser as any, ...action.callers];
    }

    if (round === Round.Turn) return seats;

    action = this.getLastAction(Round.Turn);
    if (action) {
      seats = [action.raiser as any, ...action.callers];
    }
    return seats;
  };
  private getLastAction = (round: Round) => this.state.actions[round];
  private showCallerButton = () => {
    return this.state.showCaller ? (
      <View></View>
    ) : (
      <View style={styles.control}>
        <OptionButton
          icon="md-school"
          label="Callers"
          isLastOption={false}
          onPress={() => {
            this.setState({ showCaller: true });
          }}
        />
      </View>
    );
  };
  private showCaller = () => {
    return !this.state.showCaller ? (
      <View></View>
    ) : (
      <View style={styles.control}>
        <Text key="p" style={styles.label}>
          Callers:
        </Text>
        <Caller
          key="caller"
          seats={this.props.seats}
          handleCallers={c => this.handleCallers(c, Round.River)}
        ></Caller>
      </View>
    );
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
            handleCallers={c => this.handleCallers(c, Round.Preflop)}
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
            seats={this.getSeatsInPlay(Round.Flop)}
            handleAction={a => this.handleAction(a, Round.Flop)}
            handleCallers={c => this.handleCallers(c, Round.Flop)}
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
            seats={this.getSeatsInPlay(Round.Turn)}
            handleAction={a => this.handleAction(a, Round.Turn)}
            handleCallers={c => this.handleCallers(c, Round.Turn)}
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
            seats={this.getSeatsInPlay(Round.River)}
            handleCallers={c => this.handleCallers(c, Round.River)}
            handleAction={a => this.handleAction(a, Round.River)}
          ></Action>
        </View>
        {this.showCallerButton()}

        {this.showCaller()}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  label: { paddingRight: "7px", textAlign: "right", width: "100px" },
  control: { flex: 1, flexDirection: "row", margin: "3px" }
});
