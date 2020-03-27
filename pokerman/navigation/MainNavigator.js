import React, { useState } from "react";
import Seat from "../screens/Seat";
import Game from "../screens/Game";
import Timer from "../screens/Timer";
import Player from "../screens/Player";
import Play from "../screens/Play";
import i18n from "../i18n";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabBarIcon from "../components/TabBarIcon";
const Tab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "game";
let playKey = 1;
export default function MainNavigator(props) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  const [Straddles, setStraddles] = useState(0);
  const [TargetTime, setTargetTime] = useState(0);

  props.navigation.setOptions({
    headerTitle: getHeaderTitle(props.route),
    headerStyle: {
      height: 40
    }
    //headerShown: false
  });

  return (
    <Tab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <Tab.Screen
        name="game"
        component={Game}
        options={({ route }) => ({
          //title: route.params.name,
          title: i18n.t("navigation.game"), //"Seat Setup",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-settings" />
          )
        })}
      />
      <Tab.Screen
        name="seat"
        component={Seat}
        options={({ route }) => ({
          title: i18n.t("navigation.seat"), //"Seat Setup",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-person-add" />
          )
        })}
      />

      <Tab.Screen
        name="playNav"
        options={{
          title: i18n.t("navigation.playNav"),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-headset" />
          )
        }}
      >
        {props => (
          <Play
            {...props}
            key={(++playKey).toString()}
            straddles={Straddles}
            handleStraddlesChange={setStraddles}
          />
        )}
      </Tab.Screen>

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
        options={{
          title: i18n.t("navigation.timer"),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-timer" />
          )
        }}
      >
        {props => (
          <Timer
            {...props}
            targetTime={TargetTime}
            handleSetTargetTime={setTargetTime}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName =
    route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;
  return i18n.t("navigation." + routeName);
}
