import React, { Fragment, Component } from 'react'
import { Text, SafeAreaView, View, StyleSheet, ScrollView } from "react-native";
import { Button, Card, Title, Subheading, Paragraph, Chip } from "react-native-paper";

import { getASingleDaysData } from "./../../functionsInteractingWithRealm/getASingleDaysData";
import { addTask, updateTask, checkTask, deleteTask, checkAllTasks, deleteAllTasks } from "./../../functionsInteractingWithRealm/tasks";
import { addNote, updateNote, deleteNote } from "./../../functionsInteractingWithRealm/notes";

import Header from "./../Header/Header";

export default class DayScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount = () => {
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
                <Header title={this.state.id} navigation={this.props.navigation}/>
                <ScrollView contentContainerStyle={styles.cardContainerViewContainer} showsVerticalScrollIndicator={false}>
                    <Card style={styles.cardContainer}>
                        <Card.Content>
                            <Button mode="outlined" style={styles.subHeadingText}>Tasks</Button>
                            {this.state.Day && this.state.Day.tasks.map((task) => {
                                return (
                                    <Fragment key={task.id}>
                                        <Paragraph style={styles.paragraphText}>{task.text}</Paragraph>
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
                            <Button mode="outlined" style={styles.subHeadingText}>Note</Button>
                            <Paragraph style={styles.paragraphText}>{this.state.Day && this.state.Day.note.text}</Paragraph>
                            <Button style={styles.buttonStyle} icon="highlight-off" onPress={() => {
                                deleteNote(this.state.Day.note.id);
                            }}>Delete</Button>
                        </Card.Content>
                        <Card.Content style={styles.chipStyles}>
                            <Chip icon="done" onPress={() => {
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
        marginTop: 10
    },
    buttonStyle: {
        width: 100,
        marginBottom: 20,
        marginTop: 10
    },
    headingText: {
        maxWidth: "100%"
    },
    subHeadingText: {
        maxWidth: 130,
        marginTop: 5,
        marginBottom: 10,
    },
    paragraphText: {
        fontSize: 20,
        marginTop: 20
    },
    chipStyles: {
        position: "relative",
        flexGrow: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        maxHeight: 50
    }
});
