import React, { Component } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { AllPlayers } from "../constants/helper";
import { ISeat, IPlayer } from "../constants/DataTypes";
import MyButton from "../components/MyButton";
import MyPicker from "../components/MyPicker";
import { getSeatText } from "../constants/helper";
import { Button } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";

export default class Seat extends Component<
  {
    navigation: any;
    existingSeats: ISeat[];
    bigBlind: number;
    handleSeatsChange: (seats: ISeat[], bigBlind: number) => void;
  },
  {
    seatedPlayers: IPlayer[];
    dealerSeatIndex: number;
    bigBlind: number;

    playerModalVisible: boolean;
    modalForSeatNumber: number;
    seatModalVisible: boolean;

    redirectToPlay: boolean;
  }
> {
  state = {
    seatedPlayers: [] as IPlayer[],
    dealerSeatIndex: 0,
    bigBlind: this.props.bigBlind,

    playerModalVisible: false,
    modalForSeatNumber: -1,
    seatModalVisible: false,

    redirectToPlay: false
  };
  componentDidMount = () => {
    let players = [] as IPlayer[];
    this.props.existingSeats.forEach(seat => {
      players[seat.seatNumber] = seat.player;
    });
    this.setState({
      seatedPlayers: players,
      dealerSeatIndex: this.props.existingSeats.length - 1
    });
  };
  handleFinishSeating = () => {
    const seatSelected = this.state.seatedPlayers
      .map((p, index) => ({
        seatNumber: index,
        player: p,
        betOrder:
          index <= this.state.dealerSeatIndex
            ? index + this.state.seatedPlayers.length
            : index
      }))
      .filter(s => s.player)
      .sort((s1, s2) => s1.betOrder - s2.betOrder);
    this.props.handleSeatsChange(seatSelected, this.state.bigBlind);
    this.props.navigation.navigate("play");
  };

  handlePlayerSelected = (index: number, value: number, seatNumber: number) => {
    let seatedPlayers = this.state.seatedPlayers;
    const player = AllPlayers.find(p => p.id === value);
    seatedPlayers[seatNumber] = player;
    let dealerSeatIndex = this.state.dealerSeatIndex;
    const playerCount = seatedPlayers.filter(p => p).length;
    if (playerCount - 1 < dealerSeatIndex) {
      dealerSeatIndex = playerCount - 1;
    }

    this.setState({
      seatedPlayers: seatedPlayers,
      playerModalVisible: false,
      modalForSeatNumber: -1,
      dealerSeatIndex
    });
  };

  setUpSeats = () => {
    const maxSeats = 10;
    let seatList = [];
    for (let i = 0; i < maxSeats; i++) {
      seatList.push(
        <View key={"v" + i} style={styles.control}>
          <Text key={"t" + i} style={styles.label}>
            {getSeatText(i) + ":"}
          </Text>
          <MyButton
            key={"b" + i}
            style={{
              width: 150
            }}
            label={this.state.seatedPlayers[i]?.name || ""}
            onPress={() =>
              this.setState({ playerModalVisible: true, modalForSeatNumber: i })
            }
          />
        </View>
      );
    }
    return seatList;
  };
  getPlayerList = (seatNumber: number) => {
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
  showPlayerDropDown = () =>
    this.state.playerModalVisible ? (
      <MyPicker
        modalVisible={this.state.playerModalVisible}
        value={this.state.seatedPlayers[this.state.modalForSeatNumber].id}
        itemSelected={(index, value) =>
          this.handlePlayerSelected(index, value, this.state.modalForSeatNumber)
        }
        listItems={this.getPlayerList(this.state.modalForSeatNumber)}
      ></MyPicker>
    ) : (
      <View></View>
    );
  getSeatList = () =>
    this.state.seatedPlayers
      .filter(p => p)
      .map((p, index) => ({
        text: p.name,
        value: index
      }));
  showSeatDropDown = () =>
    this.state.seatModalVisible ? (
      <MyPicker
        modalVisible={this.state.seatModalVisible}
        value={this.state.dealerSeatIndex.toString()}
        itemSelected={(index, value) => {
          this.setState({ dealerSeatIndex: index, seatModalVisible: false });
        }}
        listItems={this.getSeatList()}
      ></MyPicker>
    ) : (
      <View></View>
    );

  render() {
    const seatedPlayers = this.state.seatedPlayers.filter(p => p != null);
    return (
      <ScrollView>
        <View style={{ flex: 1 }}>
          <View>{this.setUpSeats()}</View>
          <View style={styles.control}>
            <Text key="td" style={styles.label}>
              Dealer:
            </Text>
            <MyButton
              key={"dealer"}
              style={{
                width: 150
              }}
              label={
                seatedPlayers.length > 0 &&
                seatedPlayers[this.state.dealerSeatIndex] &&
                seatedPlayers[this.state.dealerSeatIndex].name
              }
              onPress={() => this.setState({ seatModalVisible: true })}
            />
          </View>
          <View style={styles.control}>
            <Text key="tb" style={styles.label}>
              Big Blind:
            </Text>
            <TextInput
              key="bigBlind"
              onChange={e =>
                this.setState({ bigBlind: parseInt(e.nativeEvent.text) })
              }
              value={this.state.bigBlind.toString()}
              keyboardType={"numeric"}
              maxLength={1}
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
          buttonStyle={{
            backgroundColor: "#D1D1D1"
          }}
          title="Done"
          onPress={this.handleFinishSeating}
        />
        {this.showPlayerDropDown()}

        {this.showSeatDropDown()}
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  label: {
    paddingRight: 7,
    textAlign: "right",
    width: 85
  },
  control: { flex: 1, flexDirection: "row", margin: 1, height: 40 }
});
