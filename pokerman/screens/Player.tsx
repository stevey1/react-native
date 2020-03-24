import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";

import React, { useState } from "react";

export default function Player() {
  return (
    <View>
      <Button
        buttonStyle={{
          backgroundColor: "#D1D1D1",
          width: 100
        }}
        title="show it"
      />
    </View>
  );
}
