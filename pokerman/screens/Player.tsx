import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";

import React, { useState } from "react";
import styles from "./styles";
import { ScrollView } from "react-native-gesture-handler";

export default function Player() {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View>
          <Button
            buttonStyle={{
              backgroundColor: "#D1D1D1",
              width: 100
            }}
            title="show it"
          />
        </View>
      </View>
    </ScrollView>
  );
}
