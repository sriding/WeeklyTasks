import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Keyboard,
  Platform,
  EmitterSubscription
} from 'react-native';

//React Native Paper, Material Design elements
import { FAB, TextInput } from "react-native-paper";

//Library to deal with the time object in javascript
import moment from 'moment';

//Components
import HomeScreenCard from "../HomeScreenCard/HomeScreenCard";
import Header from "../Header/Header";
import SideBar from "../SideBar/SideBar";
import SnackBarPopup from "../SnackBarPopup/SnackBarPopup";
import NewTaskDialog from "../NewTaskDialog/NewTaskDialog";
import StatusBar from "./../StatusBar/StatusBar";

//Additional function/object imports
import { createInitialDays } from "./../../functionsInteractingWithRealm/createInitialDays";
import { addTask } from "./../../functionsInteractingWithRealm/tasks";
import { getAllDaysData } from "./../../functionsInteractingWithRealm/getAllDaysData";
import { saveLoginDate } from "./../../functionsInteractingWithRealm/login";
import { getTheme } from "./../../functionsInteractingWithRealm/settings";
import theWeek from "./../../utilities/theWeek";

import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState
} from 'react-navigation';

import migration from "./../../schemas/migration";
import { pushNotifications } from "./../../services/Index";

//FOR RESETING REALM COMPLETELY
import { deleteEverything } from "./../../functionsInteractingWithRealm/deleteEverything";

interface DayObject { 
    id: string,
    tasks: {
      id: number,
      day: string,
      text: string,
      isChecked: boolean
    }[],
    note: {
      id: number,
      text: string
    }
}
interface AppProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

interface AppState {
  taskInput: string,
  taskInputError: boolean,
  taskInputErrorText: string,
  snackBarVisibility: boolean,
  snackBarIsError: boolean,
  snackBarText: string,
  sideBarToggle: boolean,
  dialogToggle: boolean,
  dialogListToggle: boolean,
  dayInformation: DayObject[],
  dayOfTheWeek: string,
  amountOfTasksForTheDay: number,
  keyboardHeight: number,
  keyboardOpen: boolean,
  date: string,
  reminder: boolean,
  reminderTime: string,
  theme: string
}

class HomeScreen extends Component<AppProps, AppState> {
  protected textInputRef: React.RefObject<TextInput>
  public keyboardDidShowListener!: EmitterSubscription
  public keyboardDidHideListener!: EmitterSubscription
  public didFocusSubscription: any
  
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
      dayInformation: [{
        id: "",
        tasks: [{
          id: -1,
          day: "",
          text: "",
          isChecked: false
        }],
        note: {
          id: -1,
          text: ""
        }
      }],
      dayOfTheWeek: moment().format('dddd'),
      amountOfTasksForTheDay: 0,
      keyboardHeight: 0,
      keyboardOpen: false,
      date: moment().format('YYYY-MM-DD'),
      reminder: true,
      reminderTime: "12:00 PM",
      theme: "light"
    }

    //Reference to the text input field in the dialog popup for creating a task
    this.textInputRef = React.createRef();
  }

  componentDidMount = () => {

    //deleteEverything()
    //.then(() => {

    /*
      Will check if there is already a realm file with the initial days of the week data 
      in it; if there is no realm file or no initial data, this will create/update the realm file
      to be used as a database storage
    */
    createInitialDays()
      .then(() => {
        //Nothing
        getTheme().then((mark) => {
          this.setState({
            theme: mark
          })
        })
      })
      .catch((error: string) => {
        this.setSnackBarTextAndIfError(error, true);
        this.toggleSnackBarVisibility();
      })

    /*
      Saves the date the user logs in to the embedded database to determine when
      the app should reset all the tasks to unchecked. This reset should be happening
      every monday.
    */ 
    saveLoginDate()
      .then((message?: string) => {
        if (message != undefined) {
          this.setSnackBarTextAndIfError(message, false);
          this.toggleSnackBarVisibility();
        }
      })
      .catch((error: string) => {
          this.setSnackBarTextAndIfError(error, true);
          this.toggleSnackBarVisibility();
      })

    /*
      This event listener is for when a user taps the back arrow on the day screen;
      this listener will fire because the homescreen is now in focus and can update
      any tasks/notes on the homescreen that were updated on the day screen
    */
    this.didFocusSubscription = this.props.navigation.addListener(
      'didFocus',
      () => {
        getAllDaysData().then((data: DayObject[]) => {
          this.setState({
            dayInformation: data,
            sideBarToggle: false
          })
        })
        .catch((error: string) => {
          this.setSnackBarTextAndIfError(error, true);
          this.toggleSnackBarVisibility();
        })
      }
    );

    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );

    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  //})
  } 

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    this.didFocusSubscription.remove();
  }

  _keyboardDidShow = (event: any) => {
    if (Platform.OS == "ios") {
      this.setState({
        keyboardHeight: event.endCoordinates.height,
        keyboardOpen: true
      })
    } else {
      this.setState({
        keyboardHeight: event.endCoordinates.height
      })
    }
  }

  _keyboardDidHide = () => {
    if (Platform.OS == "ios") {
      this.setState({
        keyboardHeight: 0,
        keyboardOpen: false
      })
    } else {
      this.setState({
        keyboardHeight: 0
      })
    }
  }

  //Saves input that user plans on submitting as a new task to save
  taskInputChange = (text: string) => {
    this.setState({ taskInput: text})
  }

  setRemindersForTheDay = () => {
    pushNotifications.sendLocalNotification(); 
  }

  /*
    Method that will create a task to be added to the realm db as both a task object and as 
    a property of a day's object
  */
  creatingTask = () => {
    addTask(this.state.taskInput, this.state.dayOfTheWeek, this.state.reminder, this.state.reminderTime)
      .then(() => {
        getAllDaysData().then((data: DayObject[]) => {
          this.setState({
            dayInformation: data,
            taskInputError: false,
            taskInputErrorText: ""
          })
          this.dismissDialogToggle();
          this.setSnackBarTextAndIfError("Task Created!", false);
          this.toggleSnackBarVisibility();
        })
        .catch((error: string) => {
          this.setSnackBarTextAndIfError(error, true);
          this.toggleSnackBarVisibility();
        })
      })
      .catch((error: string) => {
        this.setState({
          taskInputError: true,
          taskInputErrorText: error
        })
      })
  }

  //Toggles sidebar to appear or disappear
  sideBarIconClicked = () => {
    this.setState({ 
        sideBarToggle: !this.state.sideBarToggle,
    })
  }

  //Opens dialog popup
  toggleDialogToggle = () => {
    this.setState({
      dialogToggle: true
    })
  }

  //Dismisses dialog popup
  dismissDialogToggle = () => {
    this.setState({
      dialogToggle: false,
      taskInput: "",
      dialogListToggle: false,
      dayOfTheWeek: moment().format('dddd'),
      taskInputError: false,
      taskInputErrorText: ""
    })
  }

  //Toggles list of days dropdown in dialog popup
  toggleDialogList = () => {
    this.setState({
      dialogListToggle: !this.state.dialogListToggle
    })
  }

  //Dismisses list of days dropdown in dialog popup
  dismissDialogList = () => {
    this.setState({
      dialogListToggle: false,
    })
  }

  //Sets the current day; primarily used for deciding what day a task should be created for
  setDayOfTheWeek = (day: string) => {
    this.setState({
      dayOfTheWeek: day
    })
  }

  //Toggles snackbar appearance
  toggleSnackBarVisibility = () => {
    this.setState({
      snackBarVisibility: !this.state.snackBarVisibility
    })
  }

  //Sets the text to show on the snackbar and if the snackbar is an error message or not
  setSnackBarTextAndIfError = (text: string, isError: boolean) => {
    this.setState({
      snackBarText: text,
      snackBarIsError: isError
    })
  }

  changeReminderTime = (reminderTime: string) => {
    this.setState({
        reminder: reminderTime === "N/A" ? false : true,
        reminderTime
    })
}

  render() {
    return (
        <SafeAreaView style={{backgroundColor: this.state.theme === "light" ? "#EDF0FF" : "#171617"}}>
          <StatusBar theme={this.state.theme}/>
          <Header title="Weekly Task Planner" 
            date={this.state.date} 
            sideBarIconClicked={this.sideBarIconClicked}
            navigation={this.props.navigation}
            back={false}/>
          <View style={styles.mainContainer}>
              {this.state.sideBarToggle !== false ?
                <ScrollView style={styles.leftPaneContainer} 
                  showsVerticalScrollIndicator={false}>
                  <SideBar navigation={this.props.navigation}/>
                </ScrollView> : 
                <ScrollView style={styles.leftPaneContainerNoText} />
              } 
            <ScrollView style={styles.middlePaneContainer} 
              showsVerticalScrollIndicator={false}>
              {theWeek.map((days, index) => {
                return (
                  <HomeScreenCard key={index} 
                    dayInformation={this.state.dayInformation && this.state.dayInformation[index]} 
                    navigation={this.props.navigation}
                    theme={this.state.theme}/>
                )
              })}
            </ScrollView>
            <ScrollView style={styles.rightPaneContainer} 
              showsVerticalScrollIndicator={false} />
            <FAB style={{...styles.fabButton, backgroundColor: this.state.theme === "light" ? "#6200ee" : "#171617"}} icon="add" onPress={() => {
              this.toggleDialogToggle();
              //pushNotifications.testLocalNotifications();
            }} />
            <NewTaskDialog dialogToggle={this.state.dialogToggle}
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
              theme={this.state.theme}/>
            <SnackBarPopup visibility={this.state.snackBarVisibility}
              toggleSnackBarVisibility={this.toggleSnackBarVisibility}
              snackBarIsError={this.state.snackBarIsError}
              snackBarText={this.state.snackBarText} />
          </View>
        </SafeAreaView>
      );
    }
  };

const styles = StyleSheet.create({
  mainContainer: {
    borderBottomWidth: 1,
    flexDirection: "row",
    color: "#3A4890",
    minHeight: "100%",
    paddingBottom: 150
  },
  leftPaneContainer: {
    flexGrow: 0.3,
    borderStyle: "solid",
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    marginRight: 20,
    minWidth: 100,
    backgroundColor: "#fff"
  },
  leftPaneContainerNoText: {
    flexGrow: 0.3,
    minWidth: 18
  },
  middlePaneContainer: {
    flexGrow: 1.4,
  },
  rightPaneContainer: {
    flexGrow: 0.3,
    minWidth: 18
  },
  fabButton: {
    position: "absolute",
    margin: 20,
    right: 0,
    bottom: 140,
    color: "white"
  }
});

export default HomeScreen;