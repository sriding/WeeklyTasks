import React, { Component } from "react";

import { List, Divider } from "react-native-paper";

import theWeek from "../../utilities/theWeek";

import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView, View, Keyboard } from "react-native";

import { getTheme } from "../../controllers/database/Settings/settings";
import { AppProps, AppState } from "./SideBar.interface";

export default class SideBar extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      theme: "light",
    };
  }

  componentDidMount = async () => {
    try {
      let mark: string = await getTheme();
      this.setState({
        theme: mark,
      });
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return (
      <SafeAreaView
        style={{
          backgroundColor: this.state.theme === "light" ? "#fff" : "#171617",
          minHeight: "100%",
        }}
      >
        <List.Section style={{ flex: 0.75 }}>
          <View style={{ marginBottom: 0 }}>
            <List.Subheader style={{ fontSize: 22 }}>Days</List.Subheader>
            <Divider
              style={{
                backgroundColor:
                  this.props.theme === "light" ? "silver" : "white",
              }}
            />
          </View>
          <ScrollView style={{ marginTop: 0 }}>
            {theWeek.map((day, index) => {
              return (
                <List.Item
                  key={index}
                  title={day}
                  titleStyle={{ fontSize: 20 }}
                  onPress={() => {
                    this.props.navigation.navigate("Day", {
                      id: day,
                    });
                  }}
                />
              );
            })}
          </ScrollView>
        </List.Section>
        <View style={{ display: "flex", justifyContent: "center", flex: 0.25 }}>
          <List.Item
            title="Settings"
            titleStyle={{ fontSize: 24 }}
            left={(props) => (
              <List.Icon
                {...props}
                style={{ marginLeft: 0, marginRight: 0 }}
                icon="cog"
              />
            )}
            onPress={() => {
              this.props.navigation.navigate("Settings");
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
}
