import React, { Component } from "react";
import { players } from "../constants/helper";
import { ISeat, IPlayer } from "../constants/DataTypes";
import { Text, View, TextInput } from "react-native";
import MyButton from "../components/MyButton";
import MyPicker from "../components/MyPicker";
import { getSeatText } from "../constants/helper";
import { StackNavigationProp } from "@react-navigation/stack";

export default class Seat extends Component<
  {
    navigation: any;
    existingSeats: ISeat[];
    dealerSeatIndex: number;
    bigBlind: number;
    handleSeatsChange: (
      seats: ISeat[],
      dealerSeatIndex: number,
      bigBlind: number
    ) => void;
  },
  {
    redirectToPlay: boolean;
    playerModalVisible: boolean[];
    playersSelected: IPlayer[];
    dealerSeatIndex: number;
    bigBlind: number;
  }
> {
  state = {
    redirectToPlay: false,
    playerModalVisible: [] as boolean[],
    playersSelected: [] as IPlayer[],
    dealerSeatIndex: this.props.dealerSeatIndex,
    bigBlind: this.props.bigBlind
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
      .filter(p => p)
      .map((p, index) => ({ seatNumber: index, player: p }));
    this.props.handleSeatsChange(
      seatSelected,
      this.state.dealerSeatIndex,
      this.state.bigBlind
    );
    this.props.navigation.navigate("play");
  };

  handlePlayerSelected = (index: number, value: number, seatNumber: number) => {
    let playersSelected = this.state.playersSelected;
    playersSelected[seatNumber] = players.find(p => (p.id = value));
    this.setState({ playersSelected: playersSelected });
  };

  handleButtonPress = (index: number) => {
    let playerModalVisible = this.state.playerModalVisible;
    playerModalVisible[index] = true;
    this.setState({ playerModalVisible: playerModalVisible });
  };
  handleChange = (e, name) => {
    const value = parseInt(e.nativeEvent.text);
    if (name === "bigBlind") this.setState({ bigBlind: value });
    else this.setState({ dealerSeatIndex: value });
  };
  setUpSeats = () => {
    const maxSeats = 10;
    let seatList = [];
    for (let i = 0; i < maxSeats; i++) {
      seatList.push(
        <View key={"v" + i} style={{ flexDirection: "row", height: 30 }}>
          <Text key={"t" + i}> {getSeatText(i + 1)}</Text>
          <MyButton
            key={"b" + i}
            style={{
              width: 80
            }}
            label={
              this.state.playersSelected[i]
                ? this.state.playersSelected[i].name
                : ""
            }
            onPress={() => this.handleButtonPress(i)}
          />
        </View>
        // seat out
      );
    }
    return seatList;
  };
  getPlayerList = (seatNumber: number) => {
    const playersList = players
      .filter(p => p.id === seatNumber + 1 || p.id > seatNumber)
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
  showPlayerDropDown = (seatNumber: number) => {
    return (
      <MyPicker
        modalVisible={this.state.playerModalVisible[seatNumber]}
        value=""
        itemSelected={(index, value) =>
          this.handlePlayerSelected(index, value, seatNumber)
        }
        listItems={this.getPlayerList(seatNumber)}
      ></MyPicker>
    );
  };
  render() {
    return (
      <View>
        <View style={{ flex: 1 }}>
          <View>{this.setUpSeats()}</View>
          <View style={{ flexDirection: "row", height: 30 }}>
            <Text key="td">Dealer:</Text>
            <TextInput
              key="dealer"
              onChange={e => this.handleChange(e, "dealer")}
              value={this.state.dealerSeatIndex.toString()}
              keyboardType={"numeric"}
              maxLength={2}
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
          <View style={{ flexDirection: "row", height: 30 }}>
            <Text key="tb">Big Blind:</Text>
            <TextInput
              key="bigBlind"
              onChange={e => this.handleChange(e, "bigBlind")}
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
        <button onClick={this.handleFinishSeating}>Done</button>
      </View>
    );
  }
}
