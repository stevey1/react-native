import React, { useState } from "react";
import { Text, View, TextInput } from "react-native";
import { Button } from "react-native-elements";
import MyPicker from "../components/MyPicker";
import MyDropDownButton from "../components/MyDropDownButton";
import styles from "./styles";
import { ScrollView } from "react-native-gesture-handler";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { getPlayerList } from "../constants/helper";
import i18n from "../i18n";

import { PlayType } from "../constants/DataTypes";
import {
  GET_PLAYERS,
  UPDATE_PLAYER,
  ADD_PLAYER
} from "../constants/apolloQuery";

export default function Player() {
  const [Name, setName] = useState("");
  const [PlayerModalVisible, setPlayerModalVisible] = useState(false);
  const [PlayerSelected, setPlayerSelected] = useState(null);
  const { data, client } = useQuery(GET_PLAYERS);
  const AllPlayers = data.players;
  const [addPlayer] = useMutation(ADD_PLAYER);
  const [updatePlayer] = useMutation(UPDATE_PLAYER);
  const showPlayerDropDown = () =>
    PlayerModalVisible ? (
      <MyPicker
        modalVisible={PlayerModalVisible}
        itemSelected={(index, value) => {
          setPlayerSelected(index);
          setPlayerModalVisible(false);
        }}
        listItems={getPlayerList(AllPlayers)}
      ></MyPicker>
    ) : (
      <View></View>
    );
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View>
          <View style={styles.control}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              value={Name}
              onChangeText={text => setName(text)}
              style={{
                flex: 1,
                marginRight: 5,
                marginTop: 1,
                paddingLeft: 5,
                backgroundColor: "#D1D1D1",
                borderWidth: 1
              }}
            />
            <Button
              buttonStyle={{
                backgroundColor: "#D1D1D1",
                width: 100
              }}
              title="Add"
              onPress={() => {
                if (Name) {
                  addPlayer({ variables: { name: Name } });
                  // updatePlayer({
                  //   variables: {
                  //     id: 1,
                  //     name: "steve",
                  //     preflopRaiseType: PlayType.LL,
                  //     preflopCallType: PlayType.LL,
                  //     raiseType: PlayType.LL,
                  //     callType: PlayType.LL
                  //   }
                  // });
                  setName("");
                }
              }}
            />
          </View>
          <View style={styles.control}>
            <Text style={styles.label}>Player:</Text>
            <MyDropDownButton
              key="player"
              style={{
                width: 150
              }}
              label={
                PlayerSelected != null &&
                AllPlayers[PlayerSelected] &&
                AllPlayers[PlayerSelected].name
              }
              onPress={() => setPlayerSelected(true)}
            />
          </View>
          <View style={styles.control}>
            <Text style={styles.label}>Player:</Text>
            <TextInput
              //            value={Name}
              //            onChangeText={text => setName(text)}
              style={{
                flex: 1,
                marginRight: 5,
                marginTop: 1,
                paddingLeft: 5,
                backgroundColor: "#D1D1D1",
                borderWidth: 1
              }}
            />
          </View>
          <View style={styles.control}>
            <Text style={styles.label}>Preflop Bet:</Text>
            <MyDropDownButton
              key={"pre-b"}
              style={{
                width: 150
              }}
              label={"name"}
              //onPress={() => setSeatModalVisible(true)}
            />
          </View>
          <View style={styles.control}>
            <Text style={styles.label}>PreFlop Call:</Text>
            <MyDropDownButton
              key={"pre-c"}
              style={{
                width: 150
              }}
              label={"name"}
              //onPress={() => setSeatModalVisible(true)}
            />
          </View>
          <View style={styles.control}>
            <Text style={styles.label}>After Flop Bet:</Text>
            <MyDropDownButton
              key={"after-b"}
              style={{
                width: 150
              }}
              label={"name"}
              //onPress={() => setSeatModalVisible(true)}
            />
          </View>
          <View style={styles.control}>
            <Text style={styles.label}>After Flop Calling:</Text>
            <MyDropDownButton
              key={"after-c"}
              style={{
                width: 150
              }}
              label={"name"}
              //onPress={() => setSeatModalVisible(true)}
            />
          </View>
        </View>
        <Text>{AllPlayers.map(p => p.name).join(", ")}</Text>
        <Button
          buttonStyle={{ backgroundColor: "#D1D1D1" }}
          titleStyle={{ color: "#000000" }}
          title={i18n.t("button.done")}
          //onPress={handleFinishSetup}
        />
      </View>
    </ScrollView>
  );
}
