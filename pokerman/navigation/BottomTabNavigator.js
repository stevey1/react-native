import React, { Component } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabBarIcon from "../components/TabBarIcon";
import Seat from "../screens/Seat";
import Play from "../screens/Play";
import Game from "../screens/Game";
import Timer from "../screens/Timer";
import Player from "../screens/Player";
import i18n from "../i18n";
import { seats as defaultSeats } from "../constants/helper";
import { ISeat } from "../constants/DataTypes";

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "game";

export default class BottomTabNavigator extends Component {
  constructor(props) {
    super(props);
    const { navigation, route } = props;
    navigation.setOptions({ headerTitle: this.getHeaderTitle(route) });
    this.state = {
      seats: defaultSeats,
      smallBlind: 1,
      bigBlind: 2,
      straddle: 5
    };
  }
  playKey = 1;
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
          name="game"
          options={{
            title: i18n.t("navigation.game"), //"Seat Setup",
            tabBarIcon: ({ focused }) => (
              <TabBarIcon focused={focused} name="md-person-add" />
            )
          }}
        >
          {props => (
            <Game
              {...props}
              smallBlind={this.state.smallBlind}
              bigBlind={this.state.bigBlind}
              straddle={this.state.straddle}
              handleGameChange={(smallBlind, bigBlind, straddle) =>
                this.setState({
                  smallBlind: smallBlind,
                  bigBlind: bigBlind,
                  straddle: straddle
                })
              }
            />
          )}
        </BottomTab.Screen>
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
              existingSeats={this.state.seats}
              handleSeatsChange={s =>
                this.setState({
                  seats: s
                })
              }
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
              seats={this.state.seats}
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
