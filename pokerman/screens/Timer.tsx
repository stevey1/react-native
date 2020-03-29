import React, { useState, useEffect } from "react";
import { Text, TextInput, View, SectionList, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Overlay } from "react-native-elements";
import { useQuery } from "@apollo/react-hooks";
import { GET_GAME_FORMAT } from "../constants/apolloQuery";
import { GameType } from "../constants/DataTypes";

import styles from "./styles";
import i18n from "../i18n";
interface IProps {
  targetTime: number;
  handleSetTargetTime: (targetTime: number) => void;
}
export default function Timer(props: IProps) {
  const [ShowTip, setShowTip] = useState(false);
  const [SessionTime, setSessionTime] = useState(0);
  const [TargetTime, setTargetTime] = useState(props.targetTime);
  const [TimeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    setInterval(() => {
      if (TargetTime > 0)
        setTimeLeft(Math.round(TargetTime - new Date().getTime() / 1000));
    }, 1000);
  });
  const gameType = getGameFormat();
  const tips =
    gameType === GameType.cash
      ? [
          {
            title: "General",
            data: [
              "Control Session Time",
              "戴上耳机，排除干扰",
              "Keep Energy level",
              "Safe Play, think about worse cases",
              "Don't play Drawing dead: Pair on Boad/Flush on Board",
              "Preflop Re-raise - Re-raise？re-raise big"
            ]
          },
          {
            title: "Opponent Hand",
            data: [
              "牌型：1 - A*； 2 - K*(any ghost card)；3 - 手中对",
              "Preflop raise：1 - regular A*/small pair；2 - medium pair；3 - big pair",
              "Hand blocker",
              "After flop bet: 1 - top pair；2- big Set/Straight Bet",
              "3 aces in play: 1 on board, 1 for me; 1 for another players hand"
            ]
          }
        ]
      : [
          {
            title: "General",
            data: [
              "戴上耳机，排除干扰",
              "Preflop raise - don't over raise, avoid getting re-raised"
            ]
          },
          {
            title: "All",
            data: [
              "主动 all in",
              "don't call all in unless...",
              "not 50-50 all to big stack; but shorter stack; ",
              "not with 2nd pair",
              "AK/JJ/TT are not good all in preflop; only 50%-"
            ]
          },
          {
            title: "Opponent Hand",
            data: [
              "牌型：1 - A*； 2 - K*(any ghost card)；3 - 手中对",
              "Preflop raise：1 - regular A*/small pair；2 - medium pair；3 - big pair",
              "Hand blocker",
              "After flop bet: 1 - top pair；2- big Set/Straight Bet",
              "3 aces in play: 1 on board, 1 for me; 1 for another players hand"
            ]
          }
        ];
  const tipOverlay = () =>
    ShowTip ? (
      <Overlay
        overlayBackgroundColor="#F5F5F5"
        width="90%"
        height="70%"
        isVisible={ShowTip}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={[styles.container, { justifyContent: "space-between" }]}>
            <View style={myStyles.container}>
              <SectionList
                sections={tips}
                renderItem={({ item }) => (
                  <Text style={styles.item}>{item}</Text>
                )}
                renderSectionHeader={({ section }) => (
                  <Text style={styles.sectionHeader}>{section.title}</Text>
                )}
                keyExtractor={(item, index) => index}
              />
            </View>
            <Button
              buttonStyle={{
                backgroundColor: "#D1D1D1"
              }}
              title={i18n.t("button.return")}
              titleStyle={{ color: "#000000" }}
              onPress={() => setShowTip(false)}
            />
          </View>
        </ScrollView>
      </Overlay>
    ) : (
      <View></View>
    );
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={[styles.container, { justifyContent: "space-between" }]}>
        <View style={styles.control}>
          <Text style={[styles.label, { width: 110 }]}>
            {i18n.t("timer.sessionTime")}:
          </Text>
          <TextInput
            onChange={e => {
              const value = e.nativeEvent.text
                ? parseInt(e.nativeEvent.text)
                : null;
              if (value) setSessionTime(value);
            }}
            keyboardType={"numeric"}
            maxLength={1}
            selectTextOnFocus={true}
            style={[styles.textInput, { flex: 1, marginRight: 3 }]}
          />
          <Button
            buttonStyle={{
              backgroundColor: "#D1D1D1"
            }}
            title={i18n.t("button.startTimer")}
            titleStyle={{ color: "#000000" }}
            onPress={() => {
              if (SessionTime > 0) {
                const now = new Date();
                const targetTime = Math.floor(
                  now.setHours(now.getHours() + SessionTime) / 1000
                );
                setTargetTime(targetTime);
                props.handleSetTargetTime(targetTime);
              }
            }}
          />
        </View>
        <View>
          <Text key="timer" style={{ textAlign: "center", fontSize: 72 }}>
            {Math.floor(TimeLeft / 3600)}:
            {(Math.floor(TimeLeft / 60) % 60).toString().padStart(2, "0")}:
            {(TimeLeft % 60).toString().padStart(2, "0")}
          </Text>
        </View>
        {tipOverlay()}
        <View style={styles.control}>
          <Text onPress={() => setShowTip(true)}>{i18n.t("timer.tip")}</Text>
        </View>
      </View>
    </ScrollView>
  );
}
const getGameFormat = () => {
  const { data } = useQuery(GET_GAME_FORMAT);
  return data.gameFormat.gameType;
};

const myStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: "rgba(247,247,247,1.0)"
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44
  }
});
