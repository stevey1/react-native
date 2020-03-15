export interface IPlayer {
  id: number;
  name: string;
  playerType: PlayerType;
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
