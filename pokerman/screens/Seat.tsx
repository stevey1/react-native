import React, { useState } from "react";
import { Text, View } from "react-native";
import { IPlayer } from "../constants/DataTypes";
import MyDropDownButton from "../components/MyDropDownButton";
import MyPicker from "../components/MyPicker";
import { getSeatText, getPlayerList } from "../constants/helper";
import { Button } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import i18n from "../i18n";
import styles from "./styles";
import { useQuery } from "@apollo/react-hooks";
import { GET_PLAYERS, GET_SEATS } from "../constants/apolloQuery";

export default function Seat(props) {
  const [PlayerModalVisible, setPlayerModalVisible] = useState(false);
  const [ModalForSeatId, setModalForSeatId] = useState(-1);
  const [SeatModalVisible, setSeatModalVisible] = useState(false);

  const AllPlayers = getAllPlayers();
  const { data, client } = useQuery(GET_SEATS);
  const seats = data.seats;

  const [DealerSeatIndex, setDealerSeatIndex] = useState(seats.length - 1);
  let seating = [] as IPlayer[];
  seats.forEach(seat => {
    seating[seat.id] = seat.player;
  });
  const [Seating, setSeating] = useState(seating);
  const seatedPlayers = Seating.filter(p => p != null);

  function getAllPlayers() {
    const { data } = useQuery(GET_PLAYERS);
    return data.players;
  }

  const handlePlayerSelected = (
    index: number,
    value: number,
    seatId: number
  ) => {
    let seating = [...Seating];
    const player = AllPlayers.find(p => p.id === value);
    seating[seatId] = player;
    let dealerSeatIndex = DealerSeatIndex;
    const playerCount = seating.filter(p => p).length;
    if (playerCount - 1 < dealerSeatIndex) {
      dealerSeatIndex = playerCount - 1;
    }
    setSeating(seating);
    setPlayerModalVisible(false);
    setModalForSeatId(-1);
    setDealerSeatIndex(dealerSeatIndex);
  };

  const showAll10Seats = () => {
    const maxSeats = 10;
    let seatList = [];
    for (let i = 0; i < maxSeats; i++) {
      seatList.push(
        <View key={"v" + i} style={styles.control}>
          <Text key={"t" + i} style={styles.label}>
            {getSeatText(i)}
          </Text>
          <MyDropDownButton
            key={"b" + i}
            style={{
              width: 150
            }}
            label={Seating[i]?.name || ""}
            onPress={() => {
              setPlayerModalVisible(true);
              setModalForSeatId(i);
            }}
          />
        </View>
      );
    }
    return seatList;
  };
  const showPlayerDropDown = () =>
    PlayerModalVisible ? (
      <MyPicker
        modalVisible={PlayerModalVisible}
        value={Seating[ModalForSeatId]?.id || ""}
        itemSelected={(index, value) =>
          handlePlayerSelected(index, value, ModalForSeatId)
        }
        listItems={getFilteredPlayerList(AllPlayers, ModalForSeatId)}
      ></MyPicker>
    ) : (
      <View></View>
    );
  const showSeatDropDown = () =>
    SeatModalVisible ? (
      <MyPicker
        modalVisible={SeatModalVisible}
        value={DealerSeatIndex}
        itemSelected={(index, value) => {
          setDealerSeatIndex(index);
          setSeatModalVisible(false);
        }}
        listItems={getPlayerList(Seating)}
      ></MyPicker>
    ) : (
      <View></View>
    );
  const handleFinishSeating = () => {
    const seatSelected = Seating.map((p, index) => ({
      id: index,
      player: p,
      betOrder: 0
    }))
      .filter(s => s.player)
      .map((s, index, seats) => ({
        ...s,
        betOrder:
          index -
          DealerSeatIndex +
          (index > DealerSeatIndex ? 0 : seats.length - 1),
        __typename: "Seat"
      }))
      .sort((s1, s2) => s1.betOrder - s2.betOrder);
    client.writeData({ data: { seats: seatSelected } });
    props.navigation.navigate("playNav");
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View>
          {showAll10Seats()}
          <View style={styles.control}>
            <Text style={styles.label}>{i18n.t("seat.dealer") + ":"}</Text>
            <MyDropDownButton
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
          titleStyle={{ color: "#000000" }}
          onPress={handleFinishSeating}
        />
      </View>
    </ScrollView>
  );
}
const getFilteredPlayerList = (players: IPlayer[], seatId: number) => {
  const playersList = players
    .filter(p => p.id === seatId + 1 || p.id > 10)
    .map(p => ({
      text: p.name,
      value: p.id
    }));
  return [
    ...playersList,
    { text: "{Empty}", value: -1 },
    { text: "{Seat Out}", value: -2 }
  ];
};
