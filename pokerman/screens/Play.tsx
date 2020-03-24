import React, { useState } from "react";
import { Text, View } from "react-native";
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
import { PlayType } from "../constants/DataTypes";
import {
  getMyHandPreflop,
  checkBoard,
  checkMyHand,
  getActionTip
} from "../constants/master";
import MyButton from "../components/MyButton";
import styles from "./styles";

import { ISeat, ICard, IAction, Round } from "../constants/DataTypes";

interface IProps {
  bigBlind: number;
  straddle: number;
  seats: ISeat[];
}
export default function Play(props: IProps) {
  const getBigBlindSeat = () => {
    const bigBlindSeatIndex = (props.seats.length - 1 + 2) % props.seats.length;
    return props.seats[bigBlindSeatIndex];
  };
  const sortSeats = (seats: ISeat[]) =>
    seats.sort((s1, s2) => s1.betOrder - s2.betOrder);

  const getSeatsInPlay = (round: Round) => {
    if (round === Round.Preflop) {
      const totalSeats = props.seats.length;
      const seats = props.seats.map((s, index) => ({
        ...s,
        betOrder:
          index === 0
            ? totalSeats - 2
            : index === 1
            ? totalSeats - 1
            : s.betOrder - 2
      }));
      return sortSeats(seats);
    }
    const action = Actions[Math.min(Actions.length - 1, round - 1)];
    return sortSeats([action.raiser, ...action.callers]);
  };

  const raiser = getBigBlindSeat();
  const action: IAction = {
    raiser: raiser,
    amount: props.bigBlind,
    callers: [] as ISeat[],
    raises: 0,
    checkRaise: false
  };
  const [MyHand, setMyHand] = useState([]);
  const [Board, setBoard] = useState([]);
  const [Actions, setActions] = useState([action]);
  const [AllActions, setAllActions] = useState([
    { action: action, round: Round.Preflop }
  ]);
  const [CurrentRound, setCurrentRound] = useState(Round.Preflop);
  const [CallerModalVisible, setCallerModalVisible] = useState(false);
  const preFlopSeats = getSeatsInPlay(Round.Preflop);
  const myBetOrder = preFlopSeats.findIndex(s => s.player.isMe);
  const [MyPreFlopBetOrder] = useState(myBetOrder);

  const handleMyHand = (card: ICard, cardId: number) => {
    const cards = MyHand || [];
    cards[cardId] = card;
    setMyHand(cards);
  };
  const handleBoard = (card: ICard, cardId: number) => {
    let cards = Board || [];
    cards[cardId] = card;
    setBoard(cards);
  };
  const handleAction = (action: IAction, round: Round) => {
    let allActions = AllActions;
    let actions = Actions;
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
          setCheckRaise(
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
    setAllActions(allActions);
    setActions(actions);
    setCurrentRound(round);
  };
  const handleCallers = (callers: ISeat[]) => {
    setCallerModalVisible(false);
    if (callers.length == 0) return;
    const allActions = AllActions;
    allActions[allActions.length - 1].action.callers = callers;

    const actions = Actions;
    actions[CurrentRound].callers = callers;

    setAllActions(allActions);
    setActions(actions);
    let currentRound = CurrentRound;

    if (CurrentRound !== Round.River) {
      currentRound++;
      setCurrentRound(currentRound);
    }
  };

  const setCheckRaise = (
    betOrder1: number,
    betOrder2: number,
    round: Round
  ) => {
    return getBetOrder(betOrder2, round) < getBetOrder(betOrder1, round);
  };

  const getBetOrder = (betOrder: number, round: Round) => {
    if (round !== Round.Preflop) return betOrder;
    const seatIndex = props.seats.findIndex(s => s.betOrder === betOrder);
    const indexFromDealer = props.seats.length - 1 - seatIndex;
    if (indexFromDealer === 1 || indexFromDealer == 2) {
      return betOrder + props.seats.length;
    }
    return betOrder;
  };

  const displayCards = (cards: ICard[]) => {
    const suitDisplay = cards
      .sort((a, b) => a.cardNumber - b.cardNumber)
      .map(card => (
        <Text
          key={"s" + card.cardNumber.toString() + card.suit.toString()}
          style={getCardColor(card.suit)}
        >
          {getSuitText(card.suit)}
        </Text>
      ));
    const cardDisplay = cards
      .sort((a, b) => a.cardNumber - b.cardNumber)
      .map(card => (
        <Text
          key={"c" + card.cardNumber.toString() + card.suit.toString()}
          style={getCardColor(card.suit)}
        >
          {getNumberText(card.cardNumber)}
        </Text>
      ));
    return (
      <View style={{ flexDirection: "row" }}>
        {suitDisplay}
        {cardDisplay}
      </View>
    );
  };

  const displayRoundAction = (round: Round) => {
    const action = Actions[round];
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
              "_" +
                PlayType[
                  (round === Round.Preflop &&
                    action.raiser.player.preflopRaiseType) ||
                    action.raiser.player.raiseType
                ]) ||
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
                (c.player.isMe
                  ? ""
                  : "_" +
                    PlayType[
                      (round === Round.Preflop &&
                        action.raiser.player.preflopCallType) ||
                        action.raiser.player.callType
                    ]),
              " - "
            )}
        </Text>
      </View>
    ) : (
      <View></View>
    );
  };
  const displayPot = () => {
    const pot = AllActions.reduce(
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

  const showCallerButton = () => (
    <View style={styles.control}>
      <Text key="p" style={styles.label}>
        {i18n.t("play.callers")}:
      </Text>
      <MyButton
        label=""
        onPress={() => {
          if (!Actions[CurrentRound]) setCurrentRound(CurrentRound - 1);
          setCallerModalVisible(true);
        }}
        style={{ width: 100 }}
      />
    </View>
  );
  const showCaller = () =>
    CallerModalVisible ? (
      <Caller
        modalVisible={CallerModalVisible}
        raiserSeatNumber={
          (Actions[CurrentRound] && Actions[CurrentRound].raiser.seatNumber) ||
          0
        }
        seats={getSeatsInPlay(CurrentRound)}
        callers={Actions[CurrentRound].callers.map(c => c.seatNumber)}
        callersSelected={handleCallers}
      ></Caller>
    ) : (
      <View></View>
    );
  const showCurrentRound = () => {
    if (CurrentRound === Round.Preflop) return <View></View>;
    let roundData = [
      <View key="r1">
        {getRoundData(0, 3, getRoundText(Round.Flop), Round.Flop)}
      </View>
    ];
    roundData.push(
      <View key="r2">
        {getRoundData(3, 1, getRoundText(Round.Turn), Round.Turn)}
      </View>
    );

    roundData.push(
      <View key="r3">
        {getRoundData(4, 1, getRoundText(Round.River), Round.River)}
      </View>
    );
    return <View>{roundData}</View>;
  };
  const getCards = (start: number, totalCards: number) => {
    let cards = [];
    for (let i = start; i < start + totalCards; i++) {
      cards.push(
        <Card key={"c" + i} handleCard={(c: ICard) => handleBoard(c, i)}></Card>
      );
    }
    return <View style={styles.control}>{cards}</View>;
  };
  const getRoundData = (
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
          {getCards(start, totalCards)}
        </View>
        <View key="c" style={styles.control}>
          <Text key="t" style={styles.label}>
            {i18n.t("play.raise")}:
          </Text>
          <Action
            key="a"
            seats={getSeatsInPlay(round)}
            handleAction={a => handleAction(a, round)}
          ></Action>
        </View>
        {displayRoundAction(round)}
      </View>
    );
  };
  const checkTips = () => {
    const myHand = MyHand.sort((c1, c2) => c1.cardNumber - c2.cardNumber);

    const board = Board;
    let result = "";
    if (board.length < 3) {
      result =
        myHand.length < 2
          ? ""
          : getMyHandPreflop(
              myHand,
              MyPreFlopBetOrder,
              props.seats.length,
              props.bigBlind,
              Actions[Round.Preflop]
            );
      return (
        <View key="p">
          <Text>{result}</Text>
        </View>
      );
    }
    let tips = [<View key="p"></View>];

    result = checkBoard(board, CurrentRound).join("; ");
    if (result)
      tips.push(
        <View key="b">
          <Text>{"Board: " + result}</Text>
        </View>
      );
    if (myHand.length == 2) {
      result = checkMyHand(board, myHand, CurrentRound).join("; ");
      if (result)
        tips.push(
          <View key="m">
            <Text>{"I have: " + result}</Text>
          </View>
        );
    }
    return <View>{tips}</View>;
  };

  return (
    <ScrollView>
      <View style={styles.control}>
        <Text key="my" style={styles.label}>
          {i18n.t("play.myHand")}:
        </Text>
        <Card key="m0" handleCard={(c: ICard) => handleMyHand(c, 0)}></Card>
        <Card key="m1" handleCard={c => handleMyHand(c, 1)}></Card>
      </View>
      <View style={styles.control}>
        <Text key="p" style={styles.label}>
          {i18n.t("play.preFlop")}:
        </Text>
        <Action
          key="pre"
          bigBlind={props.bigBlind}
          seats={preFlopSeats}
          handleAction={a => handleAction(a, Round.Preflop)}
        ></Action>
      </View>
      {
        //displayRoundAction(Round.Preflop)
      }

      {showCurrentRound()}
      {showCallerButton()}
      {showCaller()}
      <View style={{ flexDirection: "row" }}>
        <Text>{i18n.t("play.myHand")}:</Text>
        {displayCards(MyHand)}
      </View>
      <View style={{ flexDirection: "row" }}>
        <Text>{i18n.t("play.board")}:</Text>
        {displayCards(Board)}
      </View>
      <View>{displayPot()}</View>
      {checkTips()}
    </ScrollView>
  );
}
