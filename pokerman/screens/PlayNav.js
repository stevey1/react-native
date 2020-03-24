import React from "react";
import { createStackNavigator, HeaderTitle } from "@react-navigation/stack";
import Play from "./PlayNav";
import Player from "./Player";
import Timer from "./Timer";
import { ISeat } from "../constants/DataTypes";

const Stack = createStackNavigator();
export default function PlayNav(props) {
  console.log(props.navigation);
  props.navigation.setOptions({
    headerStyle: {
      height: 10
    },
    headerShown: false
  });
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="timer"
        component={Timer}
        options={({ route }) => ({
          headerTitle: "tt",
          headerShown: false
        })}
      />
      <Stack.Screen name="settings" component={Player} />
    </Stack.Navigator>
  );
}
