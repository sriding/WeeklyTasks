//Core React and React Native Modules
import React, { Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Keyboard,
  Platform,
  EmitterSubscription,
  TextInput,
} from "react-native";

//React Native Paper Modules
import { FAB } from "react-native-paper";

//3rd Party Modules
import moment from "moment";

//Interfaces
import { AppProps, AppState } from "./HomeScreen.interface";

//Components
import HomeScreenCard from "../../components/HomeScreenCard/HomeScreenCard";
import Header from "../../components/Header/Header";
import SideBar from "../../components/SideBar/SideBar";
import SnackBarPopup from "../../components/SnackBarPopup/SnackBarPopup";
import NewTaskDialog from "../../components/NewTaskDialog/NewTaskDialog";
import StatusBar from "../../components/StatusBar/StatusBar";

//Functions
import { createInitialDays } from "../../controllers/database/Miscellaneous/CreateInitialDays/createInitialDays";
import { addTask } from "../../controllers/database/Tasks/tasks";
import { getAllDaysData } from "../../controllers/database/Miscellaneous/GetAllDaysData/getAllDaysData";
import { saveLoginDate } from "../../controllers/database/Login/login";
import { getTheme } from "../../controllers/database/Settings/settings";

//Utilities
import theWeek from "../../utilities/theWeek";

class HomeScreen extends Component<AppProps, AppState> {
  textInputRef: React.RefObject<TextInput>;
  focusSubscription: any;
  beforeRemoveSubscription: any;
  keyboardDidShowListener: EmitterSubscription | null;
  keyboardDidHideListener: EmitterSubscription | null;

  constructor(props: AppProps) {
    super(props);
    this.state = {
      taskInput: "",
      taskInputError: false,
      taskInputErrorText: [],
      snackBarVisibility: false,
      snackBarIsError: false,
      snackBarText: "",
      sideBarToggle: false,
      dialogToggle: false,
      dialogListToggle: false,
      dayInformation: null,
      dayOfTheWeek: moment().format("dddd"),
      amountOfTasksForTheDay: 0,
      keyboardHeight: 0,
      keyboardOpen: false,
      reminder: true,
      reminderTime: "12:00 PM",
      theme: "light",
    };

    //Reference to the text input field in the dialog popup for creating a task
    this.textInputRef = React.createRef();

    this.focusSubscription = null;
    this.beforeRemoveSubscription = null;
    this.keyboardDidShowListener = null;
    this.keyboardDidHideListener = null;
  }

  componentDidMount = async () => {
    try {
      const themeName: string = await getTheme();
      if (typeof themeName !== "string") {
        throw themeName;
      }
      this.setState({
        theme: themeName,
      });
    } catch (err) {
      this.setSnackBarTextAndIfError(
        "Error setting specific theme. Using default instead.",
        true
      );
      this.toggleSnackBarVisibility();
      this.setState({
        theme: "light",
      });
    }

    try {
      const expectStringOrVoid: string | void = await saveLoginDate();
      if (expectStringOrVoid && typeof expectStringOrVoid !== "string") {
        throw expectStringOrVoid;
      }
    } catch (err) {
      this.setSnackBarTextAndIfError(
        "Issue saving the login date. Could affect notification functionality.",
        true
      );
      this.toggleSnackBarVisibility();
    }

    try {
      const expectVoid: void = await this.getDataForAllDays();
      if (expectVoid !== null && expectVoid !== undefined) {
        throw expectVoid;
      }
    } catch (err) {
      this.setSnackBarTextAndIfError("Issue getting each day's data.", true);
      this.toggleSnackBarVisibility();
    }

    //Listenering that listens for when the home screen is in focus (i.e. moving from day screen back to home screen)
    this.focusSubscription = this.props.navigation.addListener(
      "focus",
      async () => {
        try {
          this.keyboardDidShowListener = Keyboard.addListener(
            "keyboardDidShow",
            this._keyboardDidShow
          );
          this.keyboardDidHideListener = Keyboard.addListener(
            "keyboardDidHide",
            this._keyboardDidHide
          );
          let expectVoid = await this.getDataForAllDays();
          if (expectVoid !== null && expectVoid !== undefined) {
            throw expectVoid;
          }
        } catch (err) {
          this.setSnackBarTextAndIfError(
            "Issue getting each day's data on focus.",
            true
          );
          this.toggleSnackBarVisibility();
        }
      }
    );

    this.beforeRemoveSubscription = this.props.navigation.addListener(
      "blur",
      () => {
        //Removing event listeners
        this.keyboardDidShowListener?.remove();
        this.keyboardDidHideListener?.remove();
      }
    );

    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );

    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );
  };

  componentWillUnmount = (): void => {
    //Removing Event Listener
    this.focusSubscription();
  };

  getDataForAllDays = async (): Promise<void> => {
    try {
      let dataForAllDays: any = await getAllDaysData();
      this.setState({
        dayInformation: dataForAllDays,
        sideBarToggle: false,
      });
    } catch (err) {
      this.setSnackBarTextAndIfError("Issue setting data for each day.", true);
      this.toggleSnackBarVisibility();
    }
  };

  _keyboardDidShow = (event: any) => {
    try {
      if (Platform.OS === "ios") {
        this.setState({
          keyboardHeight: event.endCoordinates.height,
          keyboardOpen: true,
        });
      } else {
        this.setState({
          keyboardHeight: event.endCoordinates.height,
        });
      }
    } catch (err) {
      this.setSnackBarTextAndIfError("Issue showing keyboard properly.", true);
      this.toggleSnackBarVisibility();
    }
  };

  _keyboardDidHide = () => {
    try {
      if (Platform.OS === "ios") {
        this.setState({
          keyboardHeight: 0,
          keyboardOpen: false,
        });
      } else {
        this.setState({
          keyboardHeight: 0,
        });
      }
    } catch (err) {
      this.setSnackBarTextAndIfError("Issue hiding keyboard properly.", true);
      this.toggleSnackBarVisibility();
    }
  };

  taskInputChange = (text: string): void => {
    this.setState({ taskInput: text });
  };

  creatingTask = async (): Promise<void> => {
    try {
      let expectVoid = await addTask(
        this.state.taskInput,
        this.state.dayOfTheWeek,
        this.state.reminder,
        this.state.reminderTime
      );
      if (expectVoid !== null && expectVoid !== undefined) {
        throw expectVoid;
      }

      let allDaysData = await getAllDaysData();
      this.setState({
        dayInformation: allDaysData,
        taskInputError: false,
        taskInputErrorText: [],
      });
      this.dismissDialogToggle();
      this.setSnackBarTextAndIfError("Task Created!", false);
      this.toggleSnackBarVisibility();
    } catch (err) {
      this.setState({
        taskInputError: true,
        taskInputErrorText: Object.values(JSON.parse(err)),
      });
    }
  };

  //Toggles sidebar to appear or disappear
  sideBarIconClicked = (): void => {
    try {
      this.setState({
        sideBarToggle: !this.state.sideBarToggle,
      });
    } catch (err) {
      this.setSnackBarTextAndIfError("Issue showing or hiding sidebar.", true);
      this.toggleSnackBarVisibility();
    }
  };

  //Opens dialog popup
  toggleDialogToggle = (): void => {
    try {
      this.setState({
        dialogToggle: true,
      });
    } catch (err) {
      this.setSnackBarTextAndIfError("Issue showing dialog box.", true);
      this.toggleSnackBarVisibility();
    }
  };

  //Dismisses dialog popup
  dismissDialogToggle = (): void => {
    this.setState({
      dialogToggle: false,
      taskInput: "",
      dialogListToggle: false,
      dayOfTheWeek: moment().format("dddd"),
      taskInputError: false,
      taskInputErrorText: [],
    });
  };

  //Toggles list of days dropdown in dialog popup
  toggleDialogList = (): void => {
    this.setState({
      dialogListToggle: !this.state.dialogListToggle,
    });
  };

  //Dismisses list of days dropdown in dialog popup
  dismissDialogList = (): void => {
    this.setState({
      dialogListToggle: false,
    });
  };

  //Sets the current day; primarily used for deciding what day a task should be created for
  setDayOfTheWeek = (day: string): void => {
    this.setState({
      dayOfTheWeek: day,
    });
  };

  //Toggles snackbar appearance
  toggleSnackBarVisibility = (): void => {
    this.setState({
      snackBarVisibility: !this.state.snackBarVisibility,
    });
  };

  //Sets the text to show on the snackbar and if the snackbar is an error message or not
  setSnackBarTextAndIfError = (text: string, isError: boolean): void => {
    this.setState({
      snackBarText: text,
      snackBarIsError: isError,
    });
  };

  changeReminderTime = (reminderTime: string): void => {
    this.setState({
      reminder: reminderTime === "N/A" ? false : true,
      reminderTime,
    });
  };

  render() {
    return (
      <SafeAreaView
        style={{
          backgroundColor: this.state.theme === "light" ? "#EDF0FF" : "#171617",
        }}
      >
        <StatusBar theme={this.state.theme} />
        <Header
          title="Weekly Task Planner"
          sideBarIconClicked={this.sideBarIconClicked}
          navigation={this.props.navigation}
          back={false}
          screen="Home"
        />
        <View style={styles.mainContainer}>
          {this.state.sideBarToggle === true ? (
            <ScrollView
              style={styles.leftPaneContainer}
              showsVerticalScrollIndicator={false}
            >
              <SideBar navigation={this.props.navigation} />
            </ScrollView>
          ) : (
            <ScrollView style={styles.leftPaneContainerNoText} />
          )}
          <ScrollView
            style={styles.middlePaneContainer}
            showsVerticalScrollIndicator={false}
          >
            {theWeek.map((days, index) => {
              return (
                <HomeScreenCard
                  key={index}
                  dayInformation={
                    this.state.dayInformation && this.state.dayInformation[days]
                  }
                  navigation={this.props.navigation}
                  theme={this.state.theme}
                />
              );
            })}
          </ScrollView>
          <ScrollView
            style={styles.rightPaneContainer}
            showsVerticalScrollIndicator={false}
          />
          <FAB
            style={{
              ...styles.fabButton,
              backgroundColor:
                this.state.theme === "light" ? "#6200ee" : "#c2c2f0",
            }}
            color={this.state.theme === "light" ? "white" : "black"}
            icon="plus"
            onPress={() => {
              this.toggleDialogToggle();
            }}
          />
          <NewTaskDialog
            dialogToggle={this.state.dialogToggle}
            dialogListToggle={this.state.dialogListToggle}
            dismissDialogToggle={this.dismissDialogToggle}
            dismissDialogList={this.dismissDialogList}
            taskInputChange={this.taskInputChange}
            taskInput={this.state.taskInput}
            textInputRef={this.textInputRef}
            toggleDialogList={this.toggleDialogList}
            creatingTask={this.creatingTask}
            setDayOfTheWeek={this.setDayOfTheWeek}
            dayOfTheWeek={this.state.dayOfTheWeek}
            taskInputError={this.state.taskInputError}
            taskInputErrorText={this.state.taskInputErrorText}
            keyboardHeight={this.state.keyboardHeight}
            keyboardOpen={this.state.keyboardOpen}
            reminder={this.state.reminder}
            reminderTime={this.state.reminderTime}
            changeReminderTime={this.changeReminderTime}
            theme={this.state.theme}
          />
          <SnackBarPopup
            visibility={this.state.snackBarVisibility}
            toggleSnackBarVisibility={this.toggleSnackBarVisibility}
            snackBarIsError={this.state.snackBarIsError}
            snackBarText={this.state.snackBarText}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    borderBottomWidth: 1,
    flexDirection: "row",
    color: "#3A4890",
    minHeight: "100%",
    paddingBottom: 150,
  },
  leftPaneContainer: {
    flexGrow: 0.3,
    borderStyle: "solid",
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    marginRight: 20,
    minWidth: 100,
    backgroundColor: "#fff",
  },
  leftPaneContainerNoText: {
    flexGrow: 0.3,
    minWidth: 18,
  },
  middlePaneContainer: {
    flexGrow: 1.4,
  },
  rightPaneContainer: {
    flexGrow: 0.3,
    minWidth: 18,
  },
  fabButton: {
    position: "absolute",
    margin: 20,
    right: 0,
    bottom: 140,
  },
});

export default HomeScreen;
