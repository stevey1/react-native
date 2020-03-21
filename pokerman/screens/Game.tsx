import React, { Component } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { Button } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import i18n from "../i18n";
import styles from "./styles";

export default class Game extends Component<
  {
    smallBlind: number;
    bigBlind: number;
    straddle: number;
    navigation: any;
    handleGameChange: (
      smallBlind: number,
      bigBlind: number,
      straddle: number
    ) => void;
  },
  {
    smallBlind: number;
    bigBlind: number;
    straddle: number;
  }
> {
  state = {
    smallBlind: this.props.smallBlind,
    bigBlind: this.props.bigBlind,
    straddle: this.props.straddle
  };
  handleFinishSetup = () => {
    this.props.handleGameChange(
      this.state.smallBlind,
      this.state.bigBlind,
      this.state.straddle
    );
    this.props.navigation.navigate("seat");
  };

  render() {
    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.container}>
          <View style={styles.bigContainer}>
            <View key="s" style={styles.control}>
              <Text key="s" style={styles.label}>
                {i18n.t("game.smallBlind") + ":"}
              </Text>
              <TextInput
                key="s"
                onChange={e =>
                  this.setState({ smallBlind: parseInt(e.nativeEvent.text) })
                }
                value={this.state.smallBlind.toString()}
                keyboardType={"numeric"}
                maxLength={1}
                selectTextOnFocus={true}
                style={{
                  width: 50,
                  marginLeft: 5,
                  paddingLeft: 5,
                  backgroundColor: "#D1D1D1",
                  borderWidth: 1
                }}
              />
            </View>
            <View key="b" style={styles.control}>
              <Text key="b" style={styles.label}>
                {i18n.t("game.bigBlind") + ":"}
              </Text>
              <TextInput
                key="bigBlind"
                onChange={e =>
                  this.setState({ bigBlind: parseInt(e.nativeEvent.text) })
                }
                value={this.state.bigBlind.toString()}
                keyboardType={"numeric"}
                maxLength={1}
                selectTextOnFocus={true}
                style={{
                  width: 50,
                  marginLeft: 5,
                  paddingLeft: 5,
                  backgroundColor: "#D1D1D1",
                  borderWidth: 1
                }}
              />
            </View>
            <View key="st" style={styles.control}>
              <Text key="st" style={styles.label}>
                {i18n.t("game.straddle") + ":"}
              </Text>
              <TextInput
                key="st"
                onChange={e =>
                  this.setState({ straddle: parseInt(e.nativeEvent.text) })
                }
                value={this.state.straddle.toString()}
                keyboardType={"numeric"}
                maxLength={1}
                selectTextOnFocus={true}
                style={{
                  width: 50,
                  marginLeft: 5,
                  paddingLeft: 5,
                  backgroundColor: "#D1D1D1",
                  borderWidth: 1
                }}
              />
            </View>
          </View>
          <View style={styles.footerContainer}>
            <Button
              buttonStyle={{ backgroundColor: "#D1D1D1" }}
              title="Done"
              onPress={this.handleFinishSetup}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}
