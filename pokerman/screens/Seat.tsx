import React, { useState } from "react";
import { Text, View } from "react-native";
import { ISeat, IPlayer } from "../constants/DataTypes";
import MyButton from "../components/MyButton";
import MyPicker from "../components/MyPicker";
import { getSeatText } from "../constants/helper";
import { Button } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import i18n from "../i18n";
import styles from "./styles";
import { useQuery } from "@apollo/react-hooks";
import { GET_PLAYERS } from "../constants/apolloQuery";

interface IProps {
  navigation: any;
  existingSeats: ISeat[];
  handleSeatsChange: (seats: ISeat[]) => void;
}
export default function Seat(props: IProps) {
  const [DealerSeatIndex, setDealerSeatIndex] = useState(
    props.existingSeats.length - 1
  );
  const [PlayerModalVisible, setPlayerModalVisible] = useState(false);
  const [ModalForSeatNumber, setModalForSeatNumber] = useState(-1);
  const [SeatModalVisible, setSeatModalVisible] = useState(false);
  let players = [] as IPlayer[];
  props.existingSeats.forEach(seat => {
    players[seat.seatNumber] = seat.player;
  });
  const [SeatedPlayers, setSeatedPlayers] = useState(players);

  const handleFinishSeating = () => {
    const seatSelected = SeatedPlayers.map((p, index) => ({
      seatNumber: index,
      player: p,
      betOrder: 0
    }))
      .filter(s => s.player)
      .map((s, index, seats) => ({
        ...s,
        betOrder:
          index > DealerSeatIndex
            ? index - DealerSeatIndex
            : index - DealerSeatIndex + seats.length - 1
      }))
      .sort((s1, s2) => s1.betOrder - s2.betOrder);
    props.handleSeatsChange(seatSelected);
    props.navigation.navigate("play");
  };
  const { error, loading, data, client } = useQuery(GET_PLAYERS);
  if (loading) return <Text>Loading</Text>;
  if (error) return <Text>Error</Text>;
  const AllPlayers = data.players;

  const handlePlayerSelected = (
    index: number,
    value: number,
    seatNumber: number
  ) => {
    let players = SeatedPlayers;
    const player = AllPlayers.find(p => p.id === value);
    players[seatNumber] = player;
    let dealerSeatIndex = DealerSeatIndex;
    const playerCount = players.filter(p => p).length;
    if (playerCount - 1 < dealerSeatIndex) {
      dealerSeatIndex = playerCount - 1;
    }
    setSeatedPlayers(players);
    setPlayerModalVisible(false);
    setModalForSeatNumber(-1);
    setDealerSeatIndex(dealerSeatIndex);
  };

  const setUpSeats = () => {
    const maxSeats = 10;
    let seatList = [];
    for (let i = 0; i < maxSeats; i++) {
      seatList.push(
        <View key={"v" + i} style={styles.control}>
          <Text key={"t" + i} style={styles.label}>
            {getSeatText(i)}
          </Text>
          <MyButton
            key={"b" + i}
            style={{
              width: 150
            }}
            label={SeatedPlayers[i]?.name || ""}
            onPress={() => {
              setPlayerModalVisible(true);
              setModalForSeatNumber(i);
            }}
          />
        </View>
      );
    }
    return seatList;
  };
  const getPlayerList = (seatNumber: number) => {
    const playersList = AllPlayers.filter(
      p => p.id === seatNumber + 1 || p.id > 10
    ).map(p => ({
      text: p.name,
      value: p.id
    }));
    return [
      ...playersList,
      { text: "{Empty}", value: -1 },
      { text: "{Seat Out}", value: -2 }
    ];
  };
  const getSeatList = () =>
    SeatedPlayers.filter(p => p).map((p, index) => ({
      text: p.name,
      value: index
    }));
  const showPlayerDropDown = () =>
    PlayerModalVisible ? (
      <MyPicker
        modalVisible={PlayerModalVisible}
        value={
          (SeatedPlayers[ModalForSeatNumber] &&
            SeatedPlayers[ModalForSeatNumber].id) ||
          ""
        }
        itemSelected={(index, value) =>
          handlePlayerSelected(index, value, ModalForSeatNumber)
        }
        listItems={getPlayerList(ModalForSeatNumber)}
      ></MyPicker>
    ) : (
      <View></View>
    );
  const showSeatDropDown = () =>
    SeatModalVisible ? (
      <MyPicker
        modalVisible={SeatModalVisible}
        value={DealerSeatIndex.toString()}
        itemSelected={(index, value) => {
          setDealerSeatIndex(index);
          setSeatModalVisible(false);
        }}
        listItems={getSeatList()}
      ></MyPicker>
    ) : (
      <View></View>
    );

  const seatedPlayers = SeatedPlayers.filter(p => p != null);
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={{ padding: 10 }}>
          <View>{setUpSeats()}</View>
          <View style={styles.control}>
            <Text key="td" style={styles.label}>
              {i18n.t("seat.dealer") + ":"}
            </Text>
            <MyButton
              key={"dealer"}
              style={{
                width: 150
              }}
              label={
                seatedPlayers.length > 0 &&
                seatedPlayers[DealerSeatIndex] &&
                seatedPlayers[DealerSeatIndex].name
              }
              onPress={() => setSeatModalVisible(true)}
            />
          </View>
          {showPlayerDropDown()}

          {showSeatDropDown()}
        </View>

        <Button
          buttonStyle={{
            backgroundColor: "#D1D1D1"
          }}
          title={i18n.t("button.done")}
          onPress={handleFinishSeating}
        />
      </View>
    </ScrollView>
  );
}
