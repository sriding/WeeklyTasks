import React, { Component } from 'react'
import { SafeAreaView, View, StyleSheet, ScrollView, TextInput as NativeTextInput, Dimensions } from "react-native";
import { Button, Card, Paragraph, Chip, FAB, TextInput, Text } from "react-native-paper";

import { getASingleDaysData } from "./../../functionsInteractingWithRealm/getASingleDaysData";
import { addTask, updateTask, checkTask, deleteTask, checkAllTasks, deleteAllTasks } from "./../../functionsInteractingWithRealm/tasks";
import { addNote, updateNote, deleteNote } from "./../../functionsInteractingWithRealm/notes";
import theWeek from "./../../utilities/theWeek";

//Components
import Header from "./../Header/Header";
import SnackBarPopup from "./../SnackBarPopup/SnackBarPopup";
import DayScreenCard from "./../DayScreenCard/DayScreenCard";
import DayScreenFabButtonOptions from "./../DayScreenFabButtonOptions/DayScreenFabButtonOptions";

import moment from 'moment';
import { getAllDaysData } from '../../functionsInteractingWithRealm/getAllDaysData';

export default class DayScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            Day: null,
            fabButtonClicked: false,
            currentSelectedText: {
                text: "",
                id: null
            },
            snackBarVisibility: false,
            snackBarIsError: false,
            snackBarText: "",
        }

        this.newTaskTextRef = React.createRef();
        this.firstScrollView = React.createRef();
    }

    componentDidMount = () => {
        getASingleDaysData(this.props.navigation.getParam("id", "Monday"))
        .then((data) => {
            this.setState({
                id: this.props.navigation.getParam("id", "Monday"),
                Day: data
            })
        })
        .catch((error) => {
            this.setSnackBarTextAndIfError(error, true);
            this.toggleSnackBarVisibility();
        })
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.navigation.getParam("id", "no-id") !== this.state.id) {
            getASingleDaysData(this.props.navigation.getParam("id", "no-id"))
            .then((data) => {
                this.setState({
                    id: this.props.navigation.getParam("id", "no-id"),
                    Day: data
                })
            })
            .catch((error) => {
                this.setSnackBarTextAndIfError(error, true);
                this.toggleSnackBarVisibility();
            })
        }
    }

    submitTaskText = () => {
            getASingleDaysData(this.state.id)
                .then((data) => {
                    this.setState({
                        Day: data
                    })
                    this.setSnackBarTextAndIfError("Task Created!", false);
                    this.toggleSnackBarVisibility();
                })
                .catch((error) => {
                    this.setSnackBarTextAndIfError(error, true);
                    this.toggleSnackBarVisibility();
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

    toggleFabButtonOptions = () => {
        this.setState({
            fabButtonClicked: !this.state.fabButtonClicked
        })
    }

    addTask = (text, dayID) => {
        addTask(text, dayID);
    }

    updateTask = (text, taskID) => {
        updateTask(text, taskID)
        .then(() => {
            getASingleDaysData(this.state.id)
            .then((data) => {
                this.setState({
                    Day: data
                })
            })
        })
        .catch((error) => {
            this.setSnackBarTextAndIfError(error, true);
            this.toggleSnackBarVisibility();
        })
    }

    checkTask = (taskID) => {
        checkTask(taskID);
    }

    deleteTask = (taskID) => {
        deleteTask(taskID);
    }

    checkAllTasks = (taskIDs) => {
        checkAllTasks(taskIDs);
    }

    deleteAllTasks = (taskIDs) => {
        deleteAllTasks(taskIDs);
    }

    addNote = (text, dayID) => {
        addNote(text, dayID);
    }

    updateNote = (text, noteID) => {
        updateNote(text, noteID);
    }

    deleteNote = (noteID) => {
        deleteNote(noteID);
    }

    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>
                <Header 
                    title={this.state.id} 
                    date={moment().startOf('isoweek').add('days', theWeek.indexOf(this.props.navigation.getParam("id", "no-id"))).format('MM/DD/YYYY')} 
                    navigation={this.props.navigation}/>
                <ScrollView
                    ref={this.firstScrollView} 
                    contentContainerStyle={styles.cardContainerViewContainer} 
                    showsVerticalScrollIndicator={false}>
                    <DayScreenCard 
                        Day={this.state.Day}
                        checkTask={this.checkTask}
                        deleteTask={this.deleteTask}
                        deleteNote={this.deleteNote}
                        submitTaskText={this.submitTaskText}
                        id={this.state.id}
                        newTaskTextRef={this.newTaskTextRef} />
                </ScrollView>
                <SnackBarPopup 
                    visibility={this.state.snackBarVisibility}
                    toggleSnackBarVisibility={this.toggleSnackBarVisibility}
                    snackBarIsError={this.state.snackBarIsError}
                    snackBarText={this.state.snackBarText} />
                {this.state.fabButtonClicked ? 
                <DayScreenFabButtonOptions
                    newTaskTextRef={this.newTaskTextRef}
                    checkAllTasks={this.checkAllTasks}
                    deleteAllTasks={this.deleteAllTasks}
                    Day={this.state.Day}
                    firstScrollView={this.firstScrollView}
                    toggleFabButtonOptions={this.toggleFabButtonOptions}
                 /> : null}
                <FAB style={styles.fabButton} icon="list" onPress={() => {
                    this.toggleFabButtonOptions();
                }} />
            </SafeAreaView>
        )}
    }

const styles = StyleSheet.create({
    mainContainer: {
        flexGrow: 1,
        flexWrap: "nowrap",
        backgroundColor: "#EDF0FF",
        paddingBottom: 150,
        minHeight: "100%"
    },
    goBackButtonViewContainer: {
        maxWidth: 120, 
        marginLeft: 20, 
        marginTop: 20,
        marginBottom: 20
    },
    goBackButton: {
        maxWidth: 150,
    },
    cardContainerViewContainer: {
        flexGrow: 1,
        flexDirection: "row",
        justifyContent: "center",
        paddingBottom: 150,
    },
    fabButton: {
        position: "absolute",
        margin: 20,
        right: 0,
        top: Dimensions.get("window").height - 130,
        width: 55,
        backgroundColor: "#4d4dff",
        color: "white"
      },
});
