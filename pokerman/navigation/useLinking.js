import { useLinking } from "@react-navigation/native";
import { Linking } from "expo";

export default function(containerRef) {
  return useLinking(containerRef, {
    prefixes: [Linking.makeUrl("/")],
    config: {
      Root: {
        path: "",
        screens: {
          playNav: "playNav",
          player: "player",
          seat: "seat",
          game: "game",
          timer: "timer"
        }
      }
    }
  });
}
