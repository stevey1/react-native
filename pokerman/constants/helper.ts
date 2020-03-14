import { IPlayer, ISeat, Suit, PlayerType } from "./DataTypes";

export const getCardNumberText = (cardNumber: number, language: number = 0) => {
  switch (cardNumber) {
    case 14:
      return language ? "A" : "a";
    case 13:
      return language ? "A" : "k";
    case 12:
      return language ? "A" : "q";
    case 11:
      return language ? "J" : "j";
    case 0:
      return "";
    case 1:
      return "一";
    case 2:
      return language ? "2" : "二";
    case 3:
      return language ? "3" : "三";
    case 4:
      return language ? "4" : "四";
    case 5:
      return language ? "5" : "五";
    case 6:
      return language ? "6" : "六";
    case 7:
      return language ? "7" : "七";
    case 8:
      return language ? "8" : "八";
    case 9:
      return language ? "9" : "九";
    case 10:
      return language ? "10" : "十";
    default:
      return cardNumber;
  }
};
export const getSuitText = (suit: Suit, language = 0) => {
  switch (suit) {
    case Suit.c:
      return language ? "&clubs;" : "草";
    case Suit.d:
      return language ? "&diams;" : "方";
    case Suit.h:
      return language ? "&hearts;" : "红";
    case Suit.s:
      return language ? "&spades;" : "黑";
    default:
      return "";
  }
};
export const getSeatText = (language = 0) => {
  return language ? "Seat" : "座位";
};
export const getAmountText = (language = 0) => {
  return language ? "Amount" : "量";
};
export const setCardColor = (suit: Suit) => {
  return suit === Suit.d || suit === Suit.h
    ? { color: "#FF0000" }
    : { color: "#000000" };
};
const player1 = { id: 1, name: "P1", playerType: PlayerType.TT };
const player2 = { id: 2, name: "P2", playerType: PlayerType.TT };
const player3 = { id: 3, name: "P3", playerType: PlayerType.TT };
const player4 = { id: 4, name: "P4", playerType: PlayerType.TT };
const player5 = { id: 5, name: "P5", playerType: PlayerType.TT };
const player6 = { id: 6, name: "P6", playerType: PlayerType.TT };
const player7 = { id: 7, name: "P7", playerType: PlayerType.TT };
const player8 = { id: 8, name: "P8", playerType: PlayerType.TT };
const player9 = { id: 9, name: "P9", playerType: PlayerType.TT };

export const players: IPlayer[] = [
  { id: 1, name: "P1", playerType: PlayerType.TT },
  { id: 2, name: "P2", playerType: PlayerType.TT },
  { id: 3, name: "P3", playerType: PlayerType.TT },
  { id: 4, name: "P4", playerType: PlayerType.TT },
  { id: 5, name: "P5", playerType: PlayerType.TT },
  { id: 6, name: "P6", playerType: PlayerType.TT },
  { id: 7, name: "P7", playerType: PlayerType.TT },
  { id: 8, name: "P8", playerType: PlayerType.TT },
  { id: 9, name: "P9", playerType: PlayerType.TT },
  { id: 10, name: "P10", playerType: PlayerType.TT },
  { id: 11, name: "Rock Player", playerType: PlayerType.TT },
  { id: 12, name: "Jim Happer", playerType: PlayerType.TT },
  { id: 13, name: "Tom  Dur", playerType: PlayerType.TT }
];

export const seats: ISeat[] = [
  { player: player2, seatNumber: 2 },
  { player: player4, seatNumber: 3 },
  { player: player5, seatNumber: 4 },
  { player: player6, seatNumber: 5 },
  { player: player7, seatNumber: 6 },
  { player: player8, seatNumber: 7 },
  { player: player9, seatNumber: 8 }
];
