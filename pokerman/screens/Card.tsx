import React, { useState } from "react";
import { View } from "react-native";
import { Suit as SuitType, ICard } from "../constants/DataTypes";
import { getNumberText, getCardColor, getSuitText } from "../constants/helper";
import MyPicker from "../components/MyPicker";
import MyDropDownButton from "../components/MyDropDownButton";
interface IProps {
  handleCard: (card: ICard) => void;
}
export default function Card(props) {
  const [CardNumber, setCardNumber] = useState(-1);
  const [CardSelected, setCardSelected] = useState("");
  const [Suit, setSuit] = useState(SuitType.unknow);
  const [SuitSelected, setSuitSelected] = useState("");
  const [SuitVisible, setSuitVisible] = useState(false);
  const [CardVisible, setCardVisible] = useState(false);
  const handleSuitSelected = (index: number) => {
    setSuitVisible(false);
    setSuit(index);
    setSuitSelected(getSuitText(index));
    if (index >= 0 && CardNumber >= 0) {
      props.handleCard({ cardNumber: CardNumber, suit: index });
    }
  };
  const handleCardSelected = (index: number, value: string) => {
    const cardNumber = parseInt(value);
    setCardVisible(false);
    setCardNumber(cardNumber);
    setCardSelected(getNumberText(cardNumber));
    if (cardNumber >= 0 && Suit >= 0) {
      props.handleCard({ cardNumber: cardNumber, suit: Suit });
    }
  };

  const showSuitDropDown = () => (
    <MyPicker
      key="suit"
      value={Suit >= 0 ? Suit : null}
      style={getCardColor(Suit)}
      modalVisible={SuitVisible}
      itemSelected={handleSuitSelected}
      listItems={getSuitList()}
    ></MyPicker>
  );
  const showCardDropDown = () => (
    <MyPicker
      key="card"
      value={CardNumber >= 0 ? CardNumber : null}
      style={getCardColor(Suit)}
      modalVisible={CardVisible}
      itemSelected={handleCardSelected}
      listItems={getCardList()}
    ></MyPicker>
  );

  return (
    <View style={{ flexDirection: "row" }}>
      <MyDropDownButton
        key="s"
        style={{
          width: 45,
          margin: 0
        }}
        label={SuitSelected}
        labelStyle={getCardColor(Suit)}
        onPress={() => setSuitVisible(true)}
      />
      <MyDropDownButton
        key="c"
        style={{
          marginRight: 2,
          width: 45
        }}
        labelStyle={getCardColor(Suit)}
        label={CardSelected}
        onPress={() => setCardVisible(true)}
      />
      {showSuitDropDown()}
      {showCardDropDown()}
    </View>
  );
}
const getCardList = () =>
  [14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2].map(i => ({
    text: getNumberText(i),
    value: i
  }));
const getSuitList = () => {
  let list = [];
  for (let item in SuitType) {
    let value = Number(item);

    if (!isNaN(value) && value >= 0) {
      list.push({ text: getSuitText(value), value: value });
    }
  }
  return list;
};
