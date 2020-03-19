import React, { Component } from "react";
import { StyleSheet, Text, View, ProgressViewIOS } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Card from "./Card";
import Action from "./Action";
import Caller from "./Caller";
import i18n from "../i18n";
import {
  getRoundText,
  getCardColor,
  getNumberText,
  getSuitText
} from "../constants/helper";
import MyButton from "../components/MyButton";
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

  componentDidMount = () => {
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
    this.setState({ actions: actions, allActions: allActions });
  };
  handleMyHand = (card: ICard, cardId: number) => {
    const cards = this.state.myHand || [];
    cards[cardId] = card;
    console.log("myHand", cards);
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
          lastAction.raiser.seatNumber === action.raiser.seatNumber &&
          lastAction.amount !== this.props.bigBlind
        ) {
          // the same person
          allActions[allActions.length - 1].action = action;
        } else {
          action.raises = lastAction.raises + 1;
          action.checkRaise =
            action.raises > 1 &&
            this.setCheckRaise(
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

  displayCards = (cards: ICard[]) =>
    cards
      .sort((a, b) => a.cardNumber - b.cardNumber)
      .map(card => (
        <Text
          key={"c" + card.cardNumber.toString() + card.suit.toString()}
          style={getCardColor(card.suit)}
        >
          {getSuitText(card.suit) + getNumberText(card.cardNumber)}
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
    return (
      <Text
        style={[
          action.raises > 1 ? { color: "#ff0000", fontSize: 12 } : {},
          action.checkRaise ? { color: "#ff0000", fontSize: 18 } : {}
        ]}
      >
        {action.checkRaise ? "Check Raise" : ""}#{action.raises} by{" "}
        {action.raiser.seatNumber}, {action.amount}$, plays in play:{" "}
        {action.callers.length + 1}
      </Text>
    );
  };
  displayPot = () => {
    const pot = this.state.allActions.reduce(
      (preAction, currentAction) =>
        preAction +
        currentAction.action.amount * (currentAction.action.callers.length + 1),
      0
    );
    return <Text>Pot: {pot.toString()}$</Text>;
  };

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

  showCurrentRound = () => {
    if (this.state.currentRound === Round.Preflop) return <View></View>;
    let roundData = [
      <View key="r1">
        {this.getRoundData(0, 3, getRoundText(Round.Flop), Round.Flop)}
      </View>
    ];
    if (this.state.currentRound > Round.Flop) {
      roundData.push(
        <View key="r2">
          {this.getRoundData(3, 1, getRoundText(Round.Turn), Round.Turn)}
        </View>
      );
      if (this.state.currentRound === Round.River) {
        roundData.push(
          <View key="r3">
            {this.getRoundData(4, 1, getRoundText(Round.River), Round.River)}
          </View>
        );
      }
    }
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
            style={{ margin: 3 }}
          ></Card>
          <Card
            key="m1"
            handleCard={c => this.handleMyHand(c, 1)}
            style={{ margin: 3 }}
          ></Card>
        </View>
        <View style={styles.control}>
          <Text key="p" style={styles.label}>
            {i18n.t("play.preFlop")}:
          </Text>
          <Action
            key="pre"
            bigBlind={this.props.bigBlind}
            raiser={this.getBigBlindSeat()}
            seats={this.getSeatsInPlay(this.state.currentRound)}
            handleAction={a => this.handleAction(a, Round.Preflop)}
          ></Action>
        </View>
        {this.showCurrentRound()}
        {this.showCallerButton()}
        <Caller
          modalVisible={this.state.callerModalVisible}
          seats={this.getSeatsInPlay(this.state.currentRound).filter(
            seat =>
              !this.state.actions[this.state.currentRound] ||
              seat.seatNumber !==
                this.state.actions[this.state.currentRound].raiser.seatNumber
          )}
          callersSelected={this.handleCallers}
        ></Caller>
        <View style={{ flexDirection: "row" }}>
          <Text>{i18n.t("play.myHand")}:</Text>
          {this.displayCards(this.state.myHand)}
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>{i18n.t("play.flop")}:</Text>
          {this.displayCards(this.state.board)}
        </View>
        <View>{this.displayAction()}</View>
        <View>{this.displayPot()}</View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  label: {
    paddingRight: 7,
    textAlign: "right",
    width: 85
  },
  control: { flex: 1, flexDirection: "row", margin: 1 }
});
