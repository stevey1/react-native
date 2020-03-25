import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Play from "./PlayNav";
import Timer from "./Timer";

const Stack = createStackNavigator();
export default function PlayNav(props) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="play"
        component={Play}
        options={({ route }) => ({
          headerShown: false
        })}
      />
      <Stack.Screen
        name="timer"
        component={Timer}
        options={({ route }) => ({
          headerShown: false
        })}
      />
    </Stack.Navigator>
  );
}
