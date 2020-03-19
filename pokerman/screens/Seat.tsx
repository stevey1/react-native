import React, { Component, ChangeEvent } from "react";
import { players } from "../constants/helper";
import { ISeat, IPlayer } from "../constants/DataTypes";
import { Text, View } from "react-native";
import MyButton from "../components/MyButton";
import MyPicker from "../components/MyPicker";
import CheckBox from "../components/CheckBox";
export default class Seat extends Component<
  {
    existingSeats: ISeat[];
    handleSeatsChange: (seats: ISeat[]) => void;
  },
  {
    redirectToPlay: boolean;
    playerModalVisible: boolean[];
    playersSelected: IPlayer[];
  }
> {
  state = {
    redirectToPlay: false,
    playerModalVisible: [] as boolean[],
    playersSelected: [] as IPlayer[]
  };
  componentDidMount = () => {
    let existingPlayers: IPlayer[];
    this.props.existingSeats.map((s, i) => (existingPlayers[i] = s.player));
    this.setState({ playersSelected: existingPlayers });
  };
  handleFinishSeating = () => {
    const seatSelected = this.state.playersSelected
      .filter(p => p)
      .map((p, index) => ({ seatNumber: index, player: p }));
    this.props.handleSeatsChange(seatSelected);
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
  setUpSeats = () => {
    const maxSeats = 10;
    let seatList = [];
    for (let i = 0; i < maxSeats; i++) {
      seatList.push(
        <View key={"v" + i} style={{ flexDirection: "row" }}>
          <Text key={"t" + i}>Seat {i + 1}</Text>
          <MyButton
            key={"b" + i}
            style={{
              width: 80
            }}
            label={this.state.playersSelected[i].name}
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
    return [{ text: "empty", value: -1 }, ...playersList];
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
        <View style={{ flex: 1 }}>{this.setUpSeats()}</View>
        <button onClick={this.handleFinishSeating}>Done</button>
      </View>
    );
  }
}
