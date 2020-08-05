import React, { Component, Fragment } from "react";
import { View, ScrollView, StyleSheet, Keyboard } from "react-native";
import { Paragraph, Menu, Divider } from "react-native-paper";

import reminderTimes from "../../utilities/reminderTimes";
import { AppProps, AppState } from "./SetReminder.interface";

class SetReminder extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      menuVisibility: false,
    };
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <Paragraph style={styles.mainText}>{this.props.text}</Paragraph>
        <Menu
          visible={this.state.menuVisibility}
          onDismiss={() => {
            this.setState({
              menuVisibility: false,
            });
          }}
          anchor={
            <Paragraph
              style={{
                ...styles.displayedReminderTime,
                borderColor: this.props.theme === "light" ? "black" : "white",
              }}
              onPress={() => {
                Keyboard.dismiss();
                this.setState({
                  menuVisibility: true,
                });
              }}
            >
              {this.props.reminderTime}
            </Paragraph>
          }
        >
          <ScrollView style={{ height: 200 }}>
            {Object.keys(reminderTimes).map((key, index) => {
              return (
                <Fragment key={index}>
                  <Menu.Item
                    onPress={() => {
                      this.props.changeReminderTime(key);
                      this.setState({
                        menuVisibility: false,
                      });
                    }}
                    title={key}
                  />
                  <Divider
                    style={{
                      backgroundColor:
                        this.props.theme === "light" ? "silver" : "white",
                    }}
                  />
                </Fragment>
              );
            })}
          </ScrollView>
        </Menu>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    margin: 3,
  },
  mainText: {
    marginBottom: 0,
    paddingBottom: 0,
    fontSize: 16,
  },
  displayedReminderTime: {
    fontSize: 16,
    padding: 4,
    margin: 4,
    borderWidth: 1,
  },
});

export default SetReminder;
