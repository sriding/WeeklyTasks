import React, { Fragment, Component } from 'react'
import { Text, SafeAreaView, View, StyleSheet, ScrollView } from "react-native";
import { Button, Card, Title, Subheading, Paragraph, Chip } from "react-native-paper";

import { getASingleDaysData } from "./../../functionsInteractingWithRealm/getASingleDaysData";
import { addTask, updateTask, checkTask, deleteTask, checkAllTasks, deleteAllTasks } from "./../../functionsInteractingWithRealm/tasks";
import { addNote, updateNote, deleteNote } from "./../../functionsInteractingWithRealm/notes";
import theWeek from "./../../utilities/theWeek";

import Header from "./../Header/Header";

import moment from 'moment';

export default class DayScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            Day: null
        }
    }

    componentDidMount = () => {
        console.log(moment().startOf('week').add('days', 3).format('MM/DD/YYYY'));
        getASingleDaysData(this.props.navigation.getParam("id", "no-id"))
        .then((data) => {
            this.setState({
                id: this.props.navigation.getParam("id", "no-id"),
                Day: data
            })
        })
        .catch((err) => {
            console.log("There was an error");
        })
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.navigation.getParam("id", "no-id") !== this.state.id) {
            console.log("id changed");
            getASingleDaysData(this.props.navigation.getParam("id", "no-id"))
            .then((data) => {
                this.setState({
                    id: this.props.navigation.getParam("id", "no-id"),
                    Day: data
                })
            })
        }
    }

    addTask = (text, dayID) => {
        addTask(text, dayID);
    }

    updateTask = (text, taskID) => {
        updateTask(text, taskID);
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
                <Header title={this.state.id} date={moment().startOf('week').add('days', theWeek[this.state.id]).format('MM/DD/YYYY')} navigation={this.props.navigation}/>
                <ScrollView contentContainerStyle={styles.cardContainerViewContainer} showsVerticalScrollIndicator={false}>
                    <Card style={styles.cardContainer}>
                        <Card.Content>
                            <Button mode="contained" style={styles.subHeadingText}>Tasks</Button>
                            {this.state.Day && this.state.Day.tasks.map((task) => {
                                return (
                                    <Fragment key={task.id}>
                                        <Paragraph style={styles.paragraphText}>{`\u2022 ${task.text}`}</Paragraph>
                                        <View style={styles.buttonCombiner}>
                                            <Button style={styles.buttonStyle} icon="check-circle" onPress={() => {
                                                checkTask(task.id)
                                            }}>Check</Button>
                                            <Button style={styles.buttonStyle} icon="highlight-off" onPress={() => {
                                                deleteTask(task.id)
                                            }}>Delete</Button>
                                        </View>
                                    </Fragment>
                                )
                            })}
                        </Card.Content>
                        <Card.Content>
                            <Button mode="contained" style={styles.subHeadingText}>Note</Button>
                            <Paragraph style={styles.paragraphText}>{this.state.Day && `\u2022 ${this.state.Day.note.text}`}</Paragraph>
                            <Button mode="outlined" compact={true} style={styles.buttonStyle} icon="highlight-off" onPress={() => {
                                deleteNote(this.state.Day.note.id);
                            }}>Delete</Button>
                        </Card.Content>
                        <Card.Content style={styles.chipStyles}>
                            <Chip textStyle={{color: "white"}} style={{backgroundColor: "#4d4dff"}}icon="done" onPress={() => {
                                checkAllTasks(this.state.Day.tasks)
                            }}>Check All</Chip>
                            <Chip icon="not-interested" onPress={() => {
                                deleteAllTasks(this.state.Day.tasks)
                            }}>Delete All</Chip>
                        </Card.Content>
                    </Card>
                </ScrollView>
            </SafeAreaView>
        )}
    }

const styles = StyleSheet.create({
    mainContainer: {
        flexGrow: 1,
        flexWrap: "nowrap",
        backgroundColor: "#EDF0FF",
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
    cardContainer: {
        alignItems: "center",
        textAlign: "center",
        maxWidth: "85%",
        minHeight: "90%",
        marginTop: 20,
        shadowColor: "#000000",
        shadowRadius: 4,
        shadowOffset: {
          width: 0,
          height: 3
        },
    },
    buttonCombiner: {
        flexDirection: "row",
        alignContent: "center",
        marginBottom: 20,
        marginTop: 5
    },
    buttonStyle: {
        width: 100,
    },
    headingText: {
        maxWidth: "100%"
    },
    subHeadingText: {
        maxWidth: 130,
        marginTop: 5,
        marginBottom: 25,
    },
    paragraphText: {
        fontSize: 19,
        lineHeight: 30,
        marginBottom: 3
    },
    chipStyles: {
        position: "absolute",
        bottom: 100,
        maxHeight: 50
    }
});
