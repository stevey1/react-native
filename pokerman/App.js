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
import { GET_PLAYER, GET_PLAYERS, GET_SEATS } from "./constants/apolloQuery";
import { AllPlayers } from "./constants/helper";

const Stack = createStackNavigator();
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
  let nextTodoId = 1;

  //const [addPlayer] = useMutation(ADD_PLAYER); // useMutation(ADD_TODO, { variables: { text: "asdfas" } });
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
  for (let i = 0; i < AllPlayers.length - 1 && i < 4; i++) {
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
      smallBlind: 1,
      bigBlind: 2,
      straddle: 5
    }
  };
};
function InitializeApollo() {
  const cache = new InMemoryCache();
  const client = new ApolloClient({
    link: new HttpLink(),
    cache: cache,
    resolvers: {
      Mutation: {
        updatePlayer: (
          _,
          {
            id,
            name,
            preflopRaiseType,
            preflopCallType,
            raiseType,
            callType,
            isMe
          },
          { cache }
        ) => {
          /*
          const fragment = gql`
            fragment f on Player {
              completed
            }
          `;
          const player = cache.readFragment({ fragment, id: `Player:${id}` });*/
          const player = cache.readQuery(
            { GET_PLAYER },
            { variables: { id: id } }
          );
          const data = {
            ...player,
            name: name,
            preflopRaiseType: preflopRaiseType,
            preflopCallType: preflopCallType,
            raiseType: raiseType,
            callType: callType,
            isMe: isMe
          };

          //cache.writeFragment({ fragment, id, data });
          // you can also do cache.writeData({ data, id }) here if you prefer
          cache.writeData({ data, id: id });
          return null;
        },

        addPlayer: (
          _,
          {
            name,
            preflopRaiseType,
            preflopCallType,
            raiseType,
            callType,
            isMe
          },
          { cache }
        ) => {
          const previous = cache.readQuery({ GET_PLAYERS });
          const newPlayer = {
            id: nextPlayer++,
            name,
            preflopRaiseType,
            preflopCallType,
            raiseType,
            callType,
            isMe,
            __typename: "Player"
          };
          const data = {
            players: [...previous.players, newPlayer]
          };

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
