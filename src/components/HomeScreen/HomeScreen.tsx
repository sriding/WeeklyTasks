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
  TextInput,
} from 'react-native';

//React Native Paper, Material Design
import { Provider as PaperProvider } from "react-native-paper";

import moment from 'moment';

//Components
import DayCard from "../DayCard/DayCard";

import createInitialDays from "./../../functionsInteractingWithRealm/createInitialDays";
import { addTask } from "./../../functionsInteractingWithRealm/tasks";
import { getAllDaysData } from "./../../functionsInteractingWithRealm/getAllDaysData";

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taskInput: "",
      noteInput: "",
    }
  }

  componentDidMount = () => {
    console.log(moment().format('dddd'));
    createInitialDays();
    getAllDaysData.then((data) => {
      this.setState({
        dayInformation: data
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
    addTask(this.state.taskInput, "Monday");
    this.setState({taskInput: ""});
  }

  render() {
    return (
      <PaperProvider>
        <SafeAreaView>
          <TextInput style={{height: 40, borderLeftWidth: 1, marginLeft: 15}} 
            onChangeText={this.taskInputChange} 
            value={this.state.taskInput}
            onSubmitEditing={this.submittingTaskInput}
          />
          <View style={styles.mainContainer}>
            <ScrollView style={styles.leftPaneContainer}>
              <FlatList
                data={[{text: "Mon", day: Date.now(), key: "One"}, {text: "Tue", day: Date.now(), key: "Two"}, {text: "Wed", day: Date.now(), key: "Three"}, {text: "Thur", day: Date.now(), key: "Four"}, {text: "Fri", day: Date.now(), key: "Five"}, {text: "Sat", day: Date.now(), key: "Six"}, {text: "Sun", day: Date.now(), key: "Seven"}]}
                renderItem={({item}) => {
                  return <Text style={styles.leftPaneText}>{item.text}</Text>
                }}
              >
              </FlatList>
            </ScrollView>
            <ScrollView style={styles.middlePaneContainer}>
              <DayCard dayInformation={this.state.dayInformation && this.state.dayInformation[0]} navigation={this.props.navigation}/>
              <DayCard dayInformation={this.state.dayInformation && this.state.dayInformation[1]} navigation={this.props.navigation}/>
              <DayCard dayInformation={this.state.dayInformation && this.state.dayInformation[2]} navigation={this.props.navigation}/>
              <DayCard dayInformation={this.state.dayInformation && this.state.dayInformation[3]} navigation={this.props.navigation}/>
              <DayCard dayInformation={this.state.dayInformation && this.state.dayInformation[4]} navigation={this.props.navigation}/>
              <DayCard dayInformation={this.state.dayInformation && this.state.dayInformation[5]} navigation={this.props.navigation}/>
              <DayCard dayInformation={this.state.dayInformation && this.state.dayInformation[6]} navigation={this.props.navigation}/>
            </ScrollView>
            <ScrollView style={styles.rightPaneContainer} />
          </View>
        </SafeAreaView>
      </PaperProvider>
      );
    }
  };

const styles = StyleSheet.create({
  mainContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flexDirection: "row",
    backgroundColor: "#EDF0FF",
    color: "#3A4890"
  },
  leftPaneContainer: {
    flexGrow: 0.3,
    borderStyle: "solid",
    borderRightWidth: 1,
    marginRight: 20,
    minWidth: 100,
    backgroundColor: "#fff"
  },
  leftPaneText: {
    textAlign: "center",
    fontSize: 22,
    padding: 20
  },
  middlePaneContainer: {
    flexGrow: 1.4
  },
  rightPaneContainer: {
    flexGrow: 0.3,
    minWidth: 18
  }
});

export default HomeScreen;