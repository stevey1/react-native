import React, { useState, useEffect } from "react";
import { Text, TextInput, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Overlay } from "react-native-elements";
import styles from "./styles";
import i18n from "../i18n";
interface IProps {
  targetTime: number;
  handleSetTargetTime: (targetTime: number) => void;
}
export default function Timer(props: IProps) {
  const [ShowTip, setShowTip] = useState(false);
  const [SessionTime, setSessionTime] = useState(0);
  const [TargetTime, setTargetTime] = useState(props.targetTime);
  const [TimeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    setInterval(() => {
      if (TimeLeft > 0 || TargetTime > 0)
        setTimeLeft(Math.round(TargetTime - new Date().getTime() / 1000));
    }, 1000);
  });

  const tipOverlay = () =>
    ShowTip ? (
      <Overlay
        overlayBackgroundColor="#F5F5F5"
        width="90%"
        height="70%"
        isVisible={ShowTip}
      >
        <View style={{ flexGrow: 1, justifyContent: "space-between" }}>
          <View>
            <Text>Control Session Time</Text>
            <Text>Energy level</Text>

            <Text>Safe Play</Text>
            <Text>A*; K*(any ghost card); 手中对</Text>
            <Text>
              Assume 3 aces on play: 1 on board, 1 In my hand; 1 in another
              players hand
            </Text>
            <Text>Hand blocker - 用bet和手牌排除</Text>
            <Text>Set bet/Straight Bet</Text>

            <Text>
              Preflop Re-raise, raise big - not many people will not call.
            </Text>
          </View>
          <Button
            buttonStyle={{
              backgroundColor: "#D1D1D1"
            }}
            title={i18n.t("button.done")}
            titleStyle={{ color: "#000000" }}
            onPress={() => setShowTip(false)}
          />
        </View>
      </Overlay>
    ) : (
      <View></View>
    );
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={[styles.container, { justifyContent: "space-between" }]}>
        <View style={styles.control}>
          <Text onPress={() => setShowTip(true)}>{i18n.t("timer.tip")}</Text>
        </View>
        <View>
          <View style={styles.control}>
            <Text style={styles.label_player}>
              {i18n.t("timer.sessionTime")}
            </Text>
            <TextInput
              key="tis"
              onChange={e => {
                const value = e.nativeEvent.text
                  ? parseInt(e.nativeEvent.text)
                  : null;
                if (value) setSessionTime(value);
              }}
              keyboardType={"numeric"}
              maxLength={1}
              selectTextOnFocus={true}
              style={{
                width: 70,
                paddingLeft: 5,
                backgroundColor: "#D1D1D1",
                borderWidth: 1
              }}
            />
          </View>
          <View>
            <Text key="timer" style={{ textAlign: "center" }}>
              {Math.round(TimeLeft / 3600)}:
              {(Math.round(TimeLeft / 60) % 60).toString().padStart(2, "0")}:
              {(TimeLeft % 60).toString().padStart(2, "0")}
            </Text>
          </View>
        </View>
        {tipOverlay()}
        <Button
          buttonStyle={{
            backgroundColor: "#D1D1D1"
          }}
          title={i18n.t("button.startTimer")}
          titleStyle={{ color: "#000000" }}
          onPress={() => {
            if (SessionTime > 0) {
              const now = new Date();
              const targetTime = Math.round(
                now.setHours(now.getHours() + SessionTime) / 1000
              );
              setTargetTime(targetTime);
              props.handleSetTargetTime(targetTime);
            }
          }}
        />
      </View>
    </ScrollView>
  );
}
