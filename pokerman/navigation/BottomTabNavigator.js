import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabBarIcon from "../components/TabBarIcon";
import Seat from "../screens/Seat";
import Play from "../screens/Play";
import Game from "../screens/Game";
import Timer from "../screens/Timer";
import Player from "../screens/Player";
import i18n from "../i18n";
import { seats as defaultSeats } from "../constants/helper";

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "player";
let playKey = 1;

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  const [seats, setSeats] = useState(defaultSeats);
  const [smallBlind, setSmallBlind] = useState(1);
  const [bigBlind, setBigBlind] = useState(2);
  const [straddle, setStraddle] = useState(5);
  navigation.setOptions({
    headerTitle: getHeaderTitle(route),
    headerStyle: {
      height: 40
    }
    //headerShown: false
  });
  playKey++;

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="game"
        options={({ route }) => ({
          //title: route.params.name,
          title: i18n.t("navigation.game"), //"Seat Setup",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-person-add" />
          )
        })}
      >
        {props => (
          <Game
            {...props}
            smallBlind={smallBlind}
            bigBlind={bigBlind}
            straddle={straddle}
            handleGameChange={(smallBlind, bigBlind, straddle) => {
              setSmallBlind(smallBlind);
              setBigBlind(bigBlind);
              setStraddle(straddle);
            }}
          />
        )}
      </BottomTab.Screen>
      <BottomTab.Screen
        name="seat"
        options={({ route }) => ({
          title: i18n.t("navigation.seat"), //"Seat Setup",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-person-add" />
          )
        })}
      >
        {props => (
          <Seat
            {...props}
            existingSeats={seats}
            handleSeatsChange={seats => setSeats(seats)}
          />
        )}
      </BottomTab.Screen>

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
            key={playKey.toString()}
            {...props}
            bigBlind={bigBlind}
            seats={seats}
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

function getHeaderTitle(route) {
  const routeName =
    route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;
  return i18n.t("navigation." + routeName);
}
/*
    this.state = {
      seats: defaultSeats,
      smallBlind: 1,
      bigBlind: 2,
      straddle: 5
    };
  }
  playKey = 1;

  render() {
    this.playKey += 1;


*/
