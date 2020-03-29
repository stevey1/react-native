import { IPlayer, ISeat, Suit, ICard, Round, PlayType } from "./DataTypes";
import i18n from "../i18n";

export const getNumberText = (value: number) => i18n.t("number." + value);
export const getSuitText = (suit: Suit) => i18n.t("suit." + suit);
export const getRoundText = (round: Round) => i18n.t("round." + round);

export const getCardColor = (suit: Suit) =>
  i18n.locale === "en" && (suit === Suit.d || suit === Suit.h)
    ? { color: "#FF0000" }
    : { color: "#000000" };

export const getCardText = (card: ICard) =>
  getSuitText(card.suit) + getNumberText(card.cardNumber);
export const getSeatText = (seatId: number) =>
  i18n.t("action.seat") +
  (i18n.locale === "en" ? " " : "") +
  getNumberText(seatId + 1);

export const getPlayerText = (player: IPlayer) => player.name;

export const AllPlayers: IPlayer[] = [
  {
    id: 1,
    name: "P1",
    preflopRaiseType: PlayType.M,
    preflopCallType: PlayType.L,
    raiseType: PlayType.M,
    callType: PlayType.M,
    isMe: false
  },

  {
    id: 2,
    name: "P2",
    preflopRaiseType: PlayType.M,
    preflopCallType: PlayType.L,
    raiseType: PlayType.M,
    callType: PlayType.M,
    isMe: false
  },
  {
    id: 3,
    name: "P3",
    preflopRaiseType: PlayType.M,
    preflopCallType: PlayType.L,
    raiseType: PlayType.M,
    callType: PlayType.M,
    isMe: false
  },
  {
    id: 4,
    name: "P4",
    preflopRaiseType: PlayType.M,
    preflopCallType: PlayType.L,
    raiseType: PlayType.M,
    callType: PlayType.M,
    isMe: false
  },
  {
    id: 5,
    name: "P5",
    preflopRaiseType: PlayType.M,
    preflopCallType: PlayType.L,
    raiseType: PlayType.M,
    callType: PlayType.M,
    isMe: false
  },
  {
    id: 6,
    name: "P6",
    preflopRaiseType: PlayType.M,
    preflopCallType: PlayType.L,
    raiseType: PlayType.M,
    callType: PlayType.M,
    isMe: false
  },
  {
    id: 7,
    name: "P7",
    preflopRaiseType: PlayType.M,
    preflopCallType: PlayType.L,
    raiseType: PlayType.M,
    callType: PlayType.M,
    isMe: false
  },
  {
    id: 8,
    name: "P8",
    preflopRaiseType: PlayType.M,
    preflopCallType: PlayType.L,
    raiseType: PlayType.M,
    callType: PlayType.M,
    isMe: false
  },
  {
    id: 9,
    name: "P9",
    preflopRaiseType: PlayType.M,
    preflopCallType: PlayType.L,
    raiseType: PlayType.M,
    callType: PlayType.M,
    isMe: false
  },

  {
    id: 10,
    name: "P10",
    preflopRaiseType: PlayType.M,
    preflopCallType: PlayType.L,
    raiseType: PlayType.M,
    callType: PlayType.M,
    isMe: false
  },
  {
    id: 11,
    name: "Me",
    preflopRaiseType: PlayType.M,
    preflopCallType: PlayType.L,
    raiseType: PlayType.M,
    callType: PlayType.M,
    isMe: true
  },
  {
    id: 12,
    name: "Jim Happer",
    preflopRaiseType: PlayType.M,
    preflopCallType: PlayType.L,
    raiseType: PlayType.M,
    callType: PlayType.M,
    isMe: false
  },
  {
    id: 13,
    name: "Tom  Dur",
    preflopRaiseType: PlayType.M,
    preflopCallType: PlayType.L,
    raiseType: PlayType.M,
    callType: PlayType.M,
    isMe: false
  },

  {
    id: 14,
    name: "Rock Player",
    preflopRaiseType: PlayType.M,
    preflopCallType: PlayType.L,
    raiseType: PlayType.M,
    callType: PlayType.M,
    isMe: false
  }
];

const ordinal_of = n =>
  n.toString() +
  (["st", "nd", "rd"][(((((n < 0 ? -n : n) + 90) % 100) - 10) % 10) - 1] ||
    "th");

export const getNumberOrdinal = n =>
  i18n.locale === "en" ? ordinal_of(n) : getNumberText(n);

export const getSeatList = (seats: ISeat[]) =>
  seats.map(seat => ({
    text: seat.player.name,
    value: seat.id
  }));
export const getPlayerList = (players: IPlayer[]) =>
  players
    .filter(p => p)
    .map((p, index) => ({
      text: p.name,
      value: index
    }));
