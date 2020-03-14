import { useLinking } from "@react-navigation/native";
import { Linking } from "expo";
import i18n from "../i18n";

export default function(containerRef) {
  return useLinking(containerRef, {
    prefixes: [Linking.makeUrl("/")],
    config: {
      Root: {
        path: "root",
        screens: {
          Play: "play2",
          Player: "player",
          Seat: "seat",
          Timer: "timer"
        }
      }
    }
  });
}
