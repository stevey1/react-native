import React, { useState } from "react";
import { Text, View, TextInput } from "react-native";
import { Button, Divider } from "react-native-elements";
import MyPicker from "../components/MyPicker";
import MyDropDownButton from "../components/MyDropDownButton";
import styles from "./styles";
import { ScrollView } from "react-native-gesture-handler";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { getPlayerList } from "../constants/helper";
import i18n from "../i18n";

import { PlayType } from "../constants/DataTypes";
import { GET_SEATS, UPDATE_PLAYER, ADD_PLAYER } from "../constants/apolloQuery";

export default function Player() {
  const [Name, setName] = useState("");
  const [PlayerModalVisible, setPlayerModalVisible] = useState(false);
  const [PlayTypeModalVisible, setPlayTypeModalVisible] = useState(false);
  const [CurrentPlayTypeModal, setCurrentPlayTypeModal] = useState(0);
  const [Player, setPlayer] = useState(null);
  const { data } = useQuery(GET_SEATS);
  const AllPlayers = data.seats.map(seat => seat.player);
  const [addPlayer] = useMutation(ADD_PLAYER);
  const [updatePlayer] = useMutation(UPDATE_PLAYER);
  const showPlayerDropDown = () =>
    PlayerModalVisible ? (
      <MyPicker
        modalVisible={PlayerModalVisible}
        itemSelected={index => {
          setPlayer(AllPlayers[index]);
          setPlayerModalVisible(false);
        }}
        listItems={getPlayerList(AllPlayers)}
      ></MyPicker>
    ) : (
      <View></View>
    );
  const getPlayerPlayType = () => {
    switch (CurrentPlayTypeModal) {
      case 1:
        return Player.preflopRaiseType;
      case 2:
        return Player.preflopCallType;
      case 3:
        return Player.raiseType;
      default:
        return Player.callType;
    }
  };

  const setPlayerPlayType = index => {
    const player = { ...Player };
    switch (CurrentPlayTypeModal) {
      case 1:
        player.preflopRaiseType = index;
        break;
      case 2:
        player.preflopCallType = index;
        break;
      case 3:
        player.raiseType = index;
        break;
      default:
        player.callType = index;
        break;
    }
    setPlayer(player);
  };
  const showPlayTypeDropDown = () =>
    PlayTypeModalVisible ? (
      <MyPicker
        modalVisible={PlayTypeModalVisible}
        value={getPlayerPlayType()}
        itemSelected={index => {
          setPlayerPlayType(index);
          setPlayTypeModalVisible(false);
        }}
        listItems={getPlayTypeList()}
      ></MyPicker>
    ) : (
      <View></View>
    );
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View>
          <View style={styles.control}>
            <Text style={styles.label_player}>Name:</Text>
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
                  setName("");
                }
              }}
            />
          </View>
          <text>
            <Divider style={{ backgroundColor: "white", marginTop: 15 }} />;
          </text>
          <View style={styles.control}>
            <Text style={styles.label_player}>Player:</Text>
            <MyDropDownButton
              key="player"
              style={{
                width: 150
              }}
              label={Player?.name}
              onPress={() => setPlayerModalVisible(true)}
            />
          </View>
          <View style={styles.control}>
            <Text style={styles.label_player}>Player Name:</Text>
            <TextInput
              value={(Player && Player.name) || ""}
              onChangeText={text => {
                const player = { ...Player };
                player.name = text;
                setPlayer(player);
              }}
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
            <Text style={styles.label_player}>Preflop Bet:</Text>
            <MyDropDownButton
              key={"pre-b"}
              style={{
                width: 150
              }}
              label={(Player && PlayType[Player.preflopRaiseType]) || ""}
              onPress={() => {
                setPlayTypeModalVisible(true);
                setCurrentPlayTypeModal(1);
              }}
            />
          </View>
          <View style={styles.control}>
            <Text style={styles.label_player}>PreFlop Call:</Text>
            <MyDropDownButton
              key={"pre-c"}
              style={{
                width: 150
              }}
              label={(Player && PlayType[Player.preflopCallType]) || ""}
              onPress={() => {
                setPlayTypeModalVisible(true);
                setCurrentPlayTypeModal(2);
              }}
            />
          </View>
          <View style={styles.control}>
            <Text style={styles.label_player}>After Flop Bet:</Text>
            <MyDropDownButton
              key={"after-b"}
              style={{
                width: 150
              }}
              label={(Player && PlayType[Player.raiseType]) || ""}
              onPress={() => {
                setPlayTypeModalVisible(true);
                setCurrentPlayTypeModal(3);
              }}
            />
          </View>
          <View style={styles.control}>
            <Text style={styles.label_player}>After Flop Calling:</Text>
            <MyDropDownButton
              key={"after-c"}
              style={{
                width: 150
              }}
              label={(Player && PlayType[Player.callType]) || ""}
              onPress={() => {
                setPlayTypeModalVisible(true);
                setCurrentPlayTypeModal(4);
              }}
            />
          </View>
        </View>
        {showPlayerDropDown()}
        {showPlayTypeDropDown()}

        <Button
          buttonStyle={{ backgroundColor: "#D1D1D1" }}
          titleStyle={{ color: "#000000" }}
          title={i18n.t("button.done")}
          onPress={() => {
            if (Player) {
              updatePlayer({
                variables: {
                  id: Player.id,
                  name: Player.name,
                  preflopRaiseType: Player.preflopRaiseType,
                  preflopCallType: Player.preflopCallType,
                  raiseType: Player.raiseType,
                  callType: Player.callType
                }
              });
              setPlayer(null);
            }
          }}
        />
      </View>
    </ScrollView>
  );
}
const getPlayTypeList = () => {
  let list = [];
  for (let item in PlayType) {
    let value = Number(item);
    if (!isNaN(value)) {
      list.push({ text: PlayType[value], value: value });
    }
  }
  return list;
};
