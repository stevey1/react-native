import { ICard, Round, IAction, Suit } from "./DataTypes";
import { getSuitText, getNumberText } from "./helper";
export const getMyHandPreflop = (cards: ICard[]) => {
  //Pocket pair
  if (cards[0].cardNumber === cards[1].cardNumber) {
    switch (cards[0].cardNumber) {
      case 14:
        return "3XPot+";
      case 13:
        return "Big fire 3XPot+ and fold; 80%->A*; Not call all in->AA";
      case 12:
        return "Fire 55-75 and fold; 50%->AK and prepair to fold; Not call in->AA/KK";
      case 11:
        return "Fire 55 and fold; 50%->A*; Not call in";
      case 10:
      case 9:
      case 8:
        return "Raise or Call; 50%->A*";
      default:
        return "Only call to grow to bird";
    }
  }
  if (cards[0].cardNumber === 14) {
    switch (cards[1].cardNumber) {
      case 13:
      case 12:
        return "Raise or call; 50%-Pokcet";
      case 11:
      case 10:
        return "Raise or call; Bigger A?";
      case 9:
      case 8:
        return "Small/Raise with postion or call to JJ/QQ bet not bigger A?";
      default:
        return "small/raise with position; good to call against JJ/QQ bet";
    }
  }
  if (cards[0].cardNumber === 13) {
    switch (cards[1].cardNumber) {
      case 12:
        return "Raise or call";
      case 11:
        return "Raise or call medium";
      case 10:
        return "Raise or call small";
      default:
        return "call big blind with position";
    }
  }
  if (cards[0].cardNumber === 12) {
    switch (cards[1].cardNumber) {
      case 11:
        return "rasie or call";
      case 10:
        return "small rasie or call";
      case 9:
        return "call big blind";
      default:
        return "";
    }
  }
  if (cards[0].cardNumber === 11) {
    switch (cards[1].cardNumber) {
      case 10:
        return "small rasie or call";
      case 9:
        return "call big blind";
      default:
        return "";
    }
  }
  if (cards[0].cardNumber === 10) {
    switch (cards[1].cardNumber) {
      case 9:
        return "call big blind";

      default:
        return "";
    }
  }
  if (cards[0].cardNumber === 9) {
    switch (cards[1].cardNumber) {
      case 8:
        return "call big blind";
      default:
        return "";
    }
  }
};
export const checkBoard = (cards: ICard[], round: Round) => {
  let results = [];
  let result = checkBoardPair(cards);
  if (result) results.push(result);
  result = checkBoardFlush(cards, round);
  if (result) results.push(result);
  result = checkBoardStaight(cards);
  if (result) results.push(result);
};
export const checkMyHand = (cards: ICard[], myHand: ICard[], round: Round) => {
  let results = [];
  const allCards = [...cards, ...myHand].sort(
    (c1, c2) => c1.cardNumber - c2.cardNumber
  );
  let result = checkMyPair(allCards, myHand, round);
  if (result) results.push(result);
  result = checkMyFlush(allCards, myHand, round);
  if (result) results.push(result);
  result = checkMyStraight(allCards, myHand);
  if (result) results.push(result);
  return results;
};
const checkBoardFlush = (cards: ICard[], round: Round) => {
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
  } else if (round !== Round.River) {
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
        return `${
          cards[cards.length - 1]
        } Full house - prepare to fold, don't draw`;
      break;
    }

    if (
      cards[i].cardNumber === cards[i + 1].cardNumber &&
      cards[i].cardNumber === cards[i - 1].cardNumber
    )
      return "Four kind - prepare to fold.";
    if (cards[i].cardNumber === cards[i + 1].cardNumber)
      return `${
        cards[cards.length - 1]
      } Full house - prepare to fold, don't draw`;
  }
};
const checkBoardStaight = (cards: ICard[]) => {
  for (let i = cards.length - 3; i >= 0; i--) {
    const result = checkBoardStraightType(cards, i, 3);
    if (result) return result;
  }
};

const checkBoardStraightType = (cards: ICard[], howMany: number, i: number) => {
  let result: string;
  let cardGap: number;
  switch (howMany) {
    case 3:
      if (i < 0 || i > cards.length - 3) return "";

      cardGap = cards[i + 2].cardNumber - cards[i].cardNumber;
      if (cardGap === 2) {
        return (
          result ||
          `${getNumberText(
            (cards[i + 2].cardNumber > 14 && 14) || cards[i + 2].cardNumber
          )} high easy straight `
        );
      }
      if (cardGap === 3) {
        result = checkBoardStraightType(cards, 4, i - 1);
        return (
          result ||
          `${getNumberText(
            (cards[i + 1].cardNumber > 14 && 14) || cards[i + 1].cardNumber
          )} high easier straight`
        );
      }

      return (
        (cardGap === 4 &&
          `${getNumberText(cards[i].cardNumber)} high harder(3) straight`) ||
        ""
      );
    case 4:
      if (i < 0 || i > cards.length - 4) return "";
      cardGap = cards[i + 3].cardNumber - cards[i].cardNumber;
      if (cardGap === 3) {
        result = checkBoardStraightType(cards, 5, i - 1);
        return (
          result ||
          `${getNumberText(
            (cards[i + 2].cardNumber > 14 && 14) || cards[i + 2].cardNumber
          )} high straight-4`
        );
      }

      return (
        (cardGap === 4 &&
          `${getNumberText(
            (cards[i + 1].cardNumber > 14 && 14) || cards[i + 1].cardNumber
          )} high straight-4`) ||
        ""
      );
    case 5:
      if (i < 0 || i > cards.length - 5) return "";
      cardGap = cards[i].cardNumber - cards[i + 4].cardNumber;
      return (
        (cardGap === 5 &&
          `${getNumberText(
            (cards[i + 1].cardNumber > 14 && 14) || cards[i + 1].cardNumber
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
export const checkMyPair = (cards: ICard[], myHand: ICard[], round: Round) => {
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
  if (myPairType[PairType.overPair] === 2) return "over pair"; //PairType.overPair;
  if (myPairType[PairType.pair] === 2) return "2 pairs"; //PairType.pairs2;
  if (myPairType[PairType.pair] === 1) return "pair"; //PairType.pair;
  return ""; //PairType.none;
};
export const checkMyFlush = (cards: ICard[], myHand: ICard[], round: Round) => {
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
      if (suit === myHand[0].suit && myHand[0].suit === myHand[1].suit)
        return `flush, I don't fold`;
      else if (suit === myHand[0].suit || suit === myHand[1].suit)
        return `4 cards flush, A?`;
    case 4:
      if (round === Round.River) return "";

      if (suit === myHand[0].suit && suit === myHand[1].suit) {
        if (myHand[1].cardNumber === cards[cards.length - 1].cardNumber)
          return myHand[0].cardNumber === cards[cards.length - 2].cardNumber
            ? `30% flush/top pair(2) draw `
            : `24% flush/top pair draw`;
        else return `flush draw 18%`;
      } else if (suit === myHand[0].suit || suit === myHand[1].suit) {
        return "4 cards flush draw 18%";
      }
      return "";
  }
};
const checkMyStraight = (cards: ICard[], myHand: ICard[]) => {
  if (cards[cards.length - 1].cardNumber === 14)
    cards = [{ cardNumber: 1, suit: Suit.unknow }, ...cards];
  for (let i = cards.length - 5; i >= 0; i--) {
    const result = checkMyStraightFrom(cards, i);
    if (result) return result;
  }
  for (let i = cards.length - 4; i >= 0; i--) {
    const result = checkMyStraightDraw(cards, myHand, i);
    if (result) return result;
  }
};

const checkMyStraightFrom = (cards: ICard[], i: number) => {
  let cardGap: number;

  if (i < 0 || i > cards.length - 5) return "";

  cardGap = cards[i + 4].cardNumber - cards[i].cardNumber;
  if (cardGap === 4) return `${cards[i + 4].cardNumber} high straight`;
  return "";
};
const checkMyStraightDraw = (cards: ICard[], myHand: ICard[], i: number) => {
  let cardGap: number;

  if (i < 0 || i > cards.length - 4) return "";

  cardGap = cards[i + 3].cardNumber - cards[i].cardNumber;
  if (cardGap === 3) {
    if (i === cards.length - 4) {
      if (cards[i + 3].cardNumber === myHand[1].cardNumber) {
        if (cards[i + 2].cardNumber === myHand[0].cardNumber)
          return `draw 28% straight/top pair(2) draw `;
        else return `22% O/E straight/top pair draw `;
      } else return `16% O/E straight draw `;
    } else return `16% O/E straight draw`;
  }
  if (cardGap === 4) return `8% straight draw`;
  return "";
};

const countIt = (cards: ICard[], cardNumber: number) =>
  cards.filter(c => c.cardNumber === cardNumber).length;

export const getActionTip = (actions: IAction[], round: Round) => {
  //preflop->CheckRaise/big all in re-raise: AA
  //afterflop->CheckRaise/big all in re-raise: Set
};
