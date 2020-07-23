import React, { Component } from "react";
import { Text, View, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import {
  Headline,
  Switch,
  Paragraph,
  Divider,
  Subheading,
  Menu,
  Button,
  Caption,
} from "react-native-paper";
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from "react-navigation";

import moment from "moment";

import {
  getDailyUpdate,
  getDailyUpdatePersistance,
  getDailyUpdateTime,
  getSortTasksBy,
  getTaskReminders,
  getTheme,
  changeDailyUpdate,
  changeDailyUpdatePersistance,
  changeDailyUpdateTime,
  changeSortTasksBy,
  changeTaskReminders,
  changeTheme,
} from "../../controllers/settings";
import Header from "./../Header/Header";
import SetReminder from "./../SetReminder/SetReminder";

interface AppProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface AppState {
  date: string;
  dailyUpdateSwitch: boolean;
  tasksRemindersSwitch: boolean;
  dailyUpdatePersistenceSwitch: boolean;
  sortTasksMenu: boolean;
  sortTasksOption: string;
  darkThemeSwitch: string;
  dailyUpdateReminderTime: string;
  theme: string;
  themeText: string;
}

export default class SettingsScreen extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      date: moment().format("YYYY-MM-DD"),
      dailyUpdateSwitch: true,
      dailyUpdatePersistenceSwitch: false,
      dailyUpdateReminderTime: "10:00AM",
      tasksRemindersSwitch: true,
      sortTasksMenu: false,
      sortTasksOption: "Reminder Time",
      darkThemeSwitch: "light",
      theme: "light",
      themeText: "",
    };
  }

  componentDidMount = () => {
    getDailyUpdate().then((dailyUpdateSwitch: boolean) => {
      getDailyUpdatePersistance().then(
        (dailyUpdatePersistenceSwitch: boolean) => {
          getDailyUpdateTime().then((dailyUpdateReminderTime: string) => {
            getTaskReminders().then((tasksRemindersSwitch: boolean) => {
              getSortTasksBy().then((sortTasksOption: string) => {
                getTheme().then((darkThemeSwitch: string) => {
                  this.setState({
                    dailyUpdateSwitch,
                    dailyUpdatePersistenceSwitch,
                    dailyUpdateReminderTime,
                    tasksRemindersSwitch,
                    sortTasksOption,
                    darkThemeSwitch,
                    theme: darkThemeSwitch,
                  });
                });
              });
            });
          });
        }
      );
    });
  };

  changeReminderTime = (time: string) => {
    changeDailyUpdateTime(time).then(() => {
      this.setState({
        dailyUpdateReminderTime: time,
      });
    });
  };

  render() {
    return (
      <SafeAreaView
        style={{
          backgroundColor: this.state.theme === "light" ? "#EDF0FF" : "#171617",
          minHeight: "100%",
          flex: 1,
        }}
      >
        <Header
          title="Settings"
          date={this.state.date}
          navigation={this.props.navigation}
          back={true}
        />
        <ScrollView
          contentContainerStyle={{
            ...styles.mainContainer,
            backgroundColor: this.state.theme === "light" ? "white" : "#121212",
          }}
        >
          <View style={{}}>
            <Headline style={{ marginBottom: 12 }}>Notifications</Headline>
            <View style={styles.switchContainer}>
              <Switch
                style={styles.switchButton}
                value={this.state.dailyUpdateSwitch}
                onValueChange={() => {
                  changeDailyUpdate(!this.state.dailyUpdateSwitch).then(() => {
                    this.setState({
                      dailyUpdateSwitch: !this.state.dailyUpdateSwitch,
                    });
                  });
                }}
              />
              <Subheading style={{ fontSize: 19 }}>Daily Update</Subheading>
            </View>
            <SetReminder
              reminder={this.state.dailyUpdateSwitch}
              reminderTime={this.state.dailyUpdateReminderTime}
              changeReminderTime={this.changeReminderTime}
              text="Daily update reminder at: "
            />
            <View style={styles.switchContainer}>
              <Switch
                style={styles.switchButton}
                value={this.state.tasksRemindersSwitch}
                onValueChange={() => {
                  changeTaskReminders(!this.state.tasksRemindersSwitch).then(
                    () => {
                      this.setState({
                        tasksRemindersSwitch: !this.state.tasksRemindersSwitch,
                      });
                    }
                  );
                }}
              />
              <Subheading style={{ fontSize: 19 }}>Task Reminders</Subheading>
            </View>
            <Divider style={{ marginTop: 20, marginBottom: 20 }} />
            <Headline style={{ marginBottom: 12 }}>Tasks</Headline>
            <View
              style={{
                ...styles.switchContainer,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Subheading>Sort tasks by: </Subheading>
              <Menu
                visible={this.state.sortTasksMenu}
                onDismiss={() => {
                  this.setState({
                    sortTasksMenu: false,
                  });
                }}
                anchor={
                  <Paragraph
                    style={{
                      fontSize: 16,
                      padding: 4,
                      margin: 4,
                      borderWidth: 1,
                    }}
                    onPress={() => {
                      this.setState({
                        sortTasksMenu: true,
                      });
                    }}
                  >
                    {this.state.sortTasksOption}
                  </Paragraph>
                }
              >
                <Menu.Item
                  onPress={() => {
                    changeSortTasksBy("Reminder Time").then(() => {
                      this.setState({
                        sortTasksMenu: false,
                        sortTasksOption: "Reminder Time",
                      });
                    });
                  }}
                  title="Reminder Time"
                />
                <Menu.Item
                  onPress={() => {
                    changeSortTasksBy("Recently Added").then(() => {
                      this.setState({
                        sortTasksMenu: false,
                        sortTasksOption: "Recently Added",
                      });
                    });
                  }}
                  title="Recently Added"
                />
              </Menu>
            </View>
            <Divider style={{ marginTop: 20, marginBottom: 20 }} />
            <Headline style={{ marginBottom: 12 }}>Theme</Headline>
            <View style={styles.switchContainer}>
              <Switch
                style={styles.switchButton}
                value={this.state.darkThemeSwitch === "light" ? false : true}
                onValueChange={() => {
                  changeTheme(
                    this.state.darkThemeSwitch === "light" ? "dark" : "light"
                  ).then(() => {
                    this.setState({
                      darkThemeSwitch:
                        this.state.darkThemeSwitch === "light"
                          ? "dark"
                          : "light",
                      themeText: "Restart the app to see changes.",
                    });
                  });
                }}
              />
              <Subheading style={{ fontSize: 19 }}>Dark Theme</Subheading>
            </View>
            <Caption>{this.state.themeText}</Caption>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flexGrow: 1,
    width: "86%",
    margin: "7%",
    padding: "4%",
    overflow: "visible",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.7,
    shadowRadius: 1,
    shadowColor: "black",
    elevation: 3,
    paddingBottom: 100,
  },
  switchContainer: {
    display: "flex",
    flexDirection: "row",
  },
  switchButton: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  tasksContainer: {
    marginLeft: 8,
  },
});

//Persistence Notifications
/*
    <View style={{...styles.switchContainer, justifyContent: "center", alignItems: "center"}}>
        <Switch style={{transform: [{scaleX: 0.6}, {scaleY: 0.6}]}}
        value={this.state.dailyUpdatePersistenceSwitch}
        onValueChange={() => {
            changeDailyUpdatePersistance(!this.state.dailyUpdatePersistenceSwitch).then(() => {
                this.setState({
                    dailyUpdatePersistenceSwitch: !this.state.dailyUpdatePersistenceSwitch
                })
            })
        }}></Switch>
        <Paragraph>Persistent Notification (Android Only)</Paragraph>
    </View>
    */
