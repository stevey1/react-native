export interface IPlayer {
  id: number;
  name: string;
  playerType: PlayerType;
  isMe: boolean;
}
export interface ISeat {
  player: IPlayer;
  seatNumber: number;
}
export interface IPlay {
  myHand: ICard[];
  Board: ICard[];
  dear: ISeat;
  preflop: IAction[];
  afterflop: IAction[];
  turn: IAction[];
  river: IAction[];
}
export interface IAction {
  raiser: Nullable<ISeat>;
  callers: ISeat[];
  amount: number;
  checkRaise: boolean;
  raises: number;
}
export interface IActionHistory {
  action: IAction;
  round: Round;
}

export enum PlayerType {
  TT, //100% trust their raise
  LL,
  TL,
  LT,
  Bluffer
}
export enum PossibleHand {
  BigA,
  A,
  K,
  AA,
  BigPair,
  Pair
}
export enum Suit {
  c = 0,
  d,
  h,
  s,
  unknow = -1
}

export enum HandType {
  AA = 0,
  KK,
  QQ,
  JJ,
  Pair7_10,
  Pair2_6,
  AKQ,
  ATJ,
  A789,
  A2_6,
  KQJ,
  KT,
  Callable,
  Small
}
export enum BoardType {
  PairOnBoard,
  Flush,
  Staight,
  FlushDraw,
  StraightDraw,
  Dry
}
export enum MyHandMade {
  StraighFlush,
  FourOfKind,
  FullHouse,
  Flush,
  Straight,
  ThreeKind,
  TwoPair,
  Top10AboutPairAKKicker,
  TopPair,
  SecondPair
}
export enum Round {
  Preflop = 0,
  Flop,
  Turn,
  River
}
export interface ICard {
  cardNumber: number;
  suit: Suit;
}

export type A = 14;
export type K = 13;
export type Q = 12;
export type J = 11;
export type Nullable<T> = T | null;
