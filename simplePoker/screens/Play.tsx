import React, { useState } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button } from "react-native-elements";
import i18n from "../i18n";
import { getNumberText, getSuitText } from "../constants/helper";
import { getMyHandPreflop, checkBoard, checkMyHand } from "../constants/master";
import styles from "./styles";

import { ICard } from "../constants/DataTypes";
export default function Play() {
  const [SuitOrNumber, setSuitOrNumber] = useState(1);
  const [CardIndex, setCardIndex] = useState(0);
  const [Step, setStep] = useState(1);
  const [MyHand, setMyHand] = useState([]);
  const [Board, setBoard] = useState([]);

  const handleCard = () => {
    if (CardIndex < 2) {
      const cardIndex = CardIndex;
      const myHand = [...MyHand];
      if (!myHand[cardIndex])
        myHand[cardIndex] = {
          suit: Math.round(Math.random() * 10) % 4,
          cardNumber: (Math.round(Math.random() * 20) % 13) + 2
        };
      if (SuitOrNumber === 0) {
        myHand[cardIndex].suit = (myHand[cardIndex].suit + 1) % 4;
      } else {
        myHand[cardIndex].cardNumber =
          ((myHand[cardIndex].cardNumber - 2 + Step) % 13) + 2;
      }
      setMyHand(myHand);
    } else {
      const cardIndex = CardIndex - 2;
      const board = [...Board];
      if (!board[cardIndex])
        board[cardIndex] = {
          suit: Math.round(Math.random() * 10) % 4,
          cardNumber: (Math.round(Math.random() * 20) % 13) + 2
        };
      if (SuitOrNumber === 0) {
        board[cardIndex].suit = (board[cardIndex].suit + 1) % 4;
      } else {
        board[cardIndex].cardNumber =
          ((board[cardIndex].cardNumber - 2 + Step) % 13) + 2;
      }
      setBoard(board);
    }
  };

  const showTips = () => {
    const myHand = [...MyHand]
      .filter(x => x)
      .sort((c1, c2) => c1.cardNumber - c2.cardNumber);
    const board = [...Board]
      .filter(x => x)
      .sort((c1, c2) => c1.cardNumber - c2.cardNumber);
    let tips = [];

    if (board.length < 3) {
      if (myHand.length == 2) {
        const result = getMyHandPreflop(myHand);
        if (result)
          tips.push(
            <View key="m" style={{ flexDirection: "row" }}>
              <Text key="m1" style={styles.text}>
                {i18n.t("play.myHand")}:
              </Text>
              <Text key="m2" style={styles.text}>
                {result}
              </Text>
            </View>
          );
      }
    } else {
      tips.push(
        <View key="b" style={{ flexDirection: "row" }}>
          <Text key="b1" style={styles.text}>
            {i18n.t("play.board")}:
          </Text>
          <View>{formatResult(checkBoard(board))}</View>
        </View>
      );
      if (myHand.length == 2) {
        tips.push(
          <View key="i" style={{ flexDirection: "row" }}>
            <Text key="i1" style={styles.text}>
              {i18n.t("play.iHave")}:{" "}
            </Text>
            <View>{formatResult(checkMyHand(board, myHand))}</View>
          </View>
        );
      }
      return <View>{tips}</View>;
    }
  };
  const formatResult = (results: string[]) =>
    results.map((x, index) => (
      <Text key={index} style={styles.text}>
        {x}
      </Text>
    ));

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={{ flexDirection: "row" }}>
          <Text>
            {displayCards(MyHand)} - {displayCards(Board)}
          </Text>
          <Button
            key="cardIndex"
            buttonStyle={{ backgroundColor: "#D1D1D1" }}
            style={{ marginRight: 3 }}
            title={getNumberText(CardIndex + 1)}
            titleStyle={{ color: "#000000" }}
            onPress={() => setCardIndex((CardIndex + 1) % 7)}
          />
          <Button
            key="increase"
            buttonStyle={{ backgroundColor: "#D1D1D1" }}
            title={i18n.t("button.select")}
            titleStyle={{ color: "#000000" }}
            onPress={handleCard}
            style={{ marginRight: 3 }}
          />
          <Button
            key="suitOrNumber"
            buttonStyle={{ backgroundColor: "#D1D1D1" }}
            style={{ marginRight: 3 }}
            title={i18n.t("suitOrNumber." + SuitOrNumber.toString())}
            titleStyle={{ color: "#000000" }}
            onPress={() => setSuitOrNumber((SuitOrNumber + 1) % 2)}
          />
          <Button
            key="step"
            buttonStyle={{ backgroundColor: "#D1D1D1" }}
            title={getNumberText(Step)}
            titleStyle={{ color: "#000000" }}
            onPress={() => setStep((Step % 4) + 1)}
            style={{ marginRight: 3 }}
          />
          <Button
            key="new"
            buttonStyle={{ backgroundColor: "#D1D1D1" }}
            title={i18n.t("button.new")}
            titleStyle={{ color: "#000000" }}
            onPress={() => {
              setMyHand([]);
              setBoard([]);
              setSuitOrNumber(1);
              setCardIndex(0);
              setStep(1);
            }}
            style={{ marginRight: 3 }}
          />
        </View>
      </View>
    </ScrollView>
  );
}
const displayCards = (cards: ICard[]) => {
  cards = cards.filter(card => card);
  // .sort((a, b) => a.cardNumber - b.cardNumber);
  const suitDisplay = cards.map(card => getSuitText(card.suit)).join("");
  const cardDisplay = cards
    .map(card => getNumberText(card.cardNumber))
    .join("");
  return (
    <View style={{ flexDirection: "row" }}>
      <Text>{suitDisplay}</Text>
      <Text>{cardDisplay}</Text>
    </View>
  );
};
