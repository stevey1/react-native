import React, { useState } from "react";
import { Text, View, TextInput } from "react-native";
import { Button } from "react-native-elements";

import styles from "./styles";
import { ScrollView } from "react-native-gesture-handler";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_PLAYERS, ADD_PLAYER } from "../constants/apolloQuery";

export default function Player() {
  const [Name, setName] = useState("");
  const { data } = useQuery(GET_PLAYERS);
  const AllPlayers = data.players;
  const [addPlayer] = useMutation(ADD_PLAYER);
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.control}>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={{ flex: 1 }}
            value={Name}
            onChangeText={text => setName(text)}
          />
          <Button
            buttonStyle={{
              backgroundColor: "#D1D1D1",
              width: 100
            }}
            title="Add"
            onPress={() => {
              if (Name) {
                addPlayer({ variables: { name: Name } });
                setName("");
              }
            }}
          />
          <Text>{AllPlayers.map(p => p.name).join(", ")}</Text>
        </View>
      </View>
    </ScrollView>
  );
}
