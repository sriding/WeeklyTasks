//Core React and React Native modules
import React, { Component } from "react";
import { View, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import {
  Headline,
  Switch,
  Paragraph,
  Divider,
  Subheading,
  Menu,
  Caption,
} from "react-native-paper";

//3rd Party modules
import moment from "moment";

//Interfaces
import { AppProps, AppState } from "./Interfaces-SettingsScreen";

//Functions
import {
  getDailyUpdate,
  getDailyUpdatePersistance,
  getDailyUpdateTime,
  getSortTasksBy,
  getTaskReminders,
  getTheme,
  changeDailyUpdate,
  changeDailyUpdateTime,
  changeSortTasksBy,
  changeTaskReminders,
  changeTheme,
} from "../../controllers/database/Settings/settings";

//Components
import Header from "../../components/Header/Header";
import SetReminder from "../../components/SetReminder/SetReminder";

export default class SettingsScreen extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      date: moment().format("YYYY-MM-DD"),
      dailyUpdateStatus: true,
      dailyPersistanceStatus: false,
      dailyUpdateTimeStatus: "10:00AM",
      taskReminderStatus: true,
      sortTasksMenu: false,
      sortTasksByStatus: "Reminder Time",
      themeStatus: "light",
      theme: "light",
      themeText: "",
    };
  }

  componentDidMount = async () => {
    const dailyUpdateStatus = await getDailyUpdate();
    const dailyPersistanceStatus = await getDailyUpdatePersistance();
    const dailyUpdateTimeStatus = await getDailyUpdateTime();
    const taskReminderStatus = await getTaskReminders();
    const sortTasksByStatus = await getSortTasksBy();
    const themeStatus = await getTheme();
    this.setState({
      dailyUpdateStatus,
      dailyPersistanceStatus,
      dailyUpdateTimeStatus,
      taskReminderStatus,
      sortTasksByStatus,
      themeStatus,
      theme: themeStatus,
    });
  };

  changeReminderTime = async (time: string) => {
    console.log("app prop function before");
    const done = await changeDailyUpdateTime(time);
    console.log("app prop function after");
    this.setState({
      dailyUpdateTimeStatus: time,
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
                value={this.state.dailyUpdateStatus}
                onValueChange={() => {
                  changeDailyUpdate(!this.state.dailyUpdateStatus).then(() => {
                    this.setState({
                      dailyUpdateStatus: !this.state.dailyUpdateStatus,
                    });
                  });
                }}
              />
              <Subheading style={{ fontSize: 19 }}>Daily Update</Subheading>
            </View>
            <SetReminder
              reminder={this.state.dailyUpdateStatus}
              reminderTime={this.state.dailyUpdateTimeStatus}
              changeReminderTime={this.changeReminderTime}
              text="Daily update reminder at: "
            />
            <View style={styles.switchContainer}>
              <Switch
                style={styles.switchButton}
                value={this.state.taskReminderStatus}
                onValueChange={() => {
                  changeTaskReminders(!this.state.taskReminderStatus).then(
                    () => {
                      this.setState({
                        taskReminderStatus: !this.state.taskReminderStatus,
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
                    {this.state.sortTasksByStatus}
                  </Paragraph>
                }
              >
                <Menu.Item
                  onPress={() => {
                    changeSortTasksBy("Reminder Time").then(() => {
                      this.setState({
                        sortTasksMenu: false,
                        sortTasksByStatus: "Reminder Time",
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
                        sortTasksByStatus: "Recently Added",
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
                value={this.state.themeStatus === "light" ? false : true}
                onValueChange={() => {
                  changeTheme(
                    this.state.themeStatus === "light" ? "dark" : "light"
                  ).then(() => {
                    this.setState({
                      themeStatus:
                        this.state.themeStatus === "light" ? "dark" : "light",
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
