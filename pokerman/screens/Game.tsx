import React, { useState } from "react";
import { Text, View, TextInput } from "react-native";
import { Button, CheckBox } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import i18n from "../i18n";
import styles from "./styles";
import { useQuery } from "@apollo/react-hooks";
import { GET_GAME_FORMAT } from "../constants/apolloQuery";
import { GameType, LanguageType } from "../constants/DataTypes";

export default function Game(props) {
  const {
    data: { gameFormat },
    client
  } = useQuery(GET_GAME_FORMAT);

  const [GameFormat, setGameFormat] = useState(gameFormat);
  const [Language, setLanguage] = useState(i18n.locale === "en" ? 0 : 1);

  const handleFinishSetup = () => {
    client.writeData({ data: { GameFormat } });
    props.navigation.navigate("seat");
  };
  const getCheckBoxes = () => {
    return getGameTypeList().map((listItem, index) => (
      <CheckBox
        key={"c" + index.toString()}
        checked={GameFormat.gameType == index}
        onPress={() => {
          const gameFormat = { ...GameFormat };
          gameFormat.gameType = index;
          setGameFormat(gameFormat);
        }}
        size={16}
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        title={listItem.text}
        containerStyle={{
          margin: 0,
          padding: 0,
          borderColor: "#f2f2f2",
          backgroundColor: "#f2f2f2"
        }}
      />
    ));
  };
  const getLanguageBoxes = () => {
    return getLanguageTypeList().map((listItem, index) => (
      <CheckBox
        key={"l" + index.toString()}
        checked={Language === index}
        onPress={() => {
          i18n.locale = LanguageType[index];
          setLanguage(index);
        }}
        size={16}
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        title={listItem.text}
        containerStyle={{
          margin: 0,
          padding: 0,
          borderColor: "#f2f2f2",
          backgroundColor: "#f2f2f2"
        }}
      />
    ));
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View>
          <View style={[styles.control, { marginBottom: 10 }]}>
            <Text key="tst" style={styles.label}>
              {i18n.t("game.language")}:
            </Text>
            <View style={{ flexDirection: "column" }}>
              {getLanguageBoxes()}
            </View>
          </View>
          <View style={[styles.control, { marginBottom: 10 }]}>
            <Text key="tst" style={styles.label}>
              {i18n.t("game.gameType")}:
            </Text>
            <View style={{ flexDirection: "column" }}>{getCheckBoxes()}</View>
          </View>

          <View key="vs" style={styles.control}>
            <Text key="ts" style={styles.label}>
              {i18n.t("game.smallBlind")}:
            </Text>
            <TextInput
              key="tis"
              value={GameFormat.smallBlind?.toString() ?? ""}
              onChange={e => {
                const gameFormat = { ...GameFormat };
                gameFormat.smallBlind = e.nativeEvent.text
                  ? parseInt(e.nativeEvent.text)
                  : null;
                setGameFormat(gameFormat);
              }}
              keyboardType={"numeric"}
              maxLength={3}
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
          <View key="vb" style={styles.control}>
            <Text key="tb" style={styles.label}>
              {i18n.t("game.bigBlind")}:
            </Text>
            <TextInput
              key="bigBlind"
              value={GameFormat.bigBlind?.toString() ?? ""}
              onChange={e => {
                const gameFormat = { ...GameFormat };
                gameFormat.bigBlind = e.nativeEvent.text
                  ? parseInt(e.nativeEvent.text)
                  : null;
                setGameFormat(gameFormat);
              }}
              keyboardType={"numeric"}
              maxLength={3}
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
          <View key="vst" style={styles.control}>
            <Text key="tst" style={styles.label}>
              {i18n.t("game.straddle")}:
            </Text>
            <TextInput
              key="straddle"
              value={GameFormat.straddle?.toString() ?? ""}
              onChange={e => {
                const gameFormat = { ...GameFormat };
                gameFormat.straddle = e.nativeEvent.text
                  ? parseInt(e.nativeEvent.text)
                  : null;
                setGameFormat(gameFormat);
              }}
              keyboardType={"numeric"}
              maxLength={3}
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
        </View>
        <Button
          buttonStyle={{ backgroundColor: "#D1D1D1" }}
          titleStyle={{ color: "#000000" }}
          title={i18n.t("button.done")}
          onPress={handleFinishSetup}
        />
      </View>
    </ScrollView>
  );
}
const getGameTypeList = () => {
  let list = [];
  for (let item in GameType) {
    let value = Number(item);
    if (!isNaN(value)) {
      list.push({ text: i18n.t("gameType." + value), value: value });
    }
  }
  return list;
};

const getLanguageTypeList = () => {
  let list = [];
  for (let item in LanguageType) {
    let value = Number(item);
    if (!isNaN(value)) {
      list.push({ text: i18n.t("language." + value), value: value });
    }
  }
  return list;
};
