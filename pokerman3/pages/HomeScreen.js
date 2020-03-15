/*Home Screen With buttons to navigate to diffrent options*/
import React from "react";
import { View } from "react-native";
import MyButton from "./components/MyButton";
import MyText from "./components/MyText";

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          flexDirection: "column"
        }}
      >
        <MyText text="RealM Example" />
        <MyButton
          title="Register"
          customClick={() => this.props.navigation.navigate("Register")}
        />
        <MyButton
          title="Update"
          customClick={() => this.props.navigation.navigate("Update")}
        />
        <MyButton
          title="View"
          customClick={() => this.props.navigation.navigate("View")}
        />
        <MyButton
          title="View All"
          customClick={() => this.props.navigation.navigate("ViewAll")}
        />
        <MyButton
          title="Delete"
          customClick={() => this.props.navigation.navigate("Delete")}
        />
      </View>
    );
  }
}
