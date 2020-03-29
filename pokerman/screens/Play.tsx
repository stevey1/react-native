import React, { useState } from "react";
import { Text, View, SectionList, ActionSheetIOS } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Overlay } from "react-native-elements";
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
import styles, { sectionListStyles } from "./styles";

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
  const [ShowTipOverlay, setShowTipOverlay] = useState(false);
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
  const PreFlopSeats = getSeatsInPlay(Round.Preflop);

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
    const straddles = newGame ? 0 : (props.straddles + 1) % (Seats.length - 2);
    props.handleStraddlesChange(straddles);
    props.navigation.navigate("playNav");
  };

  function getSeatsInPlay(round: Round) {
    if (round === Round.Preflop) {
      //&& (!AllActions || AllActions.length === 1)
      const seats = Seats.map((seat, index) => ({
        ...seat,
        betOrder:
          index -
          2 -
          props.straddles +
          (index > 1 + props.straddles ? 0 : Seats.length)
      }));
      return sortSeats(seats);
    }
    // if (round === Round.Preflop) {
    //   return sortSeats(Seats);
    // }
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
    const allActions = [...AllActions];
    allActions[allActions.length - 1].action.callers = callers;

    const actions = [...Actions];
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
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
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
      <Text style={{ fontSize: 18 }}>{displayPot(AllActions)}</Text>
    </View>
  );
  const callersOverlay = () =>
    CallerModalVisible ? (
      <Caller
        modalVisible={CallerModalVisible}
        raiserSeatId={
          (Actions[CurrentRound] && Actions[CurrentRound]?.raiser.id) || 0
        }
        seats={getSeatsInPlay(CurrentRound)}
        callers={Actions[CurrentRound]?.callers.map(c => c.id)}
        callersSelected={handleCallers}
      ></Caller>
    ) : (
      <View></View>
    );
  const showCurrentRound = () => {
    if (CurrentRound === Round.Preflop) return <View></View>;
    let roundData = [<View key="r1">{showRoundData(Round.Flop)}</View>];
    roundData.push(<View key="r2">{showRoundData(Round.Turn)}</View>);

    roundData.push(<View key="r3">{showRoundData(Round.River)}</View>);
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
  const showRoundData = (round: Round) => {
    return (
      <View key="c" style={styles.control}>
        <Text key="t" style={styles.label}>
          {i18n.t("round." + round) + " " + i18n.t("play.raise")}:
        </Text>
        <Action
          key="a"
          seats={getSeatsInPlay(round)}
          handleAction={(r, a) => handleAction(r, a, round)}
        ></Action>
        <Text>{showCallerSeats(round)}</Text>
      </View>
    );
  };
  const showTips = () => {
    const myHand = [...MyHand]
      .filter(x => x)
      .sort((c1, c2) => c1.cardNumber - c2.cardNumber);
    const board = [...Board]
      .filter(x => x)
      .sort((c1, c2) => c1.cardNumber - c2.cardNumber);
    let tips = [];
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
              Actions[Round.Preflop],
              GameFormat.gameType,
              [...AllActions]
            );
      if (result)
        tips.push(
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.text}>{i18n.t("play.myHand")}: </Text>
            <Text key="a" style={styles.text}>
              {result}
            </Text>
          </View>
        );
    }

    result = getActionTip([...AllActions]);
    if (result)
      tips.push(
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.text}>{i18n.t("play.action")}: </Text>
          <Text key="a" style={styles.text}>
            {result}
          </Text>
        </View>
      );

    if (board.length < 3) {
      return <View>{tips}</View>;
    }
    tips.push(
      <View style={{ flexDirection: "row" }}>
        <Text key="b" style={styles.text}>
          {i18n.t("play.board")}:
        </Text>
        <View>{formatResult(checkBoard(board))}</View>
      </View>
    );
    if (myHand.length == 2) {
      tips.push(
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.text}>{i18n.t("play.iHave")}: </Text>
          <View>{formatResult(checkMyHand(board, myHand))}</View>
        </View>
      );
    }
    return <View>{tips}</View>;
  };
  const formatResult = (results: string[]) =>
    results.map((x, index) => (
      <Text key={index} style={styles.text}>
        {x}
      </Text>
    ));

  const tipOverlay = () => {
    if (!ShowTipOverlay) return <View></View>;

    const actions = [
      {
        title: i18n.t("round." + Round.Preflop),
        data: displayRoundAction(Actions, Round.Preflop)
      },
      {
        title: i18n.t("round." + Round.Flop),
        data: displayRoundAction(Actions, Round.Flop)
      },
      {
        title: i18n.t("round." + Round.Turn),
        data: displayRoundAction(Actions, Round.Turn)
      },
      {
        title: i18n.t("round." + Round.River),
        data: displayRoundAction(Actions, Round.River)
      }
    ];

    return (
      <Overlay
        overlayBackgroundColor="#F5F5F5"
        width="90%"
        height="60%"
        isVisible={ShowTipOverlay}
        onBackdropPress={() => setShowTipOverlay(false)}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={[sectionListStyles.container]}>
            <SectionList
              sections={actions}
              renderItem={({ item }) => (
                <Text style={sectionListStyles.item}>{item}</Text>
              )}
              renderSectionHeader={({ section }) => (
                <Text style={sectionListStyles.sectionHeader}>
                  {section.title}
                </Text>
              )}
              keyExtractor={(item, index) => index}
            />
          </View>
        </ScrollView>
      </Overlay>
    );
  };
  const showCallerSeats = (round: Round) => {
    if (Actions.length - 1 < round || Actions[round].callers.length == 0)
      return "";

    return (
      "C: " + Actions[round].callers.map(caller => caller.id + 1).join(", ")
    );
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View>
          <View
            style={[
              styles.control,
              { flex: 1, justifyContent: "space-between" }
            ]}
          >
            <View style={[styles.control]}>
              <Text style={styles.label}>{i18n.t("play.myHand")}:</Text>
              <Card key="m0" handleCard={c => handleMyHand(c, 0)}></Card>
              <Card key="m1" handleCard={c => handleMyHand(c, 1)}></Card>
            </View>
            <Button
              buttonStyle={{ backgroundColor: "#D1D1D1" }}
              title={i18n.t("button.straddle")}
              titleStyle={{ color: "#000000" }}
              onPress={() => handleStraddle(false)}
            />
          </View>
          <View style={styles.control}>
            <Text key="f" style={styles.label}>
              {getRoundText(Round.Flop)}:
            </Text>
            {showCards(0, 3)}
          </View>
          <View style={styles.control}>
            <Text key="f1" style={styles.label}>
              {getRoundText(Round.Turn)}:
            </Text>
            {showCards(3, 1)}
            <Text key="f2" style={styles.label}>
              {getRoundText(Round.River)}:
            </Text>
            {showCards(4, 1)}
          </View>
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
            <Text>{showCallerSeats(Round.Preflop)}</Text>
          </View>

          {showCurrentRound()}
          {showCallerButton()}
          {callersOverlay()}
          {tipOverlay()}
        </View>
        <View>
          {showTips()}
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Button
              buttonStyle={{ backgroundColor: "#D1D1D1" }}
              style={{ marginRight: 3, flex: 1 }}
              title={i18n.t("button.new")}
              titleStyle={{ color: "#000000" }}
              onPress={() => handleStraddle(true)}
            />
            <Button
              buttonStyle={{ backgroundColor: "#D1D1D1" }}
              title={i18n.t("button.viewHistory")}
              titleStyle={{ color: "#000000" }}
              onPress={() => setShowTipOverlay(true)}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
const displayCards = (cards: ICard[]) => {
  cards = cards
    .filter(card => card)
    .sort((a, b) => a.cardNumber - b.cardNumber);
  const suitDisplay = cards.map(card => getSuitText(card.suit)).join("");
  const cardDisplay = cards
    .map(card => getNumberText(card.cardNumber))
    .join("");
  return (
    <View style={{ flexDirection: "row" }}>
      <Text>{suitDisplay}</Text>
      <Text>{cardDisplay}</Text>
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
  return i18n.t("action.pot") + ":" + pot.toString();
};
const displayRoundAction = (actions: IAction[], round: Round) => {
  if (actions.length == 0 || round > actions.length - 1) return [];
  const action = actions[round];
  let results = [];

  if (action.checkRaise)
    results.push("***" + i18n.t("action.checkRaise") + "***");

  results.push(
    action.raiser.player.name +
      (action.raiser.player.isMe
        ? ""
        : "_" +
          i18n.t(
            "playType." +
              (round === Round.Preflop
                ? action.raiser.player.preflopRaiseType.toString()
                : action.raiser.player.raiseType.toString())
          ) +
          " " +
          action.raises +
          i18n.t("action.raise") +
          " " +
          action.amount +
          "$")
  );
  results.push(
    i18n.t("action.players") +
      ": " +
      (action.callers.length + 1).toString() +
      " - " +
      action.callers
        .map(
          caller =>
            caller.player.name +
            (caller.player.isMe
              ? ""
              : "_" +
                i18n.t(
                  "playType." +
                    (round === Round.Preflop
                      ? caller.player.preflopCallType.toString()
                      : caller.player.callType.toString())
                ))
        )
        .join(",")
  );
  return results;
};
