import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabBarIcon from "../components/TabBarIcon";
import Seat from "../screens/Seat";
import Play2 from "../screens/Play2";
import Timer from "../screens/Timer";
import Player from "../screens/Player";
import i18n from "../i18n";

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "Seat";

export default function BottomTabNavigator({ navigation, route }) {
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name={i18n.t("navigation.seat")}
        component={Seat}
        options={{
          title: i18n.t("navigation.seat"), //"Seat Setup",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-person-add" />
          )
        }}
      />
      <BottomTab.Screen
        name={i18n.t("navigation.player")}
        component={Player}
        options={{
          title: i18n.t("navigation.player"),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-person" />
          )
        }}
      />
      <BottomTab.Screen
        name={i18n.t("navigation.play")}
        component={Play2}
        options={{
          title: i18n.t("navigation.play"),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-headset" />
          )
        }}
      />
      <BottomTab.Screen
        name={i18n.t("navigation.timer")}
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
  return routeName;
}
