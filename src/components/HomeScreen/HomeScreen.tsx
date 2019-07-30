import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View
} from 'react-native';

//React Native Paper, Material Design elements
import { Provider as PaperProvider, FAB } from "react-native-paper";

//Library to deal with the time object in javascript
import moment from 'moment';

//Components
import HomeScreenCard from "../HomeScreenCard/HomeScreenCard";
import Header from "../Header/Header";
import SideBar from "../SideBar/SideBar";
import SnackBarPopup from "../SnackBarPopup/SnackBarPopup";
import NewTaskDialog from "../NewTaskDialog/NewTaskDialog";

//Additional function/object imports
import createInitialDays from "./../../functionsInteractingWithRealm/createInitialDays";
import { addTask } from "./../../functionsInteractingWithRealm/tasks";
import { getAllDaysData } from "./../../functionsInteractingWithRealm/getAllDaysData";
import theWeek from "./../../utilities/theWeek";

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taskInput: "",
      snackBarVisibility: false,
      snackBarIsError: false,
      snackBarText: "",
      sideBarToggle: false,
      dialogToggle: false,
      dialogListToggle: false,
      dayInformation: null,
      dayOfTheWeek: null
    }

    //Reference to the text input field in the dialog popup for creating a task
    this.textInputRef = React.createRef();
  }

  componentDidMount = () => {
    /*
      Will check if there is already a realm file with the initial days of the week data 
      in it; if there is no realm file or no initial data, this will create/update the realm file
      to be used as a database storage
    */
    createInitialDays();

    /* 
      Function that will retrieve all the days of the week data from the realm file.
    */
    getAllDaysData().then((data) => {
      this.setState({
        dayInformation: data,
        dayOfTheWeek: moment().format('dddd')
      })
    })
    .catch((error) => {
      this.setSnackBarTextAndIfError(error, true);
      this.toggleSnackBarVisibility();
    })
  } 

  //Saves input that user plans on submitting as a new task to save
  taskInputChange = (text) => {
    this.setState({ taskInput: text})
  }

  /*
    Method that will create a task to be added to the realm db as both a task object and as 
    a property of a day's object
  */
  creatingTask = () => {
    addTask(this.state.taskInput, this.state.dayOfTheWeek)
      .then(() => {
        getAllDaysData().then((data) => {
          this.setState({
            dayInformation: data,
          })
          this.dismissDialogToggle();
          this.setSnackBarTextAndIfError("Task created!", false);
          this.toggleSnackBarVisibility();
        })
        .catch((error) => {
          this.setSnackBarTextAndIfError(error, true);
          this.toggleSnackBarVisibility();
        })
      })
      .catch((error) => {
        this.setSnackBarTextAndIfError(error, true);
        this.toggleSnackBarVisibility();
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
      dayOfTheWeek: moment().format('dddd')
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
  setDayOfTheWeek = (day) => {
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
  setSnackBarTextAndIfError = (text, isError) => {
    this.setState({
      snackBarText: text,
      snackBarIsError: isError
    })
  }

  render() {
    return (
      <PaperProvider>
        <SafeAreaView>
          <Header title="Home" date={moment().format('MM/DD/YYYY')} 
            sideBarIconClicked={this.sideBarIconClicked}/>
          <View style={styles.mainContainer}>
            {this.state.sideBarToggle !== false ?
              <ScrollView style={styles.leftPaneContainer} showsVerticalScrollIndicator={false}>
                <SideBar navigation={this.props.navigation}/>
              </ScrollView>
              : <ScrollView style={styles.leftPaneContainerNoText} />
            } 
            <ScrollView style={styles.middlePaneContainer} showsVerticalScrollIndicator={false}>
              {theWeek.map((days, index) => {
                return (
                  <HomeScreenCard key={index} dayInformation={this.state.dayInformation && this.state.dayInformation[index]} navigation={this.props.navigation}/>
                )
              })}
            </ScrollView>
            <ScrollView style={styles.rightPaneContainer} showsVerticalScrollIndicator={false} />
            <FAB style={styles.fabButton} icon="add" onPress={() => {
              this.toggleDialogToggle()
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
              dayOfTheWeek={this.state.dayOfTheWeek}/>
            <SnackBarPopup visibility={this.state.snackBarVisibility}
              toggleSnackBarVisibility={this.toggleSnackBarVisibility}
              snackBarIsError={this.state.snackBarIsError}
              snackBarText={this.state.snackBarText} />
          </View>
        </SafeAreaView>
      </PaperProvider>
      );
    }
  };

const styles = StyleSheet.create({
  mainContainer: {
    borderBottomWidth: 1,
    flexDirection: "row",
    backgroundColor: "#EDF0FF",
    color: "#3A4890",
    minHeight: "100%",
    paddingBottom: 150
  },
  leftPaneContainer: {
    flexGrow: 0.3,
    borderStyle: "solid",
    borderRightWidth: 0.5,
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
    backgroundColor: "#4d4dff",
    color: "white"
  }
});

export default HomeScreen;