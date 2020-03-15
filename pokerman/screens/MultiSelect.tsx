import React, { Component } from "react";
import { ISeat } from "../constants/DataTypes";
import { View, Button } from "react-native";
import CheckBox from "./CheckBox";
import i18n from "../i18n";
import { getNumberText } from "../constants/helper";

export class MultiSelect extends Component<
  { seats: ISeat[]; enabled: boolean },
  {
    selectedCallers: boolean[];
    handleCallers: (callers: ISeat[]) => void;
  }
> {
  state = {
    selectedCallers: [] as boolean[],
    buttonEnabled: false
  };

  onChange = (index: number) => {
    const selectedCallers = this.state.selectedCallers;
    selectedCallers[index] =
      this.state.selectedCallers[index] == null
        ? true
        : !this.state.selectedCallers[index];
    if (selectedCallers[index]) this.setState({ buttonEnabled: true });
    else this.setState({ buttonEnabled: selectedCallers.some(x => x) });

    this.setState({ selectedCallers: selectedCallers });
  };
  submitCallers = () => {
    const callers = this.props.seats.filter(
      (seat, index) => this.state.selectedCallers[index]
    );
    this.props.handleCallers(callers);
  };

  showCheckBoxes(count: number) {
    let control = [];
    const rows = Math.ceil(this.props.seats.length / count);
    for (let r = 0; r < rows; r++) {
      let row = [];

      for (
        let i = r * count;
        i < (r + 1) * count && i < this.props.seats.length;
        i++
      ) {
        row.push(
          <CheckBox
            key={"c" + i}
            selected={this.state.selectedCallers[i]}
            onPress={() => this.onChange(i)}
            text={
              i18n.t("action.seat") +
              " " +
              getNumberText(this.props.seats[i].seatNumber)
            }
          />
        );
      }
      control.push(
        <View
          key={"m" + r}
          style={{ flex: 1, flexDirection: "row", margin: "0 15px 0 15px" }}
        >
          {row}
        </View>
      );
    }
    return control;
  }
  render() {
    return (
      <View>
        {this.showCheckBoxes(4)}
        <Button
          disabled={!this.state.buttonEnabled}
          title="Done"
          onPress={this.submitCallers}
        />
      </View>
    );
  }
}

export default MultiSelect;
