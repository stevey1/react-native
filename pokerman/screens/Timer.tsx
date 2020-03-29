import React, { useState, useEffect } from "react";
import { Text, TextInput, View, SectionList, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Overlay } from "react-native-elements";
import { useQuery } from "@apollo/react-hooks";
import { GET_GAME_FORMAT } from "../constants/apolloQuery";
import { GameType } from "../constants/DataTypes";

import styles, { sectionListStyles } from "./styles";
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
      ? i18n.locale == "en"
        ? cashTipInEnglish
        : cashTipInChinese
      : i18n.locale == "en"
      ? tournamentTipInEnglish
      : tournamentTipInChinese;
  const tipOverlay = () =>
    ShowTip ? (
      <Overlay
        overlayBackgroundColor="#F5F5F5"
        width="100%"
        height="70%"
        isVisible={ShowTip}
        onBackdropPress={() => setShowTip(false)}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={sectionListStyles.container}>
            <SectionList
              sections={tips}
              renderItem={({ item }) => (
                <Text style={sectionListStyles.item}>{item}</Text>
              )}
              renderSectionHeader={({ section }) => (
                <Text style={sectionListStyles.sectionHeader}>
                  {section.title}
                </Text>
              )}
              keyExtractor={(item, index) => index}
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
const cashTipInEnglish = [
  {
    title: "General",
    data: [
      "Control Session Time, keep energy level",
      "Put on headphone, focus on game",
      "Play Safe, think about worse cases",
      "No Drawing: Pair on Boad/Flush on Board",
      "Preflop Re-raise, re-raise big",
      "Loop for All in opportunity"
    ]
  },
  {
    title: "Opponent Hand",
    data: [
      "Preflop raise：A*?, K*?, Pocket middle pair?",
      "Preflop big raise：Pocket Big Pair? A*? K*?",
      "Preflop Check Raise -> AA/KK",
      "Hand blocker: block flush",
      "Opponent's range; Raiser's flop or Callers's flop",
      "3 aces in play: board/me/opponent",
      "After flop bet: top pair/C-bet? ",
      "After flop big bet: 2 pair ",
      "Afterflop Check Raise: Set/Straight"
    ]
  }
];
const cashTipInChinese = [
  {
    title: "遵守牌道",
    data: [
      "控制时间 - 保证精力和清醒的头脑",
      "戴上耳机，专心牌局 排除干扰",
      "Play安全, 小心黄雀在后",
      "能All in就All in, 寻找All in机会",
      "牌面对/同花/顺，不要侥幸",
      "不打倔强牌：陷阱叫，超级叫 -> 服输"
    ]
  },
  {
    title: "分析对手牌",
    data: [
      "翻牌前小叫 - 牌型：A*?, K*?, 手中对?",
      "翻牌前大叫 - 牌型：手中大对? A*? K*?",
      "翻牌前陷阱叫，超级叫: AA/KK/QQ/JJ",
      "对手Range：牌面是Raiser Range/Caller Range",
      "假设局中3个A: 牌面/自己/对手",
      "Hand blocker: block flush",
      "翻牌后小叫: 一大对?, C-Bet?, draw?",
      "翻牌后大叫: 两对",
      "翻牌后陷阱叫，超级叫: 三张/顺子"
    ]
  }
];
const tournamentTipInEnglish = [
  {
    title: "General",
    data: [
      "Put on headphone, focus on game",
      "Play tight firt, then loose",
      "Don't give up",
      "No preflop over bet in tight play",
      "Loop for All in opportunity"
    ]
  },
  {
    title: "All in - Safe Play",
    data: [
      "Prefer I go all in rather to calling all in",
      "All in to componet with small stack",
      "Confirm this is all in hand",
      "AK/JJ/TT is not preflop all in hand in tight period",
      "After flop, Try to all in if I can"
    ]
  },
  {
    title: "Opponent Hand",
    data: [
      "Preflop raise：A*?, K*?, Pocket middle pair?",
      "Preflop big raise：Pocket Big Pair? A*? K*?",
      "Preflop Check Raise -> AA/KK",
      "Hand blocker: block flush",
      "Opponent's range; Raiser's flop or Callers's flop",
      "3 aces in play: board/me/opponent",
      "After flop bet: top pair/C-bet? ",
      "After flop big bet: 2 pair ",
      "Afterflop Check Raise: Set/Straight"
    ]
  }
];
const tournamentTipInChinese = [
  {
    title: "原则",
    data: [
      "戴上耳机，专心牌局 排除干扰",
      "永不放弃",
      "先紧后松",
      "能All in就All in, 寻找All in机会"
    ]
  },
  {
    title: "All in - Play安全",
    data: [
      "要主动All in 不要被动All in, Play安全",
      "与少筹码的人All in，Play安全",
      "前期AK/JJ/TT不能翻牌前all in，Play安全",
      "确定是All in牌, Play安全",
      "翻牌后能All in就All in, Play安全"
    ]
  },
  {
    title: "分析对手牌",
    data: [
      "翻牌前小叫 - 牌型：A*?, K*?, 手中对?",
      "翻牌前大叫 - 牌型：手中大对? A*? K*?",
      "翻牌前陷阱叫, 超级叫: AA/KK/QQ/JJ",
      "对手Range：牌面是Raiser Range/Caller Range",
      "假设局中3个A: 牌面/自己/对手",
      "Hand blocker: block flush",
      "翻牌后小叫: 一大对?, C-Bet?, draw?",
      "翻牌后大叫: 两对",
      "翻牌后陷阱叫，超级叫: 三张/顺子"
    ]
  }
];
