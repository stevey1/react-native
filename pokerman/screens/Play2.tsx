import React from "react";
import Play from "./Play";
import { seats as defaultSeats } from "../constants/helper";

export default function Play2() {
  console.log("dealer in p2", defaultSeats[0]);
  return (
    <Play
      bigBlind={2}
      dealer={defaultSeats[0].seatNumber}
      seats={defaultSeats}
    ></Play>
  );
}
