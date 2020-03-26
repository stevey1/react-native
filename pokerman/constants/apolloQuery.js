import gql from "graphql-tag";
export const GET_SEATS = gql`
  query getSeats {
    seats @client {
      id
      betOrder
      player {
        id
        name
        preflopRaiseType
        preflopCallType
        raiseType
        callType
        isMe
      }
    }
  }
`;
export const GET_GAME_FORMAT = gql`
  query getGameFormat {
    gameFormat @client {
      smallBlind
      bigBlind
      straddle
      gameType
    }
  }
`;
export const GET_PLAYERS = gql`
  query players {
    players @client {
      id
      name
      preflopRaiseType
      preflopCallType
      raiseType
      callType
      isMe
    }
  }
`;
export const GET_PLAYER = gql`
  query player {
    player(id: $id) @client {
      id
      name
      preflopRaiseType
      preflopCallType
      raiseType
      callType
      isMe
    }
  }
`;
export const UPDATE_PLAYER = gql`
  mutation update(
    $id: Int!
    $name: string!
    $preflopRaiseType: Int!
    $preflopCallType: Int!
    $raiseType: Int!
    $callType: Int!
  ) {
    updatePlayer(
      id: $id
      name: $name
      preflopRaiseType: $preflopRaiseType
      preflopCallType: $preflopCallType
      raiseType: $raiseType
      callType: $callType
    ) @client
  }
`;
export const ADD_PLAYER = gql`
  mutation add($name: string!) {
    addPlayer(name: $name) @client
  }
`;
