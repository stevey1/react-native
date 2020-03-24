import React, { useState } from "react";
import { Text } from "react-native";
import Seat from "../screens/Seat";
import Play from "../screens/Play";
import Game from "../screens/Game";
import Timer from "../screens/Timer";
import Player from "../screens/Player";
import i18n from "../i18n";
import { useQuery } from "@apollo/react-hooks";
import { GET_PLAYERS } from "../constants/apolloQuery";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabBarIcon from "../components/TabBarIcon";
const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "game";
let playKey = 1;

export default function BottomTabNavigator(props) {
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
    defaultSeats.push({ player: players[i], seatNumber: i, betOrder: i });
  }
  const [Seats, setSeats] = useState(defaultSeats);

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
            existingSeats={Seats}
            handleSeatsChange={s => setSeats(s)}
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
            bigBlind={BigBlind}
            straddle={Straddle}
            seats={Seats}
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
