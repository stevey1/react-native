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
  seats: ISeat[];
  handleSeatsChange: (seats: ISeat[]) => void;
}
export default function Seat(props: IProps) {
  const [DealerSeatIndex, setDealerSeatIndex] = useState(
    props.seats.length - 1
  );
  const [PlayerModalVisible, setPlayerModalVisible] = useState(false);
  const [ModalForSeatId, setModalForSeatId] = useState(-1);
  const [SeatModalVisible, setSeatModalVisible] = useState(false);
  let seats = [] as IPlayer[];
  props.seats.forEach(seat => {
    seats[seat.id] = seat.player;
  });
  const [Seats, setSeats] = useState(seats);

  const { error, loading, data, client } = useQuery(GET_PLAYERS);
  if (loading) return <Text>Loading</Text>;
  if (error) return <Text>Error</Text>;
  const AllPlayers = data.players;
  const occupiedSeats = Seats.filter(p => p != null);

  const handlePlayerSelected = (
    index: number,
    value: number,
    seatId: number
  ) => {
    let seats = Seats;
    const player = AllPlayers.find(p => p.id === value);
    seats[seatId] = player;
    let dealerSeatIndex = DealerSeatIndex;
    const playerCount = seats.filter(p => p).length;
    if (playerCount - 1 < dealerSeatIndex) {
      dealerSeatIndex = playerCount - 1;
    }
    setSeats(seats);
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
          <MyButton
            key={"b" + i}
            style={{
              width: 150
            }}
            label={Seats[i]?.name || ""}
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
        value={Seats[ModalForSeatId]?.id || ""}
        itemSelected={(index, value) =>
          handlePlayerSelected(index, value, ModalForSeatId)
        }
        listItems={getPlayerList(AllPlayers, ModalForSeatId)}
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
        listItems={getSeatedPlayerList(Seats)}
      ></MyPicker>
    ) : (
      <View></View>
    );
  const handleFinishSeating = () => {
    const seatSelected = Seats.map((p, index) => ({
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
          (index > DealerSeatIndex ? 0 : seats.length - 1)
      }))
      .sort((s1, s2) => s1.betOrder - s2.betOrder);
    props.handleSeatsChange(seatSelected);
    props.navigation.navigate("play");
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={{ padding: 10 }}>
          <View>{showAll10Seats()}</View>
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
                occupiedSeats.length > 0 &&
                occupiedSeats[DealerSeatIndex] &&
                occupiedSeats[DealerSeatIndex].name
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
const getPlayerList = (players: IPlayer[], seatId: number) => {
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
const getSeatedPlayerList = (players: IPlayer[]) =>
  players
    .filter(p => p)
    .map((p, index) => ({
      text: p.name,
      value: index
    }));
