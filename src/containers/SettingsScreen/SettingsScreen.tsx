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
  Text,
} from "react-native-paper";

//3rd Party modules
import moment from "moment";

//Interfaces
import { AppProps, AppState } from "./SettingsScreen.interface";

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
import SnackBarPopup from "../../components/SnackBarPopup/SnackBarPopup";

export default class SettingsScreen extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      date: moment().format("YYYY-MM-DD"),
      dailyUpdateStatus: true,
      dailyPersistanceStatus: false,
      dailyUpdateTimeStatus: "10:00AM",
      taskReminderStatus: true,
      snackBarIsError: false,
      snackBarText: "",
      snackBarVisibility: false,
      sortTasksMenu: false,
      sortTasksByStatus: "Reminder Time",
      themeStatus: "light",
      theme: "light",
      themeText: "",
    };
  }

  componentDidMount = async () => {
    try {
      const dailyUpdateStatus: boolean = await getDailyUpdate();
      if (typeof dailyUpdateStatus !== "boolean") {
        throw dailyUpdateStatus;
      }
      this.setState({
        dailyUpdateStatus,
      });
    } catch (err) {
      this.setSnackBarTextAndIfError(
        "Error getting daily update boolean.",
        true
      );
      this.toggleSnackBarVisibility();
    }

    try {
      const dailyPersistanceStatus: boolean = await getDailyUpdatePersistance();
      if (typeof dailyPersistanceStatus !== "boolean") {
        throw dailyPersistanceStatus;
      }
      this.setState({
        dailyPersistanceStatus,
      });
    } catch (err) {
      this.setSnackBarTextAndIfError(
        "Error getting daily persistance boolean",
        true
      );
      this.toggleSnackBarVisibility();
    }

    try {
      const dailyUpdateTimeStatus: string = await getDailyUpdateTime();
      if (typeof dailyUpdateTimeStatus !== "string") {
        throw dailyUpdateTimeStatus;
      }
      this.setState({
        dailyUpdateTimeStatus,
      });
    } catch (err) {
      this.setSnackBarTextAndIfError(
        "Error setting specific theme. Using default instead.",
        true
      );
      this.toggleSnackBarVisibility();
    }

    try {
      const taskReminderStatus: boolean = await getTaskReminders();
      if (typeof taskReminderStatus !== "boolean") {
        throw taskReminderStatus;
      }
      this.setState({
        taskReminderStatus,
      });
    } catch (err) {
      this.setSnackBarTextAndIfError(
        "Error setting specific theme. Using default instead.",
        true
      );
      this.toggleSnackBarVisibility();
    }

    try {
      const sortTasksByStatus: string = await getSortTasksBy();
      if (typeof sortTasksByStatus !== "string") {
        throw sortTasksByStatus;
      }
      this.setState({
        sortTasksByStatus,
      });
    } catch (err) {
      this.setSnackBarTextAndIfError(
        "Error setting specific theme. Using default instead.",
        true
      );
      this.toggleSnackBarVisibility();
    }

    try {
      const themeStatus: string = await getTheme();
      if (typeof themeStatus !== "string") {
        throw themeStatus;
      }
      this.setState({
        themeStatus,
        theme: themeStatus,
      });
    } catch (err) {
      this.setSnackBarTextAndIfError(
        "Error setting specific theme. Using default instead.",
        true
      );
      this.toggleSnackBarVisibility();
    }
  };

  changeReminderTime = async (time: string): Promise<void> => {
    try {
      const expectVoid: void = await changeDailyUpdateTime(time);
      if (expectVoid !== null && expectVoid !== undefined) {
        throw expectVoid;
      }
      this.setState({
        dailyUpdateTimeStatus: time,
      });
    } catch (err) {
      this.setSnackBarTextAndIfError(
        "Error setting specific theme. Using default instead.",
        true
      );
      this.toggleSnackBarVisibility();
    }
  };

  toggleSnackBarVisibility = (): void => {
    this.setState({
      snackBarVisibility: !this.state.snackBarVisibility,
    });
  };

  setSnackBarTextAndIfError = (text: string, isError: boolean): void => {
    this.setState({
      snackBarText: text,
      snackBarIsError: isError,
    });
  };

  render() {
    return (
      <SafeAreaView
        style={{
          ...styles.topContainer,
          backgroundColor: this.state.theme === "light" ? "#EDF0FF" : "#171617",
        }}
      >
        <Header
          title="Settings"
          navigation={this.props.navigation}
          back={true}
          screen="Settings"
        />
        <ScrollView
          contentContainerStyle={{
            ...styles.mainContainer,
            backgroundColor: this.state.theme === "light" ? "white" : "#121212",
          }}
        >
          <View style={styles.cardChunkContainer}>
            <View style={styles.cardChunkContainer}>
              <Headline
                style={{
                  ...styles.cardTitleStyle,
                  color: this.props.theme === "light" ? "white" : "black",
                  backgroundColor:
                    this.props.theme === "light" ? "#6200ee" : "#c2c2f0",
                }}
              >
                Notifications
              </Headline>
              <View style={styles.switchContainer}>
                <Switch
                  style={styles.switchButton}
                  value={this.state.dailyUpdateStatus}
                  onValueChange={() => {
                    changeDailyUpdate(!this.state.dailyUpdateStatus).then(
                      () => {
                        this.setState({
                          dailyUpdateStatus: !this.state.dailyUpdateStatus,
                        });
                      }
                    );
                  }}
                />
                <Subheading style={{ fontSize: 22 }}>Daily Update</Subheading>
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
                <Subheading style={{ fontSize: 22 }}>Task Reminders</Subheading>
              </View>
            </View>
            <Divider
              style={{
                marginTop: 20,
                marginBottom: 20,
                backgroundColor:
                  this.props.theme === "light" ? "silver" : "white",
              }}
            />
            <View style={styles.cardChunkContainer}>
              <Headline
                style={{
                  ...styles.cardTitleStyle,
                  color: this.props.theme === "light" ? "white" : "black",
                  backgroundColor:
                    this.props.theme === "light" ? "#6200ee" : "#c2c2f0",
                }}
              >
                Tasks
              </Headline>
              <View
                style={{ ...styles.switchContainer, justifyContent: "center" }}
              >
                <Subheading style={{ fontSize: 22 }}>
                  Sort tasks by:{" "}
                </Subheading>
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
                        fontSize: 18,
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
            </View>
            <Divider
              style={{
                marginTop: 20,
                marginBottom: 20,
                backgroundColor:
                  this.props.theme === "light" ? "silver" : "white",
              }}
            />
            <View style={styles.cardChunkContainer}>
              <Headline
                style={{
                  ...styles.cardTitleStyle,
                  color: this.props.theme === "light" ? "white" : "black",
                  backgroundColor:
                    this.props.theme === "light" ? "#6200ee" : "#c2c2f0",
                }}
              >
                Theme
              </Headline>
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
                <Subheading style={{ fontSize: 22 }}>Dark Theme</Subheading>
              </View>
              <Caption>{this.state.themeText}</Caption>
            </View>
          </View>
          <SnackBarPopup
            visibility={this.state.snackBarVisibility}
            toggleSnackBarVisibility={this.toggleSnackBarVisibility}
            snackBarIsError={this.state.snackBarIsError}
            snackBarText={this.state.snackBarText}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  topContainer: {
    minHeight: "100%",
    flexGrow: 1,
  },
  mainContainer: {
    alignSelf: "center",
    marginTop: 25,
    flexGrow: 1,
    width: "92%",
    maxWidth: "95%",
    padding: 20,
    overflow: "visible",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 1,
    shadowColor: "black",
    elevation: 3,
    paddingBottom: 100,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#F5F5F5",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchButton: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  tasksContainer: {
    marginLeft: 8,
  },
  cardTitleStyle: {
    elevation: 10,
    marginTop: 20,
    marginBottom: 25,
    paddingTop: 12,
    paddingBottom: 12,
    maxWidth: "70%",
    borderRadius: 30,
    fontSize: 28,
    color: "white",
    overflow: "hidden",
    textAlign: "center",
  },
  cardChunkContainer: {
    marginBottom: 30,
  },
});
