import React, { Component } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabBarIcon from "../components/TabBarIcon";
import Seat from "../screens/Seat";
import Play from "../screens/Play";
import Timer from "../screens/Timer";
import Player from "../screens/Player";
import i18n from "../i18n";
import { seats as defaultSeats } from "../constants/helper";
import { ISeat } from "../constants/DataTypes";

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "seat";

export default class BottomTabNavigator extends Component {
  constructor(props) {
    super(props);
    const { navigation, route } = props;
    navigation.setOptions({ headerTitle: this.getHeaderTitle(route) });
    this.state = { seats: defaultSeats, dealerSeatIndex: 0, bigBlind: 2 };
  }
  playKey = 1;
  handleSeatsSetup = (seats, dealerSeatIndex, bigBlind) => {
    this.setState({
      seats: seats,
      dealerSeatIndex: dealerSeatIndex,
      bigBlind: bigBlind
    });
  };
  getHeaderTitle = route => {
    const routeName =
      route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;
    return i18n.t("navigation." + routeName);
  };

  render() {
    this.playKey += 1;
    return (
      <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
        <BottomTab.Screen
          name="seat"
          options={{
            title: i18n.t("navigation.seat"), //"Seat Setup",
            tabBarIcon: ({ focused }) => (
              <TabBarIcon focused={focused} name="md-person-add" />
            )
          }}
        >
          {props => (
            <Seat
              {...props}
              existingSeats={defaultSeats}
              handleSeatsChange={this.handleSeatsSetup}
              bigBlind={this.state.bigBlind}
              dealerSeatIndex={this.state.dealerSeatIndex}
            />
          )}
        </BottomTab.Screen>
        <BottomTab.Screen
          name="player"
          component={Player}
          options={{
            title: i18n.t("navigation.player"),
            tabBarIcon: ({ focused }) => (
              <TabBarIcon focused={focused} name="md-person" />
            )
          }}
        />
        <BottomTab.Screen
          name="play"
          options={{
            title: i18n.t("navigation.play"),
            tabBarIcon: ({ focused }) => (
              <TabBarIcon focused={focused} name="md-headset" />
            )
          }}
        >
          {props => (
            <Play
              key={this.playKey.toString()}
              {...props}
              bigBlind={this.state.bigBlind}
              dealerSeatIndex={this.state.dealerSeatIndex}
              seats={defaultSeats}
            />
          )}
        </BottomTab.Screen>

        <BottomTab.Screen
          name="timer"
          component={Timer}
          options={{
            title: i18n.t("navigation.timer"),
            tabBarIcon: ({ focused }) => (
              <TabBarIcon focused={focused} name="md-clock" />
            )
          }}
        />
      </BottomTab.Navigator>
    );
  }
}
