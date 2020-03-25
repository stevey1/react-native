import React from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import styles from "./styles";

export default function Timer() {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View>
          <Text>螳螂扑蝉，黄雀在后</Text>
          <Text>A*, K*(Ghost)或手中对</Text>
          <Text>用bet和手牌排除</Text>
          <Text>
            Preflop reraise, not many people not call you. if raise, then raise
            big
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
