import React, { useState, useEffect } from "react";
import { SectionList, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Image, Overlay } from "react-native-elements";

import i18n from "../i18n";
import { getNumberText, getSuitText } from "../constants/helper";
import { getMyHandPreflop, checkBoard, checkMyHand } from "../constants/master";
import styles, { sectionListStyles } from "./styles";

import { ICard, GameType } from "../constants/DataTypes";
import { Dimensions } from "react-native";
import images from "../assets/images";
export default function Play() {
  const [SuitOrNumber, setSuitOrNumber] = useState(1);
  const [Index, setIndex] = useState([0, 1]);
  const [CardIndex, setCardIndex] = useState(0);
  const [MyHand, setMyHand] = useState([]);
  const [Board, setBoard] = useState([]);
  const [ShowTip, setShowTip] = useState(false);
  const [TargetTime, setTargetTime] = useState(0);
  const [GameTypeValue, setGameTypeValue] = useState(GameType.cash);

  const windowHeight = Dimensions.get("window").height;
  const Pictures = [
    images.image0,
    images.image1,
    images.image2,
    images.image3,
    images.image4,
    images.image5,
    images.image6,
    images.image7,
    images.image8,
    images.image9,
    images.image10,
    images.image11,
    images.image12,
    images.image13,
    images.image14,
    images.image15,
    images.image16,
    images.image17,
    images.image18,
    images.image19,
    images.image20
  ];
  useEffect(() => {
    setInterval(() => {
      const now = Math.round(new Date().getTime() / 1000);
      if (now > TargetTime) {
        setTargetTime(now + 180);
        const index = [
          Math.round(Math.random() * 41) % 21,
          Math.round(Math.random() * 35) % 21
        ];
        setIndex(index);
      }
    }, 120000);
  });

  const handleCard = step => {
    if (step < 0) step = 13 + step;
    if (CardIndex < 2) {
      const cardIndex = CardIndex;
      const myHand = [...MyHand];
      if (!myHand[cardIndex])
        myHand[cardIndex] = {
          suit: Math.round(Math.random() * 10) % 4,
          cardNumber: (Math.round(Math.random() * 20) % 13) + 2
        };
      if (SuitOrNumber === 0) {
        myHand[cardIndex].suit = (myHand[cardIndex].suit + step) % 4;
      } else {
        myHand[cardIndex].cardNumber =
          ((myHand[cardIndex].cardNumber - 2 + step) % 13) + 2;
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
        board[cardIndex].suit = (board[cardIndex].suit + step) % 4;
      } else {
        board[cardIndex].cardNumber =
          ((board[cardIndex].cardNumber - 2 + step) % 13) + 2;
      }
      setBoard(board);
    }
  };

  const tips =
    GameTypeValue === GameType.cash
      ? i18n.locale == "en"
        ? cashTipInEnglish
        : cashTipInChinese
      : i18n.locale == "en"
      ? tournamentTipInEnglish
      : tournamentTipInChinese;
  const showTips = () => {
    const myHand = [...MyHand]
      .filter(x => x)
      .sort((c1, c2) => c1.cardNumber - c2.cardNumber);
    const board = [...Board]
      .filter(x => x)
      .sort((c1, c2) => c1.cardNumber - c2.cardNumber);
    let tips = [];
    let results = [];

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
      results = checkBoard(board);
      if (results.length > 0)
        tips.push(
          <View key="b" style={{ flexDirection: "row" }}>
            <Text key="b1" style={styles.text}>
              {i18n.t("play.board")}:
            </Text>
            <View>{formatResult(checkBoard(board))}</View>
          </View>
        );
    }
    if (myHand.length == 2) {
      results = checkMyHand(board, myHand);
      if (results.length > 0)
        tips.push(
          <View key="i" style={{ flexDirection: "row" }}>
            <Text key="i1" style={styles.text}>
              {i18n.t("play.iHave")}:{" "}
            </Text>
            <View>{formatResult(checkMyHand(board, myHand))}</View>
          </View>
        );
    }
    return tips.length > 0 ? <View>{tips}</View> : <View></View>;
  };
  const formatResult = (results: string[]) =>
    results.map((x, index) => (
      <Text key={index} style={styles.text}>
        {x}
      </Text>
    ));
  const tipOverlay = () =>
    ShowTip ? (
      <Overlay
        overlayBackgroundColor="#F5F5F5"
        width="100%"
        height="80%"
        isVisible={ShowTip}
        onBackdropPress={() => setShowTip(false)}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
        </ScrollView>
      </Overlay>
    ) : (
      <View></View>
    );
  const displayCards = (cards: ICard[]) => {
    cards = cards.filter(card => card);
    // .sort((a, b) => a.cardNumber - b.cardNumber);
    const suitDisplay = cards.map(card => getSuitText(card.suit)).join("");
    const cardDisplay = cards
      .map(card => getNumberText(card.cardNumber))
      .join("");
    return (
      <View style={{ flexDirection: "row" }}>
        <Text
          onPress={() => {
            setGameTypeValue(GameType.cash);
            setShowTip(true);
          }}
        >
          {suitDisplay}
        </Text>
        <Text
          onPress={() => {
            setGameTypeValue(GameType.tournament);
            setShowTip(true);
          }}
        >
          {cardDisplay}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View>
          <Image
            key="1"
            style={{
              height: windowHeight / 2,
              resizeMode: "stretch"
            }}
            source={Pictures[Index[0]]}
          />
          <Image
            key="3"
            style={{
              height: windowHeight / 2,
              resizeMode: "stretch"
            }}
            source={Pictures[Index[1]]}
          />
        </View>
        {tipOverlay()}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row" }}>
            <Button
              key="cardIndex"
              buttonStyle={{ backgroundColor: "#D1D1D1" }}
              style={{ marginRight: 3 }}
              title={getNumberText(CardIndex + 1)}
              titleStyle={{ color: "#000000" }}
              onPress={() => {
                setSuitOrNumber(1);
                setCardIndex((CardIndex + 1) % 7);
              }}
            />
            <Button
              key="suitOrNumber"
              buttonStyle={{ backgroundColor: "#D1D1D1" }}
              style={{ marginRight: 3 }}
              title={i18n.t("suitOrNumber." + SuitOrNumber.toString())}
              titleStyle={{ color: "#000000" }}
              onPress={() => setSuitOrNumber((SuitOrNumber + 1) % 2)}
            />
          </View>
          <View>
            {displayCards(MyHand)}
            {displayCards(Board)}
          </View>

          <View style={{ flexDirection: "row" }}>
            <Button
              key="forward"
              buttonStyle={{ backgroundColor: "#D1D1D1" }}
              title={i18n.t("button.forward")}
              titleStyle={{ color: "#000000" }}
              onPress={() => handleCard(1)}
              style={{ marginRight: 3 }}
            />
            <Button
              key="goForward"
              buttonStyle={{ backgroundColor: "#D1D1D1" }}
              title={i18n.t("button.goForward")}
              titleStyle={{ color: "#000000" }}
              onPress={() => handleCard(3)}
              style={{ marginRight: 3 }}
            />
          </View>
        </View>

        <View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            {showTips()}
            <View style={{ flexDirection: "row" }}>
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
                }}
                style={{ marginRight: 3 }}
              />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const cashTipInEnglish = [
  {
    title: "General",
    data: [
      "Control Session Time, keep energy level",
      "Put on headphone, focus on game",
      "Play Safe, no slow play, no over bet; think about worse cases",
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
      "戴上耳机 - 专心牌局, 排除干扰, 沉著冷靜",
      "安全打, no slow play, no over bet; 小心黄雀在后",
      "能All in就All in, 寻找All in机会",
      "牌面对/同花/顺，不要侥幸",
      "不打倔强牌：陷阱注，超级注 -> 服输",
      "AK對不跟All in；牌面順子，兩對不跟All in"
    ]
  },
  {
    title: "分析对手牌",
    data: [
      "翻牌前小注 - 牌型：A*?, K*?, 手中对?",
      "翻牌前大注 - 牌型：手中大对? A*? K*?",
      "翻牌前陷阱注，超级注: AA/KK/QQ/JJ",
      "对手Range：牌面是Raiser Range/Caller Range",
      "假设局中3个A: 牌面/自己/对手",
      "Hand blocker: block flush",
      "翻牌后小注: 一大对?, C-Bet?, draw?",
      "翻牌后大注: 两对",
      "翻牌后陷阱注，超级注: 三张/顺子"
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
      "先紧后松, 永不放弃",
      "能All in就All in, 寻找All in机会",
      "AK對不跟All in；牌面順子，兩對不跟All in"
    ]
  },
  {
    title: "All in - Play安全",
    data: [
      "要主动All in 不要被动All in",
      "与少筹码的人All in",
      "前期AK/JJ/TT不能翻牌前all in",
      "确定是All in牌",
      "翻牌后能All in就All in"
    ]
  },
  {
    title: "分析对手牌",
    data: [
      "翻牌前小注 - 牌型：A*?, K*?, 手中对?",
      "翻牌前大注 - 牌型：手中大对? A*? K*?",
      "翻牌前陷阱注, 超级注: AA/KK/QQ/JJ",
      "对手Range：牌面是Raiser Range/Caller Range",
      "假设局中3个A: 牌面/自己/对手",
      "Hand blocker: block flush",
      "翻牌后小注: 一大对?, C-Bet?, draw?",
      "翻牌后大注: 两对",
      "翻牌后陷阱注，超级注: 三张/顺子"
    ]
  }
];
