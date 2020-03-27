import React, { useState } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button } from "react-native-elements";
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
import MyDropDownButton from "../components/MyDropDownButton";
import styles from "./styles";

import {
  ISeat,
  ICard,
  IAction,
  IActionHistory,
  Round
} from "../constants/DataTypes";
import { useQuery } from "@apollo/react-hooks";
import { GET_GAME_FORMAT, GET_SEATS } from "../constants/apolloQuery";
interface IProps {
  navigation: any;
  straddles;
  handleStraddlesChange: (straddles: number) => void;
}
export default function Play(props: IProps) {
  const [CurrentRound, setCurrentRound] = useState(Round.Preflop);
  const [MyHand, setMyHand] = useState([]);
  const [Board, setBoard] = useState([]);
  const [CallerModalVisible, setCallerModalVisible] = useState(false);

  const GameFormat = getGameFormat();
  const BigBlind =
    props.straddles > 0
      ? GameFormat.straddle * Math.pow(2, props.straddles - 1)
      : GameFormat.bigBlind;
  const Seats = getSeats();
  const PreFlopSeats = getSeatsInPlay(Round.Preflop, props.straddles);

  const raiser = PreFlopSeats[Seats.length - 1];
  const action: IAction = {
    raiser: raiser,
    amount: BigBlind,
    callers: [] as ISeat[],
    raises: 0,
    checkRaise: false
  };
  const [Actions, setActions] = useState([action]);
  const [AllActions, setAllActions] = useState([
    { action: action, round: Round.Preflop }
  ]);

  const handleStraddle = (newGame: boolean) => {
    const straddles = (props.straddles + 1) % (Seats.length - 2);
    props.handleStraddlesChange(straddles);
    props.navigation.navigate("playNav");
  };

  function getSeatsInPlay(round: Round, straddles = 0) {
    if (round === Round.Preflop) {
      const seats = Seats.map((s, index) => ({
        ...s,
        betOrder:
          index - 2 - straddles + (index > 1 + straddles ? 0 : Seats.length)
      }));
      return sortSeats(seats);
    }
    const action = Actions[Math.min(Actions.length - 1, round - 1)];
    return sortSeats([action.raiser, ...action.callers]);
  }

  const handleMyHand = (card: ICard, cardId: number) => {
    const cards = [...MyHand];
    cards[cardId] = card;
    setMyHand(cards);
  };
  const handleBoard = (card: ICard, cardId: number) => {
    let cards = [...Board];
    cards[cardId] = card;
    setBoard(cards);
  };
  const handleAction = (raiser: ISeat, amount: number, round: Round) => {
    let action = {
      raiser: raiser,
      amount: amount,
      raises: 0,
      checkRaise: false,
      callers: []
    };
    let allActions = [...AllActions];
    let actions = [...Actions];

    const lastAction = actions[round];
    if (lastAction) {
      if (lastAction.raiser.id === action.raiser.id && lastAction.raises > 0) {
        // the same person
        action.raises = lastAction.raises;
        action.checkRaise = lastAction.checkRaise;
        allActions[allActions.length - 1].action = action;
      } else {
        action.raises = lastAction.raises + 1;
        action.checkRaise =
          action.raises > 1 &&
          lastAction.raiser.betOrder > action.raiser.betOrder;

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

  const showCallerButton = () => (
    <View style={styles.control}>
      <Text key="p" style={styles.label}>
        {i18n.t("play.callers")}:
      </Text>
      <MyDropDownButton
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
        raiserSeatId={
          (Actions[CurrentRound] && Actions[CurrentRound].raiser.id) || 0
        }
        seats={getSeatsInPlay(CurrentRound)}
        callers={Actions[CurrentRound].callers.map(c => c.id)}
        callersSelected={handleCallers}
      ></Caller>
    ) : (
      <View></View>
    );
  const showCurrentRound = () => {
    if (CurrentRound === Round.Preflop) return <View></View>;
    let roundData = [
      <View key="r1">
        {showRoundData(0, 3, getRoundText(Round.Flop), Round.Flop)}
      </View>
    ];
    roundData.push(
      <View key="r2">
        {showRoundData(3, 1, getRoundText(Round.Turn), Round.Turn)}
      </View>
    );

    roundData.push(
      <View key="r3">
        {showRoundData(4, 1, getRoundText(Round.River), Round.River)}
      </View>
    );
    return <View>{roundData}</View>;
  };
  const showCards = (start: number, totalCards: number) => {
    let cards = [];
    for (let i = start; i < start + totalCards; i++) {
      cards.push(
        <Card key={"c" + i} handleCard={(c: ICard) => handleBoard(c, i)}></Card>
      );
    }
    return <View style={styles.control}>{cards}</View>;
  };
  const showRoundData = (
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
          {showCards(start, totalCards)}
        </View>
        <View key="c" style={styles.control}>
          <Text key="t" style={styles.label}>
            {i18n.t("play.raise")}:
          </Text>
          <Action
            key="a"
            seats={getSeatsInPlay(round)}
            handleAction={(r, a) => handleAction(r, a, round)}
          ></Action>
        </View>
        {displayRoundAction(Action[round], round)}
      </View>
    );
  };
  const showTips = () => {
    const myHand = MyHand.sort((c1, c2) => c1.cardNumber - c2.cardNumber);

    const board = Board;
    let result = "";
    if (board.length < 3) {
      result =
        myHand.length < 2
          ? ""
          : getMyHandPreflop(
              myHand,
              PreFlopSeats.findIndex(s => s.player.isMe) ?? 0,
              Seats.length,
              BigBlind,
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
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View>
          <View style={[styles.control]}>
            <Text key="my" style={styles.label}>
              {i18n.t("play.myHand")}:
            </Text>
            <Card key="m0" handleCard={c => handleMyHand(c, 0)}></Card>
            <Card key="m1" handleCard={c => handleMyHand(c, 1)}></Card>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={styles.control}>
              <Text key="p" style={styles.label}>
                {i18n.t("round." + Round.Preflop)}:
              </Text>
              <Action
                key={"pre"}
                bigBlind={BigBlind}
                seats={PreFlopSeats}
                handleAction={(r, a) => handleAction(r, a, Round.Preflop)}
              ></Action>
            </View>

            <Button
              buttonStyle={{ backgroundColor: "#D1D1D1" }}
              style={{ flex: 1, marginRight: 2 }}
              title={i18n.t("button.straddle")}
              titleStyle={{ color: "#000000" }}
              onPress={() => handleStraddle(false)}
            />
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
          <View>{displayPot(AllActions)}</View>
          {showTips()}
          <Button
            buttonStyle={{ backgroundColor: "#D1D1D1" }}
            style={{ width: 105, marginRight: 3 }}
            title={i18n.t("button.new")}
            titleStyle={{ color: "#000000" }}
            onPress={() => handleStraddle(true)}
          />
        </View>
      </View>
    </ScrollView>
  );
}
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
const getSeats = () => {
  const { data } = useQuery(GET_SEATS);
  return data.seats;
};
const getGameFormat = () => {
  const { data } = useQuery(GET_GAME_FORMAT);
  return data.gameFormat;
};
const sortSeats = (seats: ISeat[]) =>
  seats.sort((s1, s2) => s1.betOrder - s2.betOrder);

const displayPot = (allActions: IActionHistory[]) => {
  const pot = allActions.reduce(
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
const displayRoundAction = (action: IAction, round: Round) => {
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
