import React, {Fragment, Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  FlatList,
  Button,
} from 'react-native';

//React Native Paper, Material Design
import { Provider as PaperProvider, FAB, Portal, Dialog, Paragraph, TextInput, Menu } from "react-native-paper";

import moment from 'moment';

//Components
import DayCard from "../DayCard/DayCard";
import Header from "../Header/Header";
import SideBar from "../SideBar/SideBar";

import createInitialDays from "./../../functionsInteractingWithRealm/createInitialDays";
import { addTask } from "./../../functionsInteractingWithRealm/tasks";
import { getAllDaysData } from "./../../functionsInteractingWithRealm/getAllDaysData";

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taskInput: "",
      sideBarToggle: false,
      dialogToggle: false,
      menuToggle: false,
      theWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    }
  }

  componentDidMount = () => {
    createInitialDays();
    getAllDaysData.then((data) => {
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

  submittingTaskInput = () => {
    const dayOfTheWeek = moment().format('dddd');
    addTask(this.state.taskInput, dayOfTheWeek);
    this.setState({taskInput: ""});
  }

  sideBarIconClicked = () => {
    this.setState({ 
        sideBarToggle: !this.state.sideBarToggle,
    })
  }

  dialogToggleClick = () => {
    this.setState({
      dialogToggle: true
    })
  }

  dialogToggleDismiss = () => {
    this.setState({
      dialogToggle: false
    })
  }

  toggleMenu = () => {
    this.setState({
      menuToggle: true
    })
  }

  dismissMenu = () => {
    this.setState({
      menuToggle: false
    })
  }

  render() {
    return (
      <PaperProvider>
        <SafeAreaView>
          <Header title="Home" sideBarIconClicked={this.sideBarIconClicked}/>
          <View style={styles.mainContainer}>
            {this.state.sideBarToggle !== false ?
              <ScrollView style={styles.leftPaneContainer} showsVerticalScrollIndicator={false}>
                <SideBar />
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
              this.dialogToggleClick()
            }} />
            <Portal>
              <Dialog
                visible={this.state.dialogToggle}
                onDismiss={this.dialogToggleDismiss}>
                <Dialog.Title>Task</Dialog.Title>
                <Dialog.Content>
                  <TextInput 
                    mode="outlined"
                    placeholder="Input"
                    multiline={true}
                    onChangeText={this.taskInputChange}
                    value={this.state.taskInput}
                    onSubmitEditing={this.submittingTaskInput}
                  />
                </Dialog.Content>
                <Dialog.Title>Day</Dialog.Title>
                <Dialog.Content>
                  <Menu            
                    visible={this.state.menuToggle}
                    onDismiss={this.dismissMenu}
                    anchor={<Button title={this.state.dayOfTheWeek} onPress={this.toggleMenu} />
                  }>
                    {this.state.theWeek.map((day) => {
                      return (
                        <Menu.Item onPress={() => {}} title={day} />
                      )
                    })}
                  </Menu>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button title="Done" onPress={this.dialogToggleDismiss}>Done</Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
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