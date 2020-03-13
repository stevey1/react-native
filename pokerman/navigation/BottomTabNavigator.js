import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabBarIcon from "../components/TabBarIcon";
import Seat from "../screens/Seat";
import Play from "../screens/Play";
import Timer from "../screens/Timer";
import Player from "../screens/Player";

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "Seat";

export default function BottomTabNavigator({ navigation, route }) {
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="Seat"
        component={Seat}
        options={{
          title: "Seat Setup",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-person-add" />
          )
        }}
      />
      <BottomTab.Screen
        name="Player"
        component={Player}
        options={{
          title: "Player Setup",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-person" />
          )
        }}
      />
      <BottomTab.Screen
        name="Play"
        component={Play}
        options={{
          title: "Play",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-headset" />
          )
        }}
      />
      <BottomTab.Screen
        name="Timer"
        component={Timer}
        options={{
          title: "Timer",
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
  return routeName;
}
