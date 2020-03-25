import React, { useState } from "react";
import { Text, View, TextInput } from "react-native";
import { Button } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import i18n from "../i18n";
import styles from "./styles";
import { useQuery } from "@apollo/react-hooks";
import { GET_GAME_FORMAT } from "../constants/apolloQuery";

export default function Game(props) {
  const {
    data: { gameFormat },
    client
  } = useQuery(GET_GAME_FORMAT);
  const [SmallBlind, setSmallBlind] = useState(gameFormat.smallBlind);
  const [BigBlind, setBigBlind] = useState(gameFormat.bigBlind);
  const [Straddle, setStraddle] = useState(gameFormat.straddle);
  const handleFinishSetup = () => {
    gameFormat.smallBlind = SmallBlind;
    gameFormat.bigBlind = BigBlind;
    gameFormat.straddle = Straddle;
    client.writeData({ data: {} });
    props.navigation.navigate("seat");
  };
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View>
          <View key="vs" style={styles.control}>
            <Text key="ts" style={styles.label}>
              {i18n.t("game.smallBlind") + ":"}
            </Text>
            <TextInput
              key="tis"
              onChange={e =>
                setSmallBlind(
                  e.nativeEvent.text ? parseInt(e.nativeEvent.text) : null
                )
              }
              value={SmallBlind?.toString() ?? ""}
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
              {i18n.t("game.bigBlind") + ":"}
            </Text>
            <TextInput
              key="bigBlind"
              onChange={e =>
                setBigBlind(
                  e.nativeEvent.text ? parseInt(e.nativeEvent.text) : null
                )
              }
              value={BigBlind?.toString() ?? ""}
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
              {i18n.t("game.straddle") + ":"}
            </Text>
            <TextInput
              key="straddle"
              onChange={e =>
                setStraddle(
                  e.nativeEvent.text ? parseInt(e.nativeEvent.text) : null
                )
              }
              value={Straddle?.toString() ?? ""}
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
