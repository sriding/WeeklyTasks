import React, { Component } from 'react'
import { SafeAreaView, StyleSheet, ScrollView, Dimensions, Platform, Keyboard } from "react-native";
import { FAB } from "react-native-paper";

import { getASingleDaysData } from "./../../functionsInteractingWithRealm/getASingleDaysData";
import { checkTask, deleteTask, checkAllTasks, deleteAllTasks } from "./../../functionsInteractingWithRealm/tasks";
import { deleteNote } from "./../../functionsInteractingWithRealm/notes";
import theWeek from "./../../utilities/theWeek";

//Components
import Header from "./../Header/Header";
import SnackBarPopup from "./../SnackBarPopup/SnackBarPopup";
import DayScreenCard from "./../DayScreenCard/DayScreenCard";
import DayScreenFabButtonOptions from "./../DayScreenFabButtonOptions/DayScreenFabButtonOptions";

import moment from 'moment';

export default class DayScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            Day: null,
            fabButtonClicked: false,
            snackBarVisibility: false,
            snackBarIsError: false,
            snackBarText: "",
            keyboardHeight: 0,
            keyboardOpen: false,
            date: ""
        }

        this.newTaskTextRef = React.createRef();
        this.newNoteTextRef = React.createRef();
        this.firstScrollView = React.createRef();
    }

    componentDidMount = () => {
        getASingleDaysData(this.props.navigation.getParam("id", "Monday"))
        .then((data) => {
            this.setState({
                id: this.props.navigation.getParam("id", "Monday"),
                Day: data,
                date: moment().startOf('isoweek').add(theWeek.indexOf(this.props.navigation.getParam("id", "no-id")), "days").format('YYYY-MM-DD')
            })
        })
        .catch((error) => {
            this.setSnackBarTextAndIfError(error, true);
            this.toggleSnackBarVisibility();
        })

        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow,
        );
      
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide,
        );
    }

    componentWillUnmount = () => {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.navigation.getParam("id", "no-id") !== this.state.id) {
            getASingleDaysData(this.props.navigation.getParam("id", "no-id"))
            .then((data) => {
                this.setState({
                    id: this.props.navigation.getParam("id", "no-id"),
                    Day: data,
                    date: moment().startOf('isoweek').add(theWeek.indexOf(this.props.navigation.getParam("id", "no-id")), "days").format('YYYY-MM-DD')
                })
            })
            .catch((error) => {
                this.setSnackBarTextAndIfError(error, true);
                this.toggleSnackBarVisibility();
            })
        }
    }

    _keyboardDidShow = (event) => {
        if (Platform.OS == "ios") {
            this.setState({
                keyboardHeight: event.endCoordinates.height,
                keyboardOpen: true
            })
        }
    }
    
    _keyboardDidHide = () => {
        if (Platform.OS == "ios") {
            this.setState({
                keyboardHeight: 0,
                keyboardOpen: false
            })
        }
    }

    submitTaskText = (useSnackBar = true, snackBarText?) => {
            getASingleDaysData(this.state.id)
                .then((data) => {
                    this.setState({
                        Day: data
                    })
                    if (useSnackBar) {
                        this.setSnackBarTextAndIfError(snackBarText, false);
                        this.toggleSnackBarVisibility();
                    }
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

    checkTask = (taskID, isChecked) => {
        checkTask(taskID, isChecked)
        .then(() => {
            this.submitTaskText(false);
        })
        .catch((error) => {
            this.setSnackBarTextAndIfError(error, true);
            this.toggleSnackBarVisibility();
        })
    }

    deleteTask = (taskID) => {
        deleteTask(taskID)
        .then(() => {
            this.submitTaskText(true, "Task Deleted!");
        })
        .catch((error) => {
            this.setSnackBarTextAndIfError(error, true);
            this.toggleSnackBarVisibility();
        })
    }

    checkAllTasks = () => {
        checkAllTasks(this.state.id)
        .then(() => {
            this.submitTaskText(false);
        })
        .catch((error) => {
            this.setSnackBarTextAndIfError(error, true);
            this.toggleSnackBarVisibility();
        })
    }

    deleteAllTasks = () => {
        deleteAllTasks(this.state.id)
        .then(() => {
            this.submitTaskText(true, "All Tasks Deleted!");
        })
        .catch((error) => {
            this.setSnackBarTextAndIfError(error, true);
            this.toggleSnackBarVisibility();
        })
    }

    deleteNote = (noteID) => {
        deleteNote(noteID)
        .then(() => {
            this.submitTaskText(true, "Note Deleted!");
        })
        .catch((error) => {
            this.setSnackBarTextAndIfError(error, true);
            this.toggleSnackBarVisibility();
        })
    }

    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>
                <Header 
                    title={this.state.id} 
                    date={this.state.date} 
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
                        newTaskTextRef={this.newTaskTextRef}
                        newNoteTextRef={this.newNoteTextRef}
                        keyboardHeight={this.state.keyboardHeight}
                        keyboardOpen={this.state.keyboardOpen}
                        firstScrollView={this.firstScrollView}/>
                </ScrollView>
                <SnackBarPopup 
                    visibility={this.state.snackBarVisibility}
                    toggleSnackBarVisibility={this.toggleSnackBarVisibility}
                    snackBarIsError={this.state.snackBarIsError}
                    snackBarText={this.state.snackBarText} />
                <FAB style={styles.fabButton} icon="list" onPress={() => {
                    this.toggleFabButtonOptions();
                }} />
                {this.state.fabButtonClicked ? 
                <DayScreenFabButtonOptions
                    newTaskTextRef={this.newTaskTextRef}
                    checkAllTasks={this.checkAllTasks}
                    deleteAllTasks={this.deleteAllTasks}
                    Day={this.state.Day}
                    firstScrollView={this.firstScrollView}
                    toggleFabButtonOptions={this.toggleFabButtonOptions}
                 /> : null}
            </SafeAreaView>
        )}
    }

const styles = StyleSheet.create({
    mainContainer: {
        flexGrow: 1,
        flexWrap: "nowrap",
        backgroundColor: "#EDF0FF",
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
