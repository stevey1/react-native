import gql from "graphql-tag";

export const GET_PLAYERS = gql`
  query getPlayers {
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
export const UPDATE_PLAYER = gql`
    mutation update(
      $id:Int!
      $name: string!
      $preflopRaiseType: Int!
      $preflopCallType:Int!
      $raiseType:Int!
      $callType:Int!
      $isMe:boolean!) {
      updatePlayer(id:@id
        name:@name
        preflopRaiseType:$preflopRaiseType
        preflopCallType:$preflopCallType
        raiseType:$raiseType
        callType:$callType
        isMe:$isMe) @client
    }
  `;
export const ADD_PLAYER = gql`
    mutation add($name: string!           
      $preflopRaiseType: Int!
      $preflopCallType:Int!
      $raiseType:Int!
      $callType:Int!
      $isMe:boolean!) {
      addPlayer(name:@name
        preflopRaiseType:$preflopRaiseType
        preflopCallType:$preflopCallType
        raiseType:$raiseType
        callType:$callType
        isMe:$isMe) @client
    }
  `;
