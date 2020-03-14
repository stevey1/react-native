import React from "react";
import Play from "./Play";
import { seats as defaultSeats } from "../constants/helper";

const Play2 = () => (
  <Play bigBlind={2} dealerSeatIndex={0} seats={defaultSeats}></Play>
);

export default Play2;
