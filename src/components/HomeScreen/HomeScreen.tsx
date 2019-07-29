import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Dimensions
} from 'react-native';

//React Native Paper, Material Design
import { Provider as PaperProvider, FAB, Portal, Dialog, TextInput, List, Button } from "react-native-paper";

import moment from 'moment';

//Components
import DayCard from "../DayCard/DayCard";
import Header from "../Header/Header";
import SideBar from "../SideBar/SideBar";
import SnackBarPopup from "../SnackBarPopup/SnackBarPopup";

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
      listToggle: false,
      dayInformation: null,
      dayOfTheWeek: null
    }
  }

  componentDidMount = () => {
    createInitialDays();
    getAllDaysData().then((data) => {
      this.setState({
        dayInformation: data,
        dayOfTheWeek: moment().format('dddd')
      })
    })
    .catch((err) => {
      console.log("There was an error.");
    })
  } 

  taskInputChange = (text) => {
    this.setState({ taskInput: text})
  }

  creatingTask = () => {
    addTask(this.state.taskInput, this.state.dayOfTheWeek)
      .then(() => {
        getAllDaysData().then((data) => {
          this.setState({
            dayInformation: data,
          })
          this.dismissDialogToggle();
          this.toggleSnackBarVisibility();
        })
        .catch(() => {
          console.log("Something went wrong with the getAllDaysData function")
        })
      })
      .catch(() => {
        console.log("Something went wrong with the addTask function");
      })
  }

  sideBarIconClicked = () => {
    this.setState({ 
        sideBarToggle: !this.state.sideBarToggle,
    })
  }

  toggleDialogToggle = () => {
    this.setState({
      dialogToggle: true
    })
  }

  dismissDialogToggle = () => {
    this.setState({
      dialogToggle: false,
      taskInput: "",
      listToggle: false,
      dayOfTheWeek: moment().format('dddd')
    })
  }

  toggleList = () => {
    this.setState({
      listToggle: !this.state.listToggle
    })
  }

  dismissList = () => {
    this.setState({
      listToggle: false,
    })
  }

  setDayOfTheWeek = (day) => {
    this.setState({
      dayOfTheWeek: day
    })
  }

  toggleSnackBarVisibility = () => {
    this.setState({
      snackBarVisibility: !this.state.snackBarVisibility
    })
  }

  render() {
    return (
      <PaperProvider>
        <SafeAreaView>
          <Header title="Home" date={moment().format('MM/DD/YYYY')} sideBarIconClicked={this.sideBarIconClicked}/>
          <View style={styles.mainContainer}>
            {this.state.sideBarToggle !== false ?
              <ScrollView style={styles.leftPaneContainer} showsVerticalScrollIndicator={false}>
                <SideBar navigation={this.props.navigation}/>
              </ScrollView>
              : <ScrollView style={styles.leftPaneContainerNoText} />
            } 
            <ScrollView style={styles.middlePaneContainer} showsVerticalScrollIndicator={false}>
              <DayCard dayInformation={this.state.dayInformation && this.state.dayInformation[0]} navigation={this.props.navigation}/>
              <DayCard dayInformation={this.state.dayInformation && this.state.dayInformation[1]} navigation={this.props.navigation}/>
              <DayCard dayInformation={this.state.dayInformation && this.state.dayInformation[2]} navigation={this.props.navigation}/>
              <DayCard dayInformation={this.state.dayInformation && this.state.dayInformation[3]} navigation={this.props.navigation}/>
              <DayCard dayInformation={this.state.dayInformation && this.state.dayInformation[4]} navigation={this.props.navigation}/>
              <DayCard dayInformation={this.state.dayInformation && this.state.dayInformation[5]} navigation={this.props.navigation}/>
              <DayCard dayInformation={this.state.dayInformation && this.state.dayInformation[6]} navigation={this.props.navigation}/>
            </ScrollView>
            <ScrollView style={styles.rightPaneContainer} showsVerticalScrollIndicator={false} />
            <FAB style={styles.fabButton} icon="add" onPress={() => {
              this.toggleDialogToggle()
            }} />
            <Portal>
              <Dialog
                visible={this.state.dialogToggle}
                onDismiss={this.dismissDialogToggle}
                style={{maxHeight: Dimensions.get('window').height - 50 }}
                >
                <Dialog.Title>Task</Dialog.Title>
                <Dialog.Content>
                  <TextInput 
                    mode="outlined"
                    label="Input"
                    multiline={true}
                    style={{maxHeight: 350}}
                    onChangeText={this.taskInputChange}
                    value={this.state.taskInput}
                  />
                </Dialog.Content>
                <Dialog.Title>Day</Dialog.Title>
                <Dialog.Content>
                  <List.Accordion
                    title={this.state.dayOfTheWeek}
                    expanded={this.state.listToggle}
                    onPress={this.toggleList}
                  >
                    <ScrollView style={{height: 200, borderRightWidth: 1}}>
                    {Object.keys(theWeek).map((day, index) => {
                      return (
                        <List.Item 
                          key={index}
                          onPress={() => {
                            this.dismissList();
                            this.setDayOfTheWeek(day);
                          }} 
                          title={day} />
                      )
                    })}
                    </ScrollView>
                    </List.Accordion>
                </Dialog.Content>
                <Dialog.Actions style={styles.dialogButtons}>
                  <Button mode="contained" 
                      onPress={this.dismissDialogToggle}
                      color="#C00000">Cancel
                  </Button>
                  <Button mode="contained" 
                    onPress={this.creatingTask}>Create
                  </Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
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
  },
  dialogButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly"
  }
});

export default HomeScreen;