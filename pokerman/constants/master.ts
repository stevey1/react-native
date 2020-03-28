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
  const cashGame = gameType === GameType.cash;

  //Pocket pair
  if (cards[0].cardNumber === cards[1].cardNumber) {
    switch (cards[0].cardNumber) {
      case 14:
        if (action.raises === 0) {
          if (betOrder <= players / 2)
            return i18n.t("pre.aa-early-position", {
              amount1: bigBlind * ((cashGame && players * 2) || 4),
              amount2: bigBlind * ((cashGame && players * 3) || 5)
            });
          else
            return i18n.t("pre.aa-late-position", {
              amount: bigBlind * ((cashGame && players * 3) || 4)
            });
        }
        return i18n.t("pre.claim-my-pot", {
          amount: action.amount * (action.callers.length + 1) * 4
        });
      case 13:
        if (action.raises === 0) {
          if (betOrder <= players / 2)
            return i18n.t("pre.kk-early-position", {
              amount1: bigBlind * ((cashGame && players * 2) || 4),
              amount2: bigBlind * ((cashGame && players * 3) || 5)
            });
          else
            return i18n.t("pre.kk-late-position", {
              amount: bigBlind * ((cashGame && players * 3) || 4)
            });
        }
        if (
          action.raises > 2 ||
          action.checkRaise ||
          action.amount > bigBlind * ((cashGame && 50) || 7)
        )
          return i18n.t("pre.check-or-fight");
        return i18n.t("pre.claim-my-pot", {
          amount: action.amount * (action.callers.length + 1) * 4
        });

      case 12:
        if (action.raises === 0) {
          return i18n.t("pre.qq-no-raiser");
        }
        if (action.amount > bigBlind * ((cashGame && 50) || 7))
          return i18n.t("pre.big-pair-bet");
        if (action.amount > bigBlind * ((cashGame && 30) || 5))
          return i18n.t("pre.call-to-see");
        return i18n.t("pre.raise-to", {
          amount: bigBlind * ((cashGame && 40) || 7)
        });
      case 11:
        if (action.raises === 0) {
          return i18n.t("pre.jj-no-raiser");
        }
        if (action.amount > bigBlind * ((cashGame && 50) || 7))
          return i18n.t("pre.big-pair-bet");
        if (action.amount > bigBlind * ((cashGame && 30) || 4))
          return i18n.t("pre.call-to-see");
        return i18n.t("pre.raise-to", {
          amount: bigBlind * ((cashGame && 20) || 3)
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
  const suited = { suited: (isSuited && i18n.t("pre.suited")) || "" };
  switch (cards[1].cardNumber) {
    case 14:
      switch (cards[0].cardNumber) {
        case 13:
        case 12:
          return i18n.t("pre.big-a", suited);
        case 11:
        case 10:
          return i18n.t("pre.medium-a-1", suited);
        case 9:
        case 8:
          return i18n.t("pre.medium-a-2", suited);
        default:
          return i18n.t("pre.small-a", suited);
      }

    case 13:
      switch (cards[0].cardNumber) {
        case 12:
          return i18n.t("pre.good-kq", suited);
        case 11:
          return i18n.t("pre.good-k", suited);
        case 10:
          return i18n.t("pre.ok-k", suited);
        default:
          return (isSuited && i18n.t("pre.suited-big-card")) || "";
      }
    case 12:
      switch (cards[0].cardNumber) {
        case 11:
          return i18n.t("pre.good-connector", suited);
        case 10:
          return i18n.t("pre.ok-connector", suited);
        default:
          return (isSuited && i18n.t("pre.suited-big-card")) || "";
      }
    case 11:
      switch (cards[0].cardNumber) {
        case 10:
          return i18n.t("pre.ok-connector", suited);
        case 9:
          return i18n.t("pre.ok-connector", suited);
        default:
          return (isSuited && i18n.t("pre.suited-big-card")) || "";
      }
    case 10:
      switch (cards[0].cardNumber) {
        case 9:
          return i18n.t("pre.ok-connector", suited);
        default:
          return (isSuited && i18n.t("pre.suited-medium-card")) || "";
      }
    case 9:
      switch (cards[0].cardNumber) {
        case 8:
          return i18n.t("pre.ok-connector", suited);
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

const checkBoardPair = (cards: ICard[]) => {
  for (let i = cards.length - 2; i >= 0; i--) {
    if (i - 1 >= 0)
      if (
        cards[i].cardNumber === cards[i + 1].cardNumber &&
        cards[i].cardNumber === cards[i - 1].cardNumber
      )
        return i18n.t("board.4Kind");

    if (cards[i].cardNumber === cards[i + 1].cardNumber)
      return i18n.t("board.fullHouse", {
        cardNumber: getNumberText(cards[cards.length - 1].cardNumber)
      });
  }
};

const checkBoardFlush = (cards: ICard[]) => {
  const suits = cards.reduce(
    (p, card) => {
      p[card.suit] += 1;
      return p;
    },
    [0, 0, 0, 0]
  );
  let suitIndex = suits.findIndex(s => s === 4);
  if (suitIndex >= 0) return i18n.t("board.4Flush");
  else {
    let suitIndex = suits.findIndex(s => s === 3);
    if (suitIndex >= 0) return i18n.t("board.flush");
    else {
      suitIndex = suits.findIndex(s => s === 2);
      if (suitIndex >= 0) return i18n.t("board.flushDraw");
    }
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
  cardNumbers: number[],
  i: number,
  howMany: number
) => {
  let result: string;
  let cardGap: number;
  let highNumber: number;
  switch (howMany) {
    case 3:
      if (i < 0 || i > cardNumbers.length - 3) return "";
      highNumber = cardNumbers[i + 2];
      cardGap = highNumber - cardNumbers[i];
      if (cardGap === 2) {
        result = checkBoardStraightType(cardNumbers, i - 1, 4);
        return (
          result ||
          i18n.t("board.straight", {
            cardNumber: getNumberText(Math.min(highNumber + 2, 14))
          })
        );
      }
      if (cardGap === 3) {
        result = checkBoardStraightType(cardNumbers, i - 1, 4);
        return (
          result ||
          i18n.t("board.straight", {
            cardNumber: getNumberText(Math.min(highNumber + 1, 14))
          })
        );
      }
      return (
        (cardGap === 4 &&
          i18n.t("board.straight", {
            cardNumber: getNumberText(highNumber)
          })) ||
        ""
      );
    case 4:
      if (i < 0 || i > cardNumbers.length - 4) return "";
      highNumber = cardNumbers[i + 3];
      cardGap = highNumber - cardNumbers[i];
      if (cardGap === 3) {
        result = checkBoardStraightType(cardNumbers, i - 1, 5);
        return (
          result ||
          i18n.t("board.straight", {
            cardNumber: getNumberText(Math.min(highNumber + 2, 14))
          })
        );
      }

      return (
        (cardGap === 4 &&
          i18n.t("board.straight", {
            cardNumber: getNumberText(
              Math.min(
                highNumber + (highNumber - cardNumbers[i + 1] === 2 ? 2 : 1),
                14
              )
            )
          })) ||
        ""
      );
    case 5:
      if (i < 0 || i > cardNumbers.length - 5) return "";
      highNumber = cardNumbers[i + 4];
      cardGap = highNumber - cardNumbers[i];
      return (
        (cardGap === 5 &&
          i18n.t("board.straight", {
            cardNumber: getNumberText(Math.min(highNumber + 2, 14))
          })) ||
        ""
      );
    default:
      return "";
  }
};
enum PairType {
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
  topFullHouse,
  top2Pairs,
  pairs2
}
export const checkMyPair = (cards: ICard[], myHand: ICard[]) => {
  let myPairType = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2];
  let i = cards.length - 1;
  let loops = 1;
  while (i > 0) {
    let cardNumber = cards[i].cardNumber;
    const count = countIt(cards, cardNumber);
    switch (count) {
      case 4:
        if (
          myHand[0].cardNumber === cardNumber ||
          myHand[1].cardNumber === cardNumber
        )
          myPairType[PairType.kind4] = 1;
        break;
      case 3:
        if (
          cardNumber === myHand[1].cardNumber &&
          cardNumber === myHand[0].cardNumber
        )
          myPairType[loops === 1 ? PairType.topSet : PairType.set] += 1;
        else if (
          myHand[0].cardNumber === cardNumber ||
          myHand[1].cardNumber === cardNumber
        )
          myPairType[loops === 1 ? PairType.topTrip : PairType.trip] += 1;
        break;
      case 2:
        if (
          cardNumber === myHand[0].cardNumber &&
          cardNumber === myHand[1].cardNumber &&
          loops === 1
        )
          myPairType[PairType.overPair] += 1;
        else if (
          cardNumber === myHand[0].cardNumber ||
          cardNumber === myHand[1].cardNumber
        ) {
          if (loops === 1)
            myPairType[
              myHand[1].cardNumber === cardNumber
                ? PairType.topPair
                : PairType.pair
            ] += 1;
          else if (loops === 2)
            myPairType[
              myPairType[PairType.topPair] &&
              cardNumber === myHand[0].cardNumber
                ? PairType.topPair
                : PairType.pair
            ] += 1;
          else myPairType[PairType.pair] += 1;
        } else myPairType[PairType.boardPair] += 1;
        break;
      default:
        break;
    }
    i -= count;
    loops++;
  }
  if (myPairType[PairType.kind4]) return i18n.t("iMake.4Kind"); // PairType.kind4;
  if (myPairType[PairType.topSet])
    return i18n.t(
      "iMake." + (myPairType[PairType.boardPair] ? "topFullHouse" : "topSet")
    );

  if (myPairType[PairType.set])
    return i18n.t(
      "iMake." + (myPairType[PairType.boardPair] ? "fullHouse" : "set")
    );
  if (myPairType[PairType.topTrip]) {
    return i18n.t(
      "iMake." +
        (myPairType[PairType.topPair] ||
        myPairType[PairType.pair] ||
        myPairType[PairType.boardPair]
          ? "topFullHouse"
          : "trips")
    ); // PairType.topTrip;
  }
  if (myPairType[PairType.trip])
    return i18n.t(
      "iMake." +
        (myPairType[PairType.topPair] || myPairType[PairType.pair]
          ? "fullHouse"
          : "trips")
    );

  if (myPairType[PairType.overPair]) return i18n.t("iMake.overPair"); //PairType.overPair;
  if (myPairType[PairType.topPair] > 1) return i18n.t("iMake.top2");
  //PairType.top2Pairs;
  else if (myPairType[PairType.topPair] > 1)
    return i18n.t(
      "iMake." + ((myPairType[PairType.pair] > 0 && "2Pairs") || "topPair")
    );
  if (myPairType[PairType.pair] > 1) return i18n.t("iMake.2Pairs"); //PairType.pairs2;
  if (myPairType[PairType.pair] === 1) return i18n.t("iMake.pair"); //PairType.pair;
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
      return i18n.t("iMake.4Flush");
    case 7:
      return i18n.t("iMake.5Flush");
    case 5:
      if (suit === myHand[0].suit && suit === myHand[1].suit)
        return i18n.t("iMake.flush");
      else if (suit === myHand[0].suit || suit === myHand[1].suit)
        return i18n.t("iMake.4Flush");
    case 4:
      if (cards.length === 7) return "";
      if (suit === myHand[0].suit && suit === myHand[1].suit) {
        if (myHand[1].cardNumber === cards[cards.length - 1].cardNumber)
          return i18n.t(
            "iMake." +
              (myHand[0].cardNumber === cards[cards.length - 2].cardNumber
                ? "2flushDraw"
                : "1flushDraw")
          );
        else return i18n.t("iMake.flushDraw");
      } else if (suit === myHand[0].suit || suit === myHand[1].suit) {
        return i18n.t("iMake.4CardsFlushDraw");
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
    return i18n.t("iMake.straight", {
      cardNumber: getNumberText(cardNumbers[i + 4])
    });
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
        return i18n.t("iMake.openEnd2Draw");
      else return i18n.t("iMake.openEnd1Draw");
    }
    return i18n.t("iMake.openEndDraw");
  }
  if (cardGap === 4) {
    if (cardNumbers[cardNumbers.length - 1] === myHand[1].cardNumber) {
      if (cardNumbers[cardNumbers.length - 2] === myHand[0].cardNumber)
        return i18n.t("iMake.straight2Draw");
      else return i18n.t("iMake.straight1Draw");
    }
    return i18n.t("iMake.straightDraw");
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
    if (action.checkRaise) return i18n.t("actionTip.preCheckRaise");
    if (action.raises > 1) {
      const lastAction = allAction[allAction.length - 2].action;
      if (action.amount >= lastAction.amount * 5)
        return i18n.t("actionTip.preAAReraise", {
          times: Math.round(action.amount / lastAction.amount)
        });
      if (action.amount > lastAction.amount * 3)
        return i18n.t("actionTip.preQQReraise", {
          times: Math.round(action.amount / lastAction.amount)
        });
      if (action.amount > lastAction.amount * 2)
        return i18n.t("actionTip.preAKReraise", {
          times: Math.round(action.amount / lastAction.amount)
        });
      return i18n.t("actionTip.miniReraise");
    }
    return "";
  }
  const lastAction = allAction[allAction.length - 2].action;
  if (action.checkRaise) i18n.t("actionTip.checkRaise");

  if (action.raises > 1) {
    if (action.amount > lastAction.amount * 2)
      return i18n.t("actionTip.reraise", {
        times: Math.round(action.amount / lastAction.amount)
      });
    return i18n.t("actionTip.miniReraise");
  }
  return "";
};
