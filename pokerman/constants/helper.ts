import {
  IPlayer,
  ISeat,
  Suit,
  ICard,
  Round,
  RaiseType,
  CallType
} from "./DataTypes";
import i18n from "../i18n";
const numberMap =
  i18n.locale === "en"
    ? [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "J",
        "Q",
        "K",
        "A"
      ]
    : [
        "",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九",
        "十",
        "J",
        "Q",
        "K",
        "A"
      ];
export const getNumberText = (value: number) => {
  return numberMap[value];
};
const suitMap =
  i18n.locale === "en" ? ["♣", "♦", "♥", "♠"] : ["草", "方", "红", "黑"];
export const getSuitText = (suit: Suit) => {
  return suitMap[suit];
};
const roundText = [
  i18n.t("play.preFlop"),
  i18n.t("play.flop"),
  i18n.t("play.turn"),
  i18n.t("play.river")
];
export const getRoundText = (round: Round) => roundText[round];

export const getCardColor = (suit: Suit) =>
  suit === Suit.d || suit === Suit.h
    ? { color: "#FF0000" }
    : { color: "#000000" };

export const getCardText = (card: ICard) =>
  getSuitText(card.suit) + getNumberText(card.cardNumber);
export const getSeatText = (seatNumber: number) =>
  i18n.t("action.seat") +
  (i18n.locale === "en" ? " " : "") +
  getNumberText(seatNumber + 1) +
  ":";

export const getPlayerText = (player: IPlayer) => player.name;
const player1 = {
  id: 1,
  name: "P1",
  raiseType: RaiseType.M,
  callType: CallType.M,
  isMe: true
};
const player2 = {
  id: 2,
  name: "P2",
  raiseType: RaiseType.M,
  callType: CallType.M,
  isMe: false
};
const player3 = {
  id: 3,
  name: "P3",
  raiseType: RaiseType.M,
  callType: CallType.M,
  isMe: false
};
const player4 = {
  id: 4,
  name: "P4",
  raiseType: RaiseType.M,
  callType: CallType.M,
  isMe: false
};
const player5 = {
  id: 5,
  name: "P5",
  raiseType: RaiseType.M,
  callType: CallType.M,
  isMe: false
};
const player6 = {
  id: 6,
  name: "P6",
  raiseType: RaiseType.M,
  callType: CallType.M,
  isMe: false
};
const player7 = {
  id: 7,
  name: "P7",
  raiseType: RaiseType.M,
  callType: CallType.M,
  isMe: false
};
const player8 = {
  id: 8,
  name: "P8",
  raiseType: RaiseType.M,
  callType: CallType.M,
  isMe: false
};
const player9 = {
  id: 9,
  name: "P9",
  raiseType: RaiseType.M,
  callType: CallType.M,
  isMe: false
};

export const AllPlayers: IPlayer[] = [
  player1,
  player2,
  player3,
  player4,
  player5,
  player6,
  player7,
  player8,
  player9,
  {
    id: 10,
    name: "P10",
    raiseType: RaiseType.M,
    callType: CallType.M,
    isMe: false
  },
  {
    id: 11,
    name: "Rock Player",
    raiseType: RaiseType.M,
    callType: CallType.M,
    isMe: false
  },
  {
    id: 12,
    name: "Jim Happer",
    raiseType: RaiseType.M,
    callType: CallType.M,
    isMe: false
  },
  {
    id: 13,
    name: "Tom  Dur",
    raiseType: RaiseType.M,
    callType: CallType.M,
    isMe: false
  }
];

export const seats: ISeat[] = [
  { player: player1, seatNumber: 0, betOrder: 0 },
  { player: player2, seatNumber: 1, betOrder: 1 },
  { player: player3, seatNumber: 2, betOrder: 2 },
  { player: player4, seatNumber: 3, betOrder: 3 },
  { player: player5, seatNumber: 4, betOrder: 4 },
  { player: player6, seatNumber: 5, betOrder: 5 },
  { player: player7, seatNumber: 6, betOrder: 6 }
];
export const runRules = (
  round: Round,
  myHand: ICard[],
  board: ICard,
  mySeatNumber: number,
  dealerSeatNumber: number,
  totalPlayers: number
) => {
  if (round === Round.Preflop) {
  }
};
export const runPreRules = (
  myHand: ICard[],
  myPosition: number,
  dealerSeatNumber: number,
  totalPlayers: number
) => {};

const ordinal_of = n =>
  n.toString() +
  (["st", "nd", "rd"][(((((n < 0 ? -n : n) + 90) % 100) - 10) % 10) - 1] ||
    "th");

export const getNumberOrdinal = n =>
  i18n.locale === "en" ? ordinal_of(n) : getNumberText(n);
