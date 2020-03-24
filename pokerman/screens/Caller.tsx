import React from "react";
import { View } from "react-native";
import { ISeat } from "./../constants/DataTypes";
import MyMultiPicker from "../components/MyMultiPicker";
interface IProps {
  modalVisible: boolean;
  raiserSeatNumber: number;
  seats: ISeat[];
  callers: number[];
  callersSelected: (callers: ISeat[]) => void;
}
export default function Caller(props: IProps) {
  const handleItemsSelected = (indexes: number[]) => {
    const callers = indexes.map(index => props.seats[index]);
    props.callersSelected(callers);
  };

  const getListItems = () =>
    props.seats.map((seat, i) => ({
      text: seat.player.name,
      value: seat.seatNumber
    }));

  return (
    <View>
      <MyMultiPicker
        modalVisible={props.modalVisible}
        hightlightValue={props.raiserSeatNumber}
        listItems={getListItems()}
        values={props.callers}
        itemsSelected={handleItemsSelected}
      />
    </View>
  );
}
