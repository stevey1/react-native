import { useLinking } from "@react-navigation/native";
import { Linking } from "expo";

export default function(containerRef) {
  return useLinking(containerRef, {
    prefixes: [Linking.makeUrl("/")],
    config: {
      Root: {
        path: "",
        screens: {
          play: "play",
          player: "player",
          seat: "seat",
          game: "game",
          timer: "timer"
        }
      }
    }
  });
}
