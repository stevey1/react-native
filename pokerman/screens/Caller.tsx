import React from "react";
import { View } from "react-native";
import { getSeatList } from "./../constants/helper";
import { ISeat } from "./../constants/DataTypes";
import MyMultiPicker from "../components/MyMultiPicker";

interface IProps {
  modalVisible: boolean;
  raiserSeatId: number;
  seats: ISeat[];
  callers: number[];
  callersSelected: (callers: ISeat[]) => void;
}
export default function Caller(props: IProps) {
  const handleItemsSelected = (indexes: number[]) => {
    const callers = indexes.map(index => props.seats[index]);
    props.callersSelected(callers);
  };

  return (
    <View>
      <MyMultiPicker
        modalVisible={props.modalVisible}
        hightlightValue={props.raiserSeatId}
        listItems={getSeatList(props.seats)}
        values={props.callers}
        itemsSelected={handleItemsSelected}
      />
    </View>
  );
}
