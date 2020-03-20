import { IPlayer, ISeat, Suit, ICard, Round, PlayerType } from "./DataTypes";
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
  getNumberText(seatNumber + 1);

export const getPlayerText = (player: IPlayer) => player.name;
const player1 = { id: 1, name: "P1", playerType: PlayerType.TT };
const player2 = { id: 2, name: "P2", playerType: PlayerType.TT };
const player3 = { id: 3, name: "P3", playerType: PlayerType.TT };
const player4 = { id: 4, name: "P4", playerType: PlayerType.TT };
const player5 = { id: 5, name: "P5", playerType: PlayerType.TT };
const player6 = { id: 6, name: "P6", playerType: PlayerType.TT };
const player7 = { id: 7, name: "P7", playerType: PlayerType.TT };
const player8 = { id: 8, name: "P8", playerType: PlayerType.TT };
const player9 = { id: 9, name: "P9", playerType: PlayerType.TT };

export const AllPlayers: IPlayer[] = [
  { id: 1, name: "Me", playerType: PlayerType.TT, isMe: true },
  { id: 2, name: "P2", playerType: PlayerType.TT, isMe: false },
  { id: 3, name: "P3", playerType: PlayerType.TT, isMe: false },
  { id: 4, name: "P4", playerType: PlayerType.TT, isMe: false },
  { id: 5, name: "P5", playerType: PlayerType.TT, isMe: false },
  { id: 6, name: "P6", playerType: PlayerType.TT, isMe: false },
  { id: 7, name: "P7", playerType: PlayerType.TT, isMe: false },
  { id: 8, name: "P8", playerType: PlayerType.TT, isMe: false },
  { id: 9, name: "P9", playerType: PlayerType.TT, isMe: false },
  { id: 10, name: "P10", playerType: PlayerType.TT, isMe: false },
  { id: 11, name: "Rock Player", playerType: PlayerType.TT, isMe: false },
  { id: 12, name: "Jim Happer", playerType: PlayerType.TT, isMe: false },
  { id: 13, name: "Tom  Dur", playerType: PlayerType.TT, isMe: false }
];

export const seats: ISeat[] = [
  { player: player1, seatNumber: 0 },
  { player: player2, seatNumber: 1 },
  { player: player3, seatNumber: 2 },
  { player: player4, seatNumber: 3 },
  { player: player5, seatNumber: 4 },
  { player: player6, seatNumber: 5 },
  { player: player7, seatNumber: 6 }
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
