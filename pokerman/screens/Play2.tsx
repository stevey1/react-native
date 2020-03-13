import React from "react";
import Play from "./Play";
import { seats as defaultSeats } from "../constants/helper";

export default function Play2() {
  return (
    <Play bigBlind={2} dealer={defaultSeats[0]} seats={defaultSeats}></Play>
  );
}
