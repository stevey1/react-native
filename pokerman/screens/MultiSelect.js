import React, { Component } from "react";
import {
  CheckBox,
  StyleSheet,
  TouchableHighlight,
  View,
  Button,
  Text,
  Modal
} from "react-native";
export class MultiSelect extends Component {
  state = {
    isModalVisible: false,
    seatsSelected: []
  };
  toggleModal = () => {
    if (this.state.isModalVisible) console.log("toggled");
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.props.seats.map(
          <CheckBox
            checked={this.state.selectedLang2}
            color="#fc5185"
            onPress={() => this.setState({ selectedLang2: !selectedLang2 })}
          />
        )}
        <Button title="Show modal" onPress={this.toggleModal} />
      </View>
    );
  }
}

export default MultiSelect;
