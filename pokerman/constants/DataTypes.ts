export interface IPlayer {
  id: number;
  name: string;
  preflopRaiseType: PlayType;
  preflopCallType: PlayType;
  raiseType: PlayType;
  callType: PlayType;
  isMe: boolean;
}
export interface ISeat {
  player: IPlayer;
  id: number;
  betOrder: number;
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

export enum PlayType {
  LL = 1,
  L,
  M,
  T,
  TT
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

export type Nullable<T> = T | null;
