import React, { useState } from "react";
import { TextInput, Text, View } from "react-native";
import { ISeat } from "./../constants/DataTypes";
import i18n from "../i18n";
import MyPicker from "../components/MyPicker";
import MyDropDownButton from "../components/MyDropDownButton";
import { getSeatList } from "./../constants/helper";

interface IProps {
  bigBlind?: number;
  seats: ISeat[];
  handleAction: (raiser: ISeat, amount: number) => void;
}
export default function Action(props: IProps) {
  const [SeatModalVisible, setSeatModalVisible] = useState(false);
  const [Amount, setAmount] = useState(props.bigBlind ?? 0);
  const [Raiser, setRaiser] = useState(
    props.bigBlind ? props.seats[props.seats.length - 1] : null
  );
  const [RaiserSelected, setRaiserSelected] = useState(
    props.bigBlind ? props.seats[props.seats.length - 1].player.name : ""
  );

  const handleChange = e => {
    const amount = parseInt(e.nativeEvent.text);
    setAmount(amount);

    if (Raiser && amount) {
      props.handleAction(Raiser, amount);
    }
  };

  const handleRaiserSelected = (index: number) => {
    const raiser = props.seats[index];
    setRaiser(raiser);
    setAmount(0);
    setSeatModalVisible(false);
    setRaiserSelected(raiser.player.name);
  };

  const showSeatDropDown = () =>
    (SeatModalVisible && (
      <MyPicker
        modalVisible={SeatModalVisible}
        value={Raiser?.id}
        itemSelected={handleRaiserSelected}
        listItems={getSeatList(props.seats)}
      ></MyPicker>
    )) || <View></View>;

  return (
    <View style={{ flexDirection: "row" }}>
      <MyDropDownButton
        style={{
          width: 80
        }}
        label={RaiserSelected}
        onPress={() => setSeatModalVisible(true)}
      />
      {showSeatDropDown()}
      <Text
        style={{
          width: 45,
          textAlign: "right"
        }}
      >
        {i18n.t("action.amount")}:
      </Text>
      <TextInput
        key="amount"
        onChange={handleChange}
        value={Amount ? Amount.toString() : ""}
        keyboardType={"numeric"}
        maxLength={4}
        selectTextOnFocus={true}
        style={{
          width: 50,
          marginLeft: 5,
          paddingLeft: 5,
          backgroundColor: "#D1D1D1",
          borderWidth: 1
        }}
      />
    </View>
  );
}
