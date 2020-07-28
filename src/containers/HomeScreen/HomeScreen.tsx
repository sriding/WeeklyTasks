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
import { DayObject, AppProps, AppState } from "./Interfaces-HomeScreen";

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

//Services
import { pushNotifications } from "../../services/Index";

/**
 * Add shouldcomponentupdate method in case theme does not change from light
 * */
class HomeScreen extends Component<AppProps, AppState> {
  textInputRef: React.RefObject<TextInput>;
  focusSubscription: any;
  keyboardDidShowListener: EmitterSubscription | null;
  keyboardDidHideListener: EmitterSubscription | null;

  constructor(props: AppProps) {
    super(props);
    this.state = {
      taskInput: "",
      taskInputError: false,
      taskInputErrorText: "",
      snackBarVisibility: false,
      snackBarIsError: false,
      snackBarText: "",
      sideBarToggle: false,
      dialogToggle: false,
      dialogListToggle: false,
      dayInformation: {},
      dayOfTheWeek: moment().format("dddd"),
      amountOfTasksForTheDay: 0,
      keyboardHeight: 0,
      keyboardOpen: false,
      date: moment().format("YYYY-MM-DD"),
      reminder: true,
      reminderTime: "12:00 PM",
      theme: "light",
    };

    //Reference to the text input field in the dialog popup for creating a task
    this.textInputRef = React.createRef();
    this.focusSubscription = null;
    this.keyboardDidShowListener = null;
    this.keyboardDidHideListener = null;
  }

  componentDidMount = async () => {
    try {
      await createInitialDays();
    } catch (err) {
      this.setSnackBarTextAndIfError(err, true);
      this.toggleSnackBarVisibility();
    }

    try {
      const themeName = await getTheme();
      this.setState({
        theme: themeName,
      });
    } catch (err) {
      this.setSnackBarTextAndIfError(err, true);
      this.toggleSnackBarVisibility();
    }

    try {
      const userLoginMessage = await saveLoginDate();
      if (userLoginMessage !== undefined) {
        this.setSnackBarTextAndIfError(userLoginMessage, false);
        this.toggleSnackBarVisibility();
      }
    } catch (err) {
      this.setSnackBarTextAndIfError(err, true);
      this.toggleSnackBarVisibility();
    }

    try {
      await this.getDataForAllDays();
    } catch (err) {
      this.setSnackBarTextAndIfError(err, true);
      this.toggleSnackBarVisibility();
    }

    //Listenering that listens for when the home screen is in focus (i.e. moving from day screen back to home screen)
    this.focusSubscription = this.props.navigation.addListener(
      "focus",
      async () => {
        try {
          await this.getDataForAllDays();
        } catch (err) {
          this.setSnackBarTextAndIfError(err, true);
          this.toggleSnackBarVisibility();
        }
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

  componentWillUnmount() {
    //Removing Event Listeners
    this.focusSubscription();
    this.keyboardDidShowListener?.remove();
    this.keyboardDidHideListener?.remove();
  }

  getDataForAllDays = async () => {
    try {
      let dataForAllDays = await getAllDaysData();
      this.setState({
        dayInformation: dataForAllDays,
        sideBarToggle: false,
      });
    } catch (err) {
      this.setSnackBarTextAndIfError(err, true);
      this.toggleSnackBarVisibility();
    }
  };

  _keyboardDidShow = (event: any) => {
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
  };

  _keyboardDidHide = () => {
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
  };

  taskInputChange = (text: string) => {
    this.setState({ taskInput: text });
  };

  creatingTask = async () => {
    try {
      await addTask(
        this.state.taskInput,
        this.state.dayOfTheWeek,
        this.state.reminder,
        this.state.reminderTime
      );
    } catch (err) {
      this.setState({
        taskInputError: true,
        taskInputErrorText: err,
      });
    }

    try {
      let allDaysData = await getAllDaysData();
      this.setState({
        dayInformation: allDaysData,
        taskInputError: false,
        taskInputErrorText: "",
      });
      this.dismissDialogToggle();
      this.setSnackBarTextAndIfError("Task Created!", false);
      this.toggleSnackBarVisibility();
    } catch (err) {
      this.setSnackBarTextAndIfError(err, true);
      this.toggleSnackBarVisibility();
    }
  };

  //Toggles sidebar to appear or disappear
  sideBarIconClicked = () => {
    this.setState({
      sideBarToggle: !this.state.sideBarToggle,
    });
  };

  //Opens dialog popup
  toggleDialogToggle = () => {
    this.setState({
      dialogToggle: true,
    });
  };

  //Dismisses dialog popup
  dismissDialogToggle = () => {
    this.setState({
      dialogToggle: false,
      taskInput: "",
      dialogListToggle: false,
      dayOfTheWeek: moment().format("dddd"),
      taskInputError: false,
      taskInputErrorText: "",
    });
  };

  //Toggles list of days dropdown in dialog popup
  toggleDialogList = () => {
    this.setState({
      dialogListToggle: !this.state.dialogListToggle,
    });
  };

  //Dismisses list of days dropdown in dialog popup
  dismissDialogList = () => {
    this.setState({
      dialogListToggle: false,
    });
  };

  //Sets the current day; primarily used for deciding what day a task should be created for
  setDayOfTheWeek = (day: string) => {
    this.setState({
      dayOfTheWeek: day,
    });
  };

  //Toggles snackbar appearance
  toggleSnackBarVisibility = () => {
    this.setState({
      snackBarVisibility: !this.state.snackBarVisibility,
    });
  };

  //Sets the text to show on the snackbar and if the snackbar is an error message or not
  setSnackBarTextAndIfError = (text: string, isError: boolean) => {
    this.setState({
      snackBarText: text,
      snackBarIsError: isError,
    });
  };

  changeReminderTime = (reminderTime: string) => {
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
          date={this.state.date}
          sideBarIconClicked={this.sideBarIconClicked}
          navigation={this.props.navigation}
          back={false}
        />
        <View style={styles.mainContainer}>
          {this.state.sideBarToggle !== false ? (
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
                this.state.theme === "light" ? "#6200ee" : "#171617",
            }}
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
