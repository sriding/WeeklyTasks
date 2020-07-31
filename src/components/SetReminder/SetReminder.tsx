import React, { Component, Fragment } from "react";
import { View, ScrollView } from "react-native";
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
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
          margin: 3,
        }}
      >
        <Paragraph style={{ marginBottom: 0, paddingBottom: 0, fontSize: 16 }}>
          {this.props.text}
        </Paragraph>
        <Menu
          visible={this.state.menuVisibility}
          onDismiss={() => {
            this.setState({
              menuVisibility: false,
            });
          }}
          anchor={
            <Paragraph
              style={{ fontSize: 16, padding: 4, margin: 4, borderWidth: 1 }}
              onPress={() => {
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
                      console.log("On press before function.");
                      this.props.changeReminderTime(key);
                      console.log("On press after function.");
                      this.setState({
                        menuVisibility: false,
                      });
                    }}
                    title={key}
                  />
                  <Divider />
                </Fragment>
              );
            })}
          </ScrollView>
        </Menu>
      </View>
    );
  }
}

export default SetReminder;
