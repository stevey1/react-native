import {
  ICard,
  Round,
  IAction,
  IActionHistory,
  Suit,
  GameType
} from "./DataTypes";
import { getSuitText, getNumberText } from "./helper";
import i18n from "../i18n";

export const getMyHandPreflop = (
  cards: ICard[],
  betOrder: number,
  players: number,
  bigBlind: number,
  action: IAction,
  gameType: GameType
) => {
  players = players - 1;
  //Pocket pair
  if (cards[0].cardNumber === cards[1].cardNumber) {
    switch (cards[0].cardNumber) {
      case 14:
        if (action.raises === 0) {
          if (betOrder <= players / 2)
            return i18n.t("pre.aa-early-position", {
              amount1:
                bigBlind * ((gameType === GameType.cash && players * 2) || 4),
              amount2:
                bigBlind * ((gameType === GameType.cash && players * 3) || 5)
            });
          else
            return i18n.t("pre.aa-late-position", {
              amount:
                bigBlind * ((gameType === GameType.cash && players * 3) || 4)
            });
        }
        return i18n.t("pre.claim-my-pot", {
          amount: action.amount * (action.callers.length + 1) * 4
        });
      case 13:
        if (action.raises === 0) {
          if (betOrder <= players / 2)
            return i18n.t("pre.kk-early-position", {
              amount1:
                bigBlind * ((gameType === GameType.cash && players * 2) || 4),
              amount2:
                bigBlind * ((gameType === GameType.cash && players * 3) || 5)
            });
          else
            return i18n.t("pre.kk-late-position", {
              amount:
                bigBlind * ((gameType === GameType.cash && players * 3) || 4)
            });
        }
        if (
          action.raises > 2 ||
          action.checkRaise ||
          action.amount > bigBlind * ((gameType === GameType.cash && 50) || 7)
        )
          return i18n.t("pre.check-or-fight");
        return i18n.t("pre.claim-my-pot", {
          amount: action.amount * (action.callers.length + 1) * 4
        });

      case 12:
        if (action.raises === 0) {
          return i18n.t("pre.qq-no-raiser");
        }
        if (
          action.amount >
          bigBlind * ((gameType === GameType.cash && 50) || 7)
        )
          return i18n.t("pre.big-pair-bet");
        if (
          action.amount >
          bigBlind * ((gameType === GameType.cash && 30) || 5)
        )
          return i18n.t("pre.call-to-see");
        return i18n.t("pre.raise-to", {
          amount: bigBlind * ((gameType === GameType.cash && 40) || 7)
        });
      case 11:
        if (action.raises === 0) {
          return i18n.t("pre.jj-no-raiser");
        }
        if (
          action.amount >
          bigBlind * ((gameType === GameType.cash && 50) || 7)
        )
          return i18n.t("pre.big-pair-bet");
        if (
          action.amount >
          bigBlind * ((gameType === GameType.cash && 30) || 4)
        )
          return i18n.t("pre.call-to-see");
        return i18n.t("pre.raise-to", {
          amount: bigBlind * ((gameType === GameType.cash && 20) || 3)
        });
      case 10:
      case 9:
      case 8:
        return i18n.t("pre.middle-pair");
      default:
        return i18n.t("pre.small-pair");
    }
  }
  const isSuited = cards[0].suit === cards[1].suit;

  switch (cards[1].cardNumber) {
    case 14:
      switch (cards[0].cardNumber) {
        case 13:
        case 12:
          return i18n.t("pre.big-a", (isSuited && i18n.t("pre.suited")) || "");
        case 11:
        case 10:
          return i18n.t(
            "pre.medium-a-1",
            (isSuited && i18n.t("pre.suited")) || ""
          );
        case 9:
        case 8:
          return i18n.t(
            "pre.medium-a-2",
            (isSuited && i18n.t("pre.suited")) || ""
          );
        default:
          return i18n.t(
            "pre.small-a",
            (isSuited && i18n.t("pre.suited")) || ""
          );
      }

    case 13:
      switch (cards[0].cardNumber) {
        case 12:
          return i18n.t(
            "pre.good-kq",
            (isSuited && i18n.t("pre.suited")) || ""
          );
        case 11:
          return i18n.t("pre.good-k", (isSuited && i18n.t("pre.suited")) || "");
        case 10:
          return i18n.t("pre.ok-k", (isSuited && i18n.t("pre.suited")) || "");
        default:
          return (isSuited && i18n.t("pre.suited-big-card")) || "";
      }
    case 12:
      switch (cards[0].cardNumber) {
        case 11:
          return i18n.t(
            "pre.good-connector",
            (isSuited && i18n.t("pre.suited")) || ""
          );
        case 10:
          return i18n.t(
            "pre.ok-connector",
            (isSuited && i18n.t("pre.suited")) || ""
          );
        default:
          return (isSuited && i18n.t("pre.suited-big-card")) || "";
      }
    case 11:
      switch (cards[0].cardNumber) {
        case 10:
          return i18n.t(
            "pre.ok-connector",
            (isSuited && i18n.t("pre.suited")) || ""
          );
        case 9:
          return i18n.t(
            "pre.ok-connector",
            (isSuited && i18n.t("pre.suited")) || ""
          );
        default:
          return (isSuited && i18n.t("pre.suited-big-card")) || "";
      }
    case 10:
      switch (cards[0].cardNumber) {
        case 9:
          return i18n.t(
            "pre.ok-connector",
            (isSuited && i18n.t("pre.suited")) || ""
          );
        default:
          return (isSuited && i18n.t("pre.suited-medium-card")) || "";
      }
    case 9:
      switch (cards[0].cardNumber) {
        case 8:
          return i18n.t(
            "pre.ok-connector",
            (isSuited && i18n.t("pre.suited")) || ""
          );
        default:
          return (isSuited && i18n.t("pre.suited-medium-card")) || "";
      }
    default:
      return (isSuited && i18n.t("pre.suited-small-card")) || "";
  }
};
export const checkBoard = (cards: ICard[]) => {
  let results = [];
  let result = checkBoardPair(cards);
  if (result) results.push(result);
  result = checkBoardFlush(cards);
  if (result) results.push(result);
  result = checkBoardStaight(cards);
  if (result) results.push(result);
  return results;
};
export const checkMyHand = (cards: ICard[], myHand: ICard[]) => {
  let results = [];
  const allCards = [...cards, ...myHand].sort(
    (c1, c2) => c1.cardNumber - c2.cardNumber
  );
  let result = checkMyPair(allCards, myHand);
  if (result) results.push(result);
  result = checkMyFlush(allCards, myHand);
  if (result) results.push(result);
  result = checkMyStraight(allCards, myHand);
  if (result) results.push(result);
  return results;
};
const checkBoardFlush = (cards: ICard[]) => {
  const suits = cards.reduce(
    (p, card) => {
      p[card.suit] += 1;
      return p;
    },
    [0, 0, 0, 0]
  );
  const suitsCount = suits.find(s => s > 2);
  if (suitsCount) {
    return `${suitsCount.toString()} flush , prepare to fold`;
  } else if (cards.length < 7) {
    const suitIndex = suits.findIndex(s => s === 2);
    if (suitIndex >= 0) return;
    `${getSuitText(
      suitIndex
    )} flush draw, if over pair+ with hand blocker to charge`;
  }
};

const checkBoardPair = (cards: ICard[]) => {
  for (let i = cards.length - 2; i >= 0; i--) {
    if (i === 0) {
      if (cards[i].cardNumber === cards[i + 1].cardNumber)
        return `${getNumberText(
          cards[cards.length - 1].cardNumber
        )} Full house - prepare to fold, don't draw`;
      break;
    }

    if (
      cards[i].cardNumber === cards[i + 1].cardNumber &&
      cards[i].cardNumber === cards[i - 1].cardNumber
    )
      return "Four kind - prepare to fold.";
    if (cards[i].cardNumber === cards[i + 1].cardNumber)
      return `${getNumberText(
        cards[cards.length - 1].cardNumber
      )} Full house - prepare to fold, don't draw`;
  }
};
const checkBoardStaight = (cards: ICard[]) => {
  let cardNumbers = [...new Set(cards.map(c => c.cardNumber))];
  if (cards[cards.length - 1].cardNumber === 14)
    cardNumbers = [1, ...cardNumbers];
  for (let i = cards.length - 3; i >= 0; i--) {
    const result = checkBoardStraightType(cardNumbers, i, 3);
    if (result) return result;
  }
};

const checkBoardStraightType = (
  carNumbers: number[],
  i: number,
  howMany: number
) => {
  let result: string;
  let cardGap: number;
  switch (howMany) {
    case 3:
      if (i < 0 || i > carNumbers.length - 3) return "";

      cardGap = carNumbers[i + 2] - carNumbers[i];
      if (cardGap === 2) {
        return (
          result ||
          `${getNumberText(
            (carNumbers[i + 2] + 2 > 14 && 14) || carNumbers[i + 2] + 2
          )} high easy straight `
        );
      }
      if (cardGap === 3) {
        result = checkBoardStraightType(carNumbers, i - 1, 4);
        return (
          result ||
          `${getNumberText(
            (carNumbers[i + 2] + 1 > 14 && 14) || carNumbers[i + 2] + 1
          )} high easier straight`
        );
      }

      return (
        (cardGap === 4 &&
          `${getNumberText(carNumbers[i])} high harder(3) straight`) ||
        ""
      );
    case 4:
      if (i < 0 || i > carNumbers.length - 4) return "";
      const highNumber = carNumbers[i + 3];
      cardGap = highNumber - carNumbers[i];
      if (cardGap === 3) {
        result = checkBoardStraightType(carNumbers, i - 1, 5);
        return (
          result ||
          `${getNumberText(
            (highNumber + 2 > 14 && 14) || highNumber + 2
          )} high straight-4`
        );
      }

      return (
        (cardGap === 4 &&
          `${getNumberText(
            (highNumber + (highNumber - carNumbers[i + 1] === 2 ? 2 : 1) > 14 &&
              14) ||
              highNumber + (highNumber - carNumbers[i + 1] === 2 ? 2 : 1)
          )} high straight-4`) ||
        ""
      );
    case 5:
      if (i < 0 || i > carNumbers.length - 5) return "";
      cardGap = carNumbers[i + 4] - carNumbers[i];
      return (
        (cardGap === 5 &&
          `${getNumberText(
            (carNumbers[i + 4] + 2 > 14 && 14) || carNumbers[i + 4] + 2
          )} high straight-5`) ||
        ""
      );
    default:
      return "";
  }
};
enum PairType {
  none = -1,
  overPair = 0,
  boardPair,
  pair,
  topPair,
  trip,
  topTrip,
  set,
  topSet,
  kind4,
  fullHouse,
  top2Pairs,
  pairs2
}
export const checkMyPair = (cards: ICard[], myHand: ICard[]) => {
  let myPairType = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let i = cards.length - 1;
  let loops = 1;
  while (i > 0) {
    let cardNumber = cards[cards.length - 1].cardNumber;
    const count = countIt(cards, cardNumber);
    switch (count) {
      case 4:
        myPairType[PairType.kind4] = 1;
        break;
      case 3:
        if (
          myHand[0].cardNumber === myHand[1].cardNumber &&
          myHand[0].cardNumber === cardNumber
        )
          myPairType[loops === 1 ? PairType.topSet : PairType.set] += 1;
        else if (
          myHand[0].cardNumber === cardNumber ||
          myHand[1].cardNumber === cardNumber
        )
          myPairType[loops === 1 ? PairType.topTrip : PairType.trip] += 1;
        break;
      case 2:
        if (myHand[0].cardNumber === myHand[1].cardNumber && loops === 1)
          myPairType[PairType.overPair] += 1;
        else if (
          myHand[0].cardNumber === cardNumber ||
          myHand[1].cardNumber === cardNumber
        )
          myPairType[loops === 1 ? PairType.topPair : PairType.pair] += 1;
        else myPairType[PairType.boardPair] += 1;
        break;
      default:
        break;
    }
    i -= count;
    loops++;
  }
  if (myPairType[PairType.kind4]) return "4 Kind"; // PairType.kind4;
  if (myPairType[PairType.topSet]) {
    if (myPairType[PairType.boardPair]) return "Full House";
    // PairType.fullHouse;
    else return "Top set"; //PairType.topSet;
  }
  if (myPairType[PairType.set]) {
    if (myPairType[PairType.boardPair]) return "Full House";
    //PairType.fullHouse;
    else return "Set"; //PairType.set;
  }
  if (myPairType[PairType.topTrip]) {
    if (
      myPairType[PairType.topPair] ||
      myPairType[PairType.pair] ||
      myPairType[PairType.boardPair]
    )
      return "Full House"; //PairType.fullHouse;
    return "Trips"; // PairType.topTrip;
  }
  if (myPairType[PairType.trip]) {
    if (myPairType[PairType.topPair] || myPairType[PairType.pair])
      return "Full House"; //PairType.fullHouse;
    return "Trips"; //PairType.trip;
  }
  if (myPairType[PairType.overPair]) return PairType.overPair;
  if (myPairType[PairType.topPair] === 2) return PairType.top2Pairs;
  if (myPairType[PairType.topPair] === 1)
    return (
      //(myPairType[PairType.pair] > 0 && PairType.pairs2) || PairType.topPair
      (myPairType[PairType.pair] > 0 && "2 Pairs") || "Top pair"
    );
  if (myPairType[PairType.pair] === 2) return "2 pairs"; //PairType.pairs2;
  if (myPairType[PairType.pair] === 1) return "pair"; //PairType.pair;
  return ""; //PairType.none;
};
export const checkMyFlush = (cards: ICard[], myHand: ICard[]) => {
  const suits = cards.reduce(
    (p, card) => {
      p[card.suit] += 1;
      return p;
    },
    [0, 0, 0, 0]
  );
  const suitsCount = suits.find(s => s >= 4);
  const suit = suits.findIndex(s => s >= 4);
  switch (suitsCount) {
    case 6:
      return `4 cards flush, A?`;
    case 7:
      return `flush board, A?`;
    case 5:
      if (suit === myHand[0].suit && suit === myHand[1].suit)
        return `flush, I don't fold`;
      else if (suit === myHand[0].suit || suit === myHand[1].suit)
        return `4 cards flush, A?`;
    case 4:
      if (cards.length < 7) return "";

      if (suit === myHand[0].suit && suit === myHand[1].suit) {
        if (myHand[1].cardNumber === cards[cards.length - 1].cardNumber)
          return myHand[0].cardNumber === cards[cards.length - 2].cardNumber
            ? `30% flush/top pair(2) draw `
            : `24% flush/top pair draw`;
        else return `18% flush draw`;
      } else if (suit === myHand[0].suit || suit === myHand[1].suit) {
        return "18% 4 cards flush draw";
      }
      return "";
    default:
      return;
  }
};
const checkMyStraight = (cards: ICard[], myHand: ICard[]) => {
  let cardNumbers = [...new Set(cards.map(c => c.cardNumber))];
  if (cardNumbers[cards.length - 1] === 14) cardNumbers = [1, ...cardNumbers];
  for (let i = cardNumbers.length - 5; i >= 0; i--) {
    const result = checkMyStraightFrom(cardNumbers, i);
    if (result) return result;
  }
  for (let i = cardNumbers.length - 4; i >= 0; i--) {
    const result = checkMyStraightDraw(cardNumbers, myHand, i);
    if (result) return result;
  }
  return "";
};

const checkMyStraightFrom = (cardNumbers: number[], i: number) => {
  let cardGap: number;

  if (i < 0 || i > cardNumbers.length - 5) return "";

  cardGap = cardNumbers[i + 4] - cardNumbers[i];
  if (cardGap === 4)
    return `${getNumberText(cardNumbers[i + 4])} high straight`;
  return "";
};
const checkMyStraightDraw = (
  cardNumbers: number[],
  myHand: ICard[],
  i: number
) => {
  let cardGap: number;

  if (i < 0 || i > cardNumbers.length - 4) return "";
  const highNumber = cardNumbers[i + 3];
  cardGap = highNumber - cardNumbers[i];
  if (cardGap === 3) {
    if (cardNumbers[cardNumbers.length - 1] === myHand[1].cardNumber) {
      if (cardNumbers[cardNumbers.length - 2] === myHand[0].cardNumber)
        return `draw 28% O/E straight/top pair(2) draw `;
      else return `22% O/E straight/top pair draw `;
    }
    return `16% O/E straight draw `;
  }
  if (cardGap === 4) {
    if (cardNumbers[cardNumbers.length - 1] === myHand[1].cardNumber) {
      if (cardNumbers[cardNumbers.length - 2] === myHand[0].cardNumber)
        return `draw 20% straight/top pair(2) draw `;
      else return `14% straight/top pair draw `;
    }
    return `8% straight draw`;
  }

  return "";
};

const countIt = (cards: ICard[], cardNumber: number) =>
  cards.filter(c => c.cardNumber === cardNumber).length;

export const getActionTip = (allAction: IActionHistory[]) => {
  const action = allAction[allAction.length - 1].action;
  const round = allAction[allAction.length - 1].round;
  if (action.raiser.player.isMe) return "";
  if (round === Round.Preflop) {
    if (action.checkRaise) return "Check Raise: must be AA/KK";
    if (action.raises > 1) {
      const lastAction = allAction[allAction.length - 2].action;
      if (action.amount >= lastAction.amount * 5)
        return `${Math.round(
          action.amount / lastAction.amount
        )} raise; must be AA/KK`;
      if (action.amount > lastAction.amount * 3)
        return `${Math.round(
          action.amount / lastAction.amount
        )} raise; QQ/JJ raise`;
      if (action.amount > lastAction.amount * 2)
        return `${Math.round(
          action.amount / lastAction.amount
        )} raise; must AK `;
      return "mini raise";
    }
    return "";
  }
  const lastAction = allAction[allAction.length - 2].action;
  if (action.checkRaise)
    return `${Math.round(
      action.amount / lastAction.amount
    )} times Check Raise: must be Set/Straight`;

  if (action.raises > 1) {
    if (action.amount > lastAction.amount * 2)
      return `${Math.round(
        action.amount / lastAction.amount
      )} re-raise; must be Set/Straight`;
    return `minimum-raise`;
  }
  return "";
};
