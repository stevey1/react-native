import React, { useState } from "react";
import { Text } from "react-native";
import Seat from "../screens/Seat";
import PlayNav from "../screens/PlayNav";
import Game from "../screens/Game";
import Timer from "../screens/Timer";
import Player from "../screens/Player";
import i18n from "../i18n";
import { useQuery } from "@apollo/react-hooks";
import { GET_PLAYERS } from "../constants/apolloQuery";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabBarIcon from "../components/TabBarIcon";
const Tab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "game";

export default function MainNavigator(props) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  const [SmallBlind, setSmallBlind] = useState(1);
  const [BigBlind, setBigBlind] = useState(2);
  const [Straddle, setStraddle] = useState(5);

  props.navigation.setOptions({
    headerTitle: getHeaderTitle(props.route),
    headerStyle: {
      height: 40
    }
    //headerShown: false
  });
  const {
    error,
    loading,
    data: { players },
    client
  } = useQuery(GET_PLAYERS);
  if (loading) return <Text>Loading</Text>;
  if (error) return <Text>Error</Text>;
  let defaultSeats = [];
  for (let i = 0; i < players.length - 1 && i < 6; i++) {
    defaultSeats.push({ player: players[i], id: i, betOrder: i });
  }
  console.log(defaultSeats);
  const [Seats, setSeats] = useState(defaultSeats);

  return (
    <Tab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <Tab.Screen
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
            smallBlind={SmallBlind}
            bigBlind={BigBlind}
            straddle={Straddle}
            handleGameChange={(smallBlind, bigBlind, straddle) => {
              setSmallBlind(smallBlind);
              setBigBlind(bigBlind);
              setStraddle(straddle);
            }}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="seat"
        options={({ route }) => ({
          title: i18n.t("navigation.seat"), //"Seat Setup",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-person-add" />
          )
        })}
      >
        {props => (
          <Seat {...props} seats={Seats} handleSeatsChange={s => setSeats(s)} />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="playNav"
        component={PlayNav}
        options={{
          title: i18n.t("navigation.playNav"),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-headset" />
          )
        }}
      ></Tab.Screen>

      <Tab.Screen
        name="player"
        component={Player}
        options={{
          title: i18n.t("navigation.player"),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-person" />
          )
        }}
      />

      <Tab.Screen
        name="timer"
        component={Timer}
        options={{
          title: i18n.t("navigation.timer"),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-clock" />
          )
        }}
      />
    </Tab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName =
    route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;
  return i18n.t("navigation." + routeName);
}
