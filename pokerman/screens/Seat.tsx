import React, { Component } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { players } from "../constants/helper";
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
    redirectToPlay: boolean;
    modalForSeatNumber: number;
    playerModalVisible: boolean;
    playersSelected: IPlayer[];
    dealerSeatIndex: number;
    bigBlind: number;
    seatModalVisible: boolean;
  }
> {
  state = {
    redirectToPlay: false,
    modalForSeatNumber: -1,
    playerModalVisible: false,
    playersSelected: [] as IPlayer[],
    dealerSeatIndex: this.props.existingSeats[
      this.props.existingSeats.length - 1
    ].betOrder,
    bigBlind: this.props.bigBlind,
    seatModalVisible: false
  };
  componentDidMount = () => {
    let existingPlayers = [] as IPlayer[];
    this.props.existingSeats.forEach(seat => {
      existingPlayers.push(seat.player);
    });
    this.setState({ playersSelected: existingPlayers });
  };
  handleFinishSeating = () => {
    const seatSelected = this.state.playersSelected
      .map((p, index) => ({
        seatNumber: index,
        player: p,
        betOrder:
          index <= this.state.dealerSeatIndex
            ? index + this.state.playersSelected.length
            : index,
        isMe: p && p.isMe
      }))
      .filter(s => s.player)
      .sort((s1, s2) => s1.betOrder - s2.betOrder);
    this.props.handleSeatsChange(seatSelected, this.state.bigBlind);
    this.props.navigation.navigate("play");
  };

  handlePlayerSelected = (index: number, value: number, seatNumber: number) => {
    let playersSelected = this.state.playersSelected;
    const player = players.find(p => p.id === value);
    playersSelected[seatNumber] = player;
    this.setState({
      playersSelected: playersSelected,
      playerModalVisible: false,
      modalForSeatNumber: -1
    });
  };

  setUpSeats = () => {
    const maxSeats = 10;
    let seatList = [];
    for (let i = 0; i < maxSeats; i++) {
      seatList.push(
        <View key={"v" + i} style={styles.control}>
          <Text key={"t" + i} style={styles.label}>
            {" "}
            {getSeatText(i) + ":"}
          </Text>
          <MyButton
            key={"b" + i}
            style={{
              width: 150
            }}
            label={
              this.state.playersSelected[i]
                ? this.state.playersSelected[i].name
                : ""
            }
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
    const playersList = players
      .filter(p => p.id === seatNumber + 1 || p.id > 10)
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
  showPlayerDropDown = () =>
    this.state.playerModalVisible ? (
      <MyPicker
        modalVisible={this.state.playerModalVisible}
        value={this.state.playersSelected[this.state.modalForSeatNumber].id}
        itemSelected={(index, value) =>
          this.handlePlayerSelected(index, value, this.state.modalForSeatNumber)
        }
        listItems={this.getPlayerList(this.state.modalForSeatNumber)}
      ></MyPicker>
    ) : (
      <View></View>
    );
  getSeatList = () =>
    this.state.playersSelected
      .filter(p => p)
      .map((p, index) => ({
        text: getSeatText(index),
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
              label={getSeatText(this.state.dealerSeatIndex)}
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
