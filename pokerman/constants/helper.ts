import { IPlayer, ISeat, Suit, PlayerType } from "./DataTypes";
export const getCardNumber = (cardNumber: number) => {
  switch (cardNumber) {
    case 14:
      return "A";
    case 13:
      return "K";
    case 12:
      return "Q";
    case 11:
      return "J";
    case 0:
    case 1:
      return "";
    default:
      return cardNumber;
  }
};
export const getSuitIcon = (suit: Suit) => {
  switch (suit) {
    case Suit.c:
      return "&clubs;";
    case Suit.d:
      return "&diams;";
    case Suit.h:
      return "&hearts;";
    case Suit.s:
      return "&spades;";
    default:
      return "";
  }
};
const player1 = { id: 1, name: "P1", playerType: PlayerType.TT };
const player2 = { id: 2, name: "P2", playerType: PlayerType.TT };
const player3 = { id: 3, name: "P3", playerType: PlayerType.TT };
const player4 = { id: 4, name: "P4", playerType: PlayerType.TT };
const player5 = { id: 5, name: "P5", playerType: PlayerType.TT };

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
  { player: player1, seatNumber: 1 },
  { player: player2, seatNumber: 2 },
  { player: player3, seatNumber: 3 },
  { player: player4, seatNumber: 4 },
  { player: player5, seatNumber: 5 }
];
