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
        itemSelected={(index, value) => {
          setPlayer(AllPlayers[index]);
          setPlayerModalVisible(false);
        }}
        listItems={getPlayerList(AllPlayers)}
      ></MyPicker>
    ) : (
      <View></View>
    );
  const showPlayTypeDropDown = () =>
    PlayTypeModalVisible ? (
      <MyPicker
        modalVisible={PlayTypeModalVisible}
        itemSelected={(index, value) => {
          const player = { ...Player };
          switch (CurrentPlayTypeModal) {
            case 1:
              player.preflopRaiseType = index;
              break;
            case 2:
              player.preflopCallType = index;
              break;
            case 3:
              player.RaiseType = index;
              break;
            default:
              player.callType = index;
              break;
          }
          setPlayer(player);
          setPlayTypeModalVisible(false);
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
              label={Player?.name}
              onPress={() => setPlayerModalVisible(true)}
            />
          </View>
          <View style={styles.control}>
            <Text style={styles.label}>Player Name:</Text>
            <TextInput
              value={Player?.name}
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
            <Text style={styles.label}>Preflop Bet:</Text>
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
            <Text style={styles.label}>PreFlop Call:</Text>
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
            <Text style={styles.label}>After Flop Bet:</Text>
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
            <Text style={styles.label}>After Flop Calling:</Text>
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
          //onPress={handleFinishSetup}
        />
      </View>
    </ScrollView>
  );
}
