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
import ResetApplicationButton from "../../components/ResetApplicationButton/ResetApplicationButton";
import TextDialog from "../../components/TextDialog/TextDialog";
import { deleteEverythingInDB } from "../../controllers/database/Miscellaneous/DeleteEverythingInDB/deleteEverythingInDB";
import { createInitialDays } from "../../controllers/database/Miscellaneous/CreateInitialDays/createInitialDays";
import AppFunctionality from "../../components/AppFunctionality/AppFunctionality";
import { createLoginDate } from "../../controllers/database/Login/login";
import { createDailyRepeatingNotification } from "../../services/pushNotifications";
import NoteFunctionality from "../../components/NoteFunctionality/NoteFunctionality";

export default class SettingsScreen extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      date: moment().format("YYYY-MM-DD"),
      dailyUpdateStatus: true,
      dailyPersistanceStatus: false,
      dailyUpdateTimeStatus: "10:00AM",
      showTextDialog: false,
      snackBarIsError: false,
      snackBarText: "",
      snackBarVisibility: false,
      sortTasksMenu: false,
      sortTasksByStatus: "Reminder Time",
      taskReminderStatus: true,
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

  toggleTextDialog = () => {
    this.setState({
      showTextDialog: !this.state.showTextDialog,
    });
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

  //WILL COMPLETELY RESET APP
  resetApplicationToDefault = async () => {
    await deleteEverythingInDB();
    await createInitialDays();
    createLoginDate();
    await createDailyRepeatingNotification();
    this.toggleTextDialog();
    this.props.navigation.navigate("Home");
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
                  color: this.state.theme === "light" ? "white" : "black",
                  backgroundColor:
                    this.state.theme === "light" ? "#6200ee" : "#c2c2f0",
                }}
              >
                Notifications
              </Headline>
              <View style={styles.switchContainer}>
                <Switch
                  style={styles.switchButton}
                  value={this.state.dailyUpdateStatus}
                  onValueChange={async () => {
                    await changeDailyUpdate(!this.state.dailyUpdateStatus);
                    this.setState({
                      dailyUpdateStatus: !this.state.dailyUpdateStatus,
                    });
                  }}
                />
                <Subheading style={{ fontSize: 22 }}>Daily Update</Subheading>
              </View>
              <SetReminder
                reminder={this.state.dailyUpdateStatus}
                reminderTime={this.state.dailyUpdateTimeStatus}
                changeReminderTime={this.changeReminderTime}
                theme={this.state.theme}
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
                ...styles.dividerStyling,
                backgroundColor:
                  this.state.theme === "light" ? "silver" : "white",
              }}
            />
            <View style={styles.cardChunkContainer}>
              <Headline
                style={{
                  ...styles.cardTitleStyle,
                  color: this.state.theme === "light" ? "white" : "black",
                  backgroundColor:
                    this.state.theme === "light" ? "#6200ee" : "#c2c2f0",
                }}
              >
                Tasks
              </Headline>
              <View
                style={{
                  ...styles.switchContainer,
                  justifyContent: "center",
                  marginTop: 10,
                  marginBottom: 20,
                }}
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
                        ...styles.displayedSortTaskBySetting,
                        borderColor:
                          this.state.theme === "light" ? "black" : "white",
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
              <AppFunctionality />
            </View>
            <Divider
              style={{
                ...styles.dividerStyling,
                backgroundColor:
                  this.state.theme === "light" ? "silver" : "white",
              }}
            />
            <View style={styles.cardChunkContainer}>
              <Headline
                style={{
                  ...styles.cardTitleStyle,
                  color: this.state.theme === "light" ? "white" : "black",
                  backgroundColor:
                    this.state.theme === "light" ? "#6200ee" : "#c2c2f0",
                }}
              >
                Notes
              </Headline>
              <NoteFunctionality />
            </View>
            <Divider
              style={{
                ...styles.dividerStyling,
                backgroundColor:
                  this.state.theme === "light" ? "silver" : "white",
              }}
            />
            <View style={styles.cardChunkContainer}>
              <Headline
                style={{
                  ...styles.cardTitleStyle,
                  color: this.state.theme === "light" ? "white" : "black",
                  backgroundColor:
                    this.state.theme === "light" ? "#6200ee" : "#c2c2f0",
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
            <Divider
              style={{
                ...styles.dividerStyling,
                backgroundColor:
                  this.state.theme === "light" ? "silver" : "white",
              }}
            />
            <View style={{ marginTop: 50 }}>
              <ResetApplicationButton
                toggleTextDialog={this.toggleTextDialog}
              />
            </View>
          </View>
          <TextDialog
            showTextDialog={this.state.showTextDialog}
            toggleTextDialog={this.toggleTextDialog}
            functionToRun={this.resetApplicationToDefault}
            text="This will reset the application to how it was when it was installed. A restart is recommended afterwards for the theme to properly change."
          />
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
    maxWidth: 630,
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
    maxWidth: 325,
    borderRadius: 30,
    fontSize: 28,
    overflow: "hidden",
    textAlign: "center",
  },
  cardChunkContainer: {
    marginBottom: 30,
  },
  displayedSortTaskBySetting: {
    fontSize: 18,
    padding: 4,
    margin: 4,
    borderWidth: 1,
  },
  dividerStyling: {
    marginTop: 40,
    marginBottom: 40,
  },
});
