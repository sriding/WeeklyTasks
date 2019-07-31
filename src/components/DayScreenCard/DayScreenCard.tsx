import React, { Component, Fragment } from 'react'
import { StyleSheet ,Text, View, TextInput as NativeTextInput} from 'react-native'

import { Card, Button, TextInput, Paragraph } from 'react-native-paper';

import { addTask, updateTask } from "./../../functionsInteractingWithRealm/tasks";

import UpdateTaskDialog from './../UpdateTaskDialog/UpdateTaskDialog';
import UpdateNoteDialog from "./../UpdateNoteDialog/UpdateNoteDialog";
import { addNote, updateNote } from '../../functionsInteractingWithRealm/notes';

export default class DayScreenCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newTaskText: "",
            newNoteText: "",
            updateTaskTextState: {
                text: "",
                taskID: null
            },
            updateNoteTextState: {
                text: "",
                noteID: null
            },
            updateTaskDialogVisible: false,
            updateNoteDialogVisible: false
        }

        this.taskTextRef = React.createRef();
    }

    clearTaskText = () => {
        addTask(this.state.newTaskText, this.props.id)
        .then(() => {
            this.props.submitTaskText();
        })
        .then(() => {
            this.props.newTaskTextRef.current.blur();
            setTimeout(() => {
                this.setState({
                    newTaskText: ""
                })
            }, 800)
        })
        .catch((error) => {
            console.log(error);
        })
    }

    clearNoteText = () => {
        addNote(this.state.newNoteText, this.state.updateNoteTextState.noteID)
        .then(() => {
            this.props.submitTaskText();
        })
        .then(() => {
            setTimeout(() => {
                this.setState({
                    newNoteText: ""
                })
            }, 800)
        })
        .catch((error) => {
            console.log(error);
        })
    }

    updateTaskText = () => {
        updateTask(this.state.updateTaskTextState.text, this.state.updateTaskTextState.taskID)
        .then(() => {
            this.props.submitTaskText();
        })
        .catch((error) => {
            console.log(error);
        })
    }

    updateNoteText = () => {
        updateNote(this.state.updateNoteTextState.text, this.state.updateNoteTextState.noteID)
        .then(() => {
            this.props.submitTaskText();
        })
        .catch((error) => {
            console.log(error);
        })
    }

    updatingUpdateTaskTextState = (text, taskID) => {
        this.setState({
            updateTaskTextState: {
                text,
                taskID
            }
        })
    }

    updatingUpdateNoteTextState = (text, noteID) => {
        console.log(noteID);
        this.setState({
            updateNoteTextState: {
                text,
                noteID
            }
        })
    }

    dismissTaskDialog = () => {
        this.setState({
            updateTaskDialogVisible: false
        })
    }

    dismissNoteDialog = () => {
        this.setState({
            updateNoteDialogVisible: false
        })
    }

    render() {
        return (
            <Fragment>
            <Card style={styles.cardContainer}>
                <Card.Content>
                    <Button mode="contained" style={styles.subHeadingText}>Tasks</Button>
                    <View style={styles.addTaskEntry}>
                        <Text style={styles.plusSign}>{"\u002B"}</Text>
                        <TextInput style={styles.newTaskInput}
                            ref={this.props.newTaskTextRef}
                            label="New Task"
                            mode="flat"
                            multiline={true}
                            numberOfLines={4}
                            value={this.state.newTaskText}
                            onChangeText={text => {
                                this.setState({
                                    newTaskText: text
                                })
                            }}
                            onSubmitEditing={this.clearTaskText}
                        ></TextInput>
                    </View>
                    {this.props.Day && this.props.Day.tasks.map((task) => {
                        { return (task.isChecked ? 
                            <View key={task.id}>
                            <Paragraph
                                style={styles.paragraphTextStrikethrough}
                                onPress={(target) => {
                                    this.setState({
                                        updateTaskTextState: {
                                            text: task.text,
                                            taskID: task.id
                                        },
                                        updateTaskDialogVisible: true
                                    })
                                }}>{task.text}
                            </Paragraph>
                            <View style={styles.buttonCombiner}>
                                <Button mode="outlined" style={styles.buttonStyle} icon="check-circle" onPress={() => {
                                    this.props.checkTask(task.id, task.isChecked)
                                }}>Check</Button>
                                <Button mode="outlined" style={styles.buttonStyle} color="#C00000" icon="highlight-off" onPress={() => {
                                    this.props.deleteTask(task.id)
                                }}>Delete</Button>
                            </View>
                        </View> : 
                            <View key={task.id}>
                                <Paragraph
                                    style={styles.paragraphText}
                                    onPress={(target) => {
                                        this.setState({
                                            updateTaskTextState: {
                                                text: task.text,
                                                taskID: task.id
                                            },
                                            updateTaskDialogVisible: true
                                        })
                                    }}>{task.text}
                                </Paragraph>
                                <View style={styles.buttonCombiner}>
                                    <Button mode="outlined" style={styles.buttonStyle} icon="check-circle" onPress={() => {
                                        this.props.checkTask(task.id, task.isChecked)
                                    }}>Check</Button>
                                    <Button mode="outlined" style={styles.buttonStyle} color="#C00000" icon="highlight-off" onPress={() => {
                                        this.props.deleteTask(task.id)
                                    }}>Delete</Button>
                                </View>
                            </View>
                        )}
                    })}
                </Card.Content>
                <Card.Content>
                    <Button mode="contained" style={styles.subHeadingText}>Note</Button>
                    {this.props.Day && this.props.Day.note.text !== "" ? 
                    <Fragment>
                        <Paragraph style={styles.paragraphText}
                        onPress={() => {
                            this.updatingUpdateNoteTextState(this.props.Day.note.text, this.props.Day.note.id);
                            this.setState({
                                updateNoteDialogVisible: true
                            })
                        }}>{this.props.Day && `\u2022 ${this.props.Day.note.text}`}</Paragraph>
                        <Button mode="outlined" color="#C00000" style={styles.buttonStyleNote} icon="highlight-off" onPress={() => {
                            this.props.deleteNote(this.props.Day.note.id);
                            this.setState({
                                newNoteText: ""
                            })
                        }}>Delete</Button>
                    </Fragment> : 
                    <View style={styles.addTaskEntry}>
                        <Text style={styles.plusSign}>{"\u002B"}</Text>
                        <TextInput style={styles.newTaskInput}
                            label="New Note"
                            mode="flat"
                            multiline={true}
                            numberOfLines={4}
                            value={this.state.newNoteText}
                            onChangeText={text => {
                                this.setState({
                                    newNoteText: text
                                })
                            }}
                            onFocus={() => {
                                this.setState({
                                    updateNoteTextState: {
                                        noteID: this.props.Day.note.id
                                    }
                                })
                            }}
                            onSubmitEditing={this.clearNoteText}
                        ></TextInput>
                    </View>
                }
                </Card.Content>
            </Card>
            <UpdateTaskDialog 
                updateTaskDialogVisible={this.state.updateTaskDialogVisible}
                dismissTaskDialog={this.dismissTaskDialog}
                updateTaskText={this.updateTaskText}
                updateTaskTextState={this.state.updateTaskTextState}
                updatingUpdateTaskTextState={this.updatingUpdateTaskTextState}/>
            <UpdateNoteDialog 
                updateNoteDialogVisible={this.state.updateNoteDialogVisible}
                dismissNoteDialog={this.dismissNoteDialog}
                updateNoteText={this.updateNoteText}
                updateNoteTextState={this.state.updateNoteTextState}
                updatingUpdateNoteTextState={this.updatingUpdateNoteTextState}/>
            </Fragment>
        )
    }
}

const styles = StyleSheet.create({
    cardContainer: {
        alignItems: "center",
        textAlign: "center",
        maxWidth: "90%",
        minHeight: "90%",
        marginTop: 20,
        shadowColor: "#000000",
        shadowRadius: 4,
        shadowOffset: {
          width: 0,
          height: 3
        },
    },
    addTaskEntry: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20
    },
    plusSign: {
        width: "3%",
    },
    newTaskInput: {
        backgroundColor: "white",
        width: "90%",
    },
    buttonCombiner: {
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "space-around",
        marginBottom: 20,
        marginTop: 9
    },
    buttonStyle: {
        width: 100,
        borderRadius: 30
    },
    buttonStyleNote: {
        width: 100,
        borderRadius: 30,
        marginBottom: 20,
        marginTop: 9
    },
    subHeadingText: {
        maxWidth: 130,
        marginTop: 15,
        marginBottom: 25,
    },
    paragraphText: {
        marginBottom: 15,
        backgroundColor: "white",
        fontSize: 19
    },
    paragraphTextStrikethrough: {
        marginBottom: 15,
        backgroundColor: "white",
        fontSize: 19,
        textDecorationLine: "line-through",
        textDecorationStyle: "solid"
    }
})