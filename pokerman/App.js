import * as React from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import { SplashScreen } from "expo";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainNavigator from "./navigation/MainNavigator";
import useLinking from "./navigation/useLinking";

import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { ApolloProvider } from "@apollo/react-hooks";
import { InMemoryCache } from "apollo-cache-inmemory";
import gql from "graphql-tag";
import { GET_PLAYERS } from "./constants/apolloQuery";
import { AllPlayers } from "./constants/helper";
import { PlayType, GameType } from "./constants/DataTypes";

const Stack = createStackNavigator();
let nextPlayerId = 15;
export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf")
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
  }, []);
  const client = InitializeApollo();
  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <ApolloProvider client={client}>
        <View style={styles.container}>
          {Platform.OS === "ios" && <StatusBar barStyle="default" />}
          <NavigationContainer
            ref={containerRef}
            initialState={initialNavigationState}
          >
            <Stack.Navigator>
              <Stack.Screen name="Root" component={MainNavigator} />
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      </ApolloProvider>
    );
  }
}
const getInitialData = () => {
  const players = AllPlayers.map(player => ({
    __typename: "Player",
    ...player
  }));
  let seats = [];
  for (let i = 0; i < AllPlayers.length - 1 && i < 6; i++) {
    seats.push({
      __typename: "Seat",
      player: players[i],
      id: i,
      betOrder: i
    });
  }
  return {
    seats: seats,
    players: players,
    gameFormat: {
      __typename: "GameFormat",
      id: 1,
      smallBlind: 1,
      bigBlind: 2,
      straddle: 5,
      gameType: GameType.cash
    }
  };
};
function InitializeApollo() {
  const client = new ApolloClient({
    link: new HttpLink(),
    cache: new InMemoryCache(),
    resolvers: {
      Mutation: {
        updateGameFormat: (
          _,
          { id, smallBlind, bigBlind, straddle, gameType },
          { cache }
        ) => {
          const fragmentId = `GameFormat:${id}`;
          const fragment = gql`
            fragment gameFormat on GameFormat {
              id
              smallBlind
              bigBlind
              straddle
              gameType
            }
          `;
          const gameFormat = cache.readFragment({ fragment, id: fragmentId });
          const data = {
            ...gameFormat,
            smallBlind: smallBlind,
            bigBlind: bigBlind,
            straddle: straddle,
            gameType: gameType
          };
          // cache.writeFragment({ fragment, fragmentId, data });
          // you can also do cache.writeData({ data, id }) here if you prefer
          cache.writeData({ data, id: fragmentId });
          return null;
        },
        updatePlayer: (
          _,
          { id, name, preflopRaiseType, preflopCallType, raiseType, callType },
          { cache }
        ) => {
          const fragmentId = `Player:${id}`;
          const fragment = gql`
            fragment player on Player {
              id
              name
              preflopRaiseType
              preflopCallType
              raiseType
              callType
              isMe
            }
          `;
          const player = cache.readFragment({ fragment, id: fragmentId });

          //const todo = cache.readQuery({ query }, { variables: { id: id } });
          const data = {
            ...player,
            name: name,
            preflopRaiseType: preflopRaiseType,
            preflopCallType: preflopCallType,
            raiseType: raiseType,
            callType: callType
          };
          // cache.writeFragment({ fragment, fragmentId, data });
          // you can also do cache.writeData({ data, id }) here if you prefer
          cache.writeData({ data, id: fragmentId });
          return null;
        },

        addPlayer: (_, { name }, { cache }) => {
          const query = GET_PLAYERS;
          const previous = cache.readQuery({ query });
          const newPlayer = {
            id: nextPlayerId++,
            name,
            preflopRaiseType: PlayType.T,
            preflopCallType: PlayType.T,
            raiseType: PlayType.T,
            callType: PlayType.T,
            isMe: false,
            __typename: "Player"
          };
          const data = { players: [...previous.players, newPlayer] };

          // you can also do cache.writeData({ data }) here if you prefer
          //cache.writeQuery({ query, data });
          cache.writeData({ data });
          return newPlayer;
        }
      }
    }
  });
  const data = getInitialData();
  client.writeData({
    data: data
  });
  return client;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
