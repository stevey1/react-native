/*Example of RealM Database in React Native*/
import React from "react";
//For react-navigation 3.0+
//import { createAppContainer, createStackNavigator } from 'react-navigation';
//For react-navigation 4.0+
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import HomeScreen from "./pages/HomeScreen";
/*import RegisterUser from "./pages/RegisterUser";
import UpdateUser from "./pages/UpdateUser";
import ViewUser from "./pages/ViewUser";
import ViewAllUser from "./pages/ViewAllUser";
import DeleteUser from "./pages/DeleteUser";*/

const App = createStackNavigator({
  HomeScreen: {
    screen: HomeScreen,
    navigationOptions: {
      title: "HomeScreen",
      headerStyle: { backgroundColor: "#3a59b7" },
      headerTintColor: "#ffffff"
    }
  },
  /*View: {
    screen: ViewUser,
    navigationOptions: {
      title: "View User",
      headerStyle: { backgroundColor: "#3a59b7" },
      headerTintColor: "#ffffff"
    }
  },
  ViewAll: {
    screen: ViewAllUser,
    navigationOptions: {
      title: "View All User",
      headerStyle: { backgroundColor: "#3a59b7" },
      headerTintColor: "#ffffff"
    }
  },
  Update: {
    screen: UpdateUser,
    navigationOptions: {
      title: "Update User",
      headerStyle: { backgroundColor: "#3a59b7" },
      headerTintColor: "#ffffff"
    }
  },
  Register: {
    screen: RegisterUser,
    navigationOptions: {
      title: "Register User",
      headerStyle: { backgroundColor: "#3a59b7" },
      headerTintColor: "#ffffff"
    }
  }*/ Delete: {
    screen: HomeScreen,
    navigationOptions: {
      title: "Delete User",
      headerStyle: { backgroundColor: "#3a59b7" },
      headerTintColor: "#ffffff"
    }
  }
});
export default createAppContainer(App);
