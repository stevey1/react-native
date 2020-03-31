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

