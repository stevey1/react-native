import * as React from "react";
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
const handleSeatsChange = seats => {};
export default function BottomTabNavigator({ navigation, route }) {
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });

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
            handleSeatsChange={handleSeatsChange}
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
            {...props}
            bigBlind={2}
            dealerSeatIndex={0}
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

function getHeaderTitle(route) {
  const routeName =
    route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;
  return i18n.t("navigation." + routeName);
}
