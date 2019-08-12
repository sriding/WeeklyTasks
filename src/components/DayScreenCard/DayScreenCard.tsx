import React, { Component, Fragment } from 'react'
import { StyleSheet ,Text, View, Dimensions, ScrollView } from 'react-native'

import { Card, Button, TextInput, Paragraph } from 'react-native-paper';

import { addTask, updateTask } from "./../../functionsInteractingWithRealm/tasks";

import UpdateTaskDialog from './../UpdateTaskDialog/UpdateTaskDialog';
import UpdateNoteDialog from "./../UpdateNoteDialog/UpdateNoteDialog";
import { addNote, updateNote } from '../../functionsInteractingWithRealm/notes';

interface DayObject {
    id: string,
    tasks: {id: number, day: string, text: string, isChecked: boolean}[],
    note: {
        id: number,
        text: string
    }
}

interface AppProps {
    Day: DayObject,
    checkTask: (taskID: number, isChecked: boolean) => void,
    deleteTask: (taskID: number) => void,
    deleteNote: (noteID: number) => void,
    submitTaskText: (useSnackBar: boolean, snackBarText?: string) => void,
    id: string
    newTaskTextRef: React.RefObject<TextInput>,
    newNoteTextRef: React.RefObject<TextInput>,
    firstScrollView: React.RefObject<ScrollView>,
    keyboardHeight: number,
    keyboardOpen: boolean

}

interface AppState {
    newTaskText: string,
    newNoteText: string,
    newTaskTextError: boolean,
    newNoteTextError: boolean,
    newTaskTextErrorText: string,
    newNoteTextErrorText: string,
    updateTaskTextError: boolean,
    updateNoteTextError: boolean,
    updateTaskTextErrorText: string,
    updateNoteTextErrorText: string,
    updateTaskTextState: {
        text: string,
        taskID: number
    },
    updateNoteTextState: {
        text: string,
        noteID: number
    },
    updateTaskDialogVisible: boolean,
    updateNoteDialogVisible: boolean,
    paddingBottom: number

}
export default class DayScreenCard extends Component<AppProps, AppState> {
    protected taskTextRef: React.RefObject<HTMLInputElement>
    protected newNoteScrollViewRef: React.RefObject<ScrollView>
    protected updateTaskTextRef: React.RefObject<TextInput>
    protected updateNoteTextRef: React.RefObject<TextInput>

    constructor(props: AppProps) {
        super(props);
        this.state = {
            newTaskText: "",
            newNoteText: "",
            newTaskTextError: false,
            newNoteTextError: false,
            newTaskTextErrorText: "",
            newNoteTextErrorText: "",
            updateTaskTextError: false,
            updateNoteTextError: false,
            updateTaskTextErrorText: "",
            updateNoteTextErrorText: "",
            updateTaskTextState: {
                text: "",
                taskID: -1
            },
            updateNoteTextState: {
                text: "",
                noteID: -1
            },
            updateTaskDialogVisible: false,
            updateNoteDialogVisible: false,
            paddingBottom: 175
        }

        this.taskTextRef = React.createRef();
        this.newNoteScrollViewRef = React.createRef();
        this.updateTaskTextRef = React.createRef();
        this.updateNoteTextRef = React.createRef();
    }

    clearTaskText = () => {
        addTask(this.state.newTaskText, this.props.id)
        .then(() => {
            this.props.submitTaskText(true, "Task Created!");
        })
        .then(() => {
            this.props.newTaskTextRef.current!.blur();
            setTimeout(() => {
                this.setState({
                    newTaskText: "",
                    newTaskTextError: false,
                    newTaskTextErrorText: "",
                })
            }, 800)
        })
        .catch((error: string) => {
            this.setState({
                newTaskTextError: true,
                newTaskTextErrorText: error,
            })
            setTimeout(() => {
                this.setState({
                    newTaskText: ""
                })
            }, 800)
        })
    }

    clearNoteText = () => {
        addNote(this.state.newNoteText, this.state.updateNoteTextState.noteID)
        .then(() => {
            this.props.submitTaskText(true, "Note Created!");
        })
        .then(() => {
            setTimeout(() => {
                this.setState({
                    newNoteText: "",
                    newNoteTextError: false,
                    newNoteTextErrorText: ""
                })
            }, 800)
        })
        .catch((error: string) => {
            this.setState({
                newNoteTextError: true,
                newNoteTextErrorText: error
            })
            setTimeout(() => {
                this.setState({
                    newNoteText: ""
                })
            }, 800)
        })
    }

    updateTaskText = () => {
        updateTask(this.state.updateTaskTextState.text, this.state.updateTaskTextState.taskID)
        .then(() => {
            this.props.submitTaskText(true, "Task Updated!");
            this.setState({
                updateTaskTextError: false,
                updateTaskTextErrorText: ""
            })
            this.dismissTaskDialog();
        })
        .catch((error: string) => {
            this.setState({
                updateTaskTextError: true,
                updateTaskTextErrorText: error
            })
        })
    }

    updateNoteText = () => {
        updateNote(this.state.updateNoteTextState.text, this.state.updateNoteTextState.noteID)
        .then(() => {
            this.props.submitTaskText(true, "Note Updated!");
            this.setState({
                updateNoteTextError: false,
                updateNoteTextErrorText: ""
            })
            this.dismissNoteDialog();
        })
        .catch((error: string) => {
            this.setState({
                updateNoteTextError: true,
                updateNoteTextErrorText: error
            })
        })
    }

    updatingUpdateTaskTextState = (text: string, taskID: number) => {
        this.setState({
            updateTaskTextState: {
                text,
                taskID
            }
        })
    }

    updatingUpdateNoteTextState = (text: string, noteID: number) => {
        this.setState({
            updateNoteTextState: {
                text,
                noteID
            }
        })
    }

    dismissTaskDialog = () => {
        this.setState({
            updateTaskDialogVisible: false,
            updateTaskTextError: false,
            updateTaskTextErrorText: ""
        })
    }

    dismissNoteDialog = () => {
        this.setState({
            updateNoteDialogVisible: false,
            updateNoteTextError: false,
            updateNoteTextErrorText: ""
        })
    }

    render() {
        return (
        <Fragment>
            <Card style={{...styles.cardContainer, paddingBottom: this.state.paddingBottom}}>
                <Card.Content>
                    <Button mode="contained" style={styles.subHeadingText}>Tasks</Button>
                    {this.state.newTaskTextError ? <Paragraph style={{color: "#C00000"}}>
                        {this.state.newTaskTextErrorText}
                    </Paragraph> : null}
                    <View style={styles.addTaskEntry}>
                        <Text style={styles.plusSign}>{"\u002B"}</Text>
                        <TextInput style={styles.newTaskInput}
                            ref={this.props.newTaskTextRef}
                            label="New Task"
                            mode="flat"
                            error={this.state.newTaskTextError}
                            multiline={true}
                            value={this.state.newTaskText}
                            returnKeyType="done"
                            onChangeText={text => {
                                this.setState({
                                    newTaskText: text
                                })
                            }}
                            onKeyPress={(e) => {
                                if(e.nativeEvent.key == "Enter"){
                                    this.clearTaskText();
                                }
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
                        }}>{this.props.Day && this.props.Day.note.text}</Paragraph>
                        <Button mode="outlined" color="#C00000" style={styles.buttonStyleNote} icon="highlight-off" onPress={() => {
                            this.props.deleteNote(this.props.Day.note.id);
                            this.setState({
                                newNoteText: ""
                            })
                        }}>Delete</Button>
                    </Fragment> : 
                    <Fragment>
                    {this.state.newNoteTextError ? <Paragraph style={{color: "#C00000"}}>
                        {this.state.newNoteTextErrorText}
                    </Paragraph> : null}
                    <View style={styles.addTaskEntry}>
                        <Text style={styles.plusSign}>{"\u002B"}</Text>
                        <TextInput style={styles.newTaskInput}
                            ref={this.props.newNoteTextRef}
                            label="New Note"
                            mode="flat"
                            multiline={true}
                            error={this.state.newNoteTextError}
                            value={this.state.newNoteText}
                            returnKeyType="done"
                            onChangeText={text => {
                                this.setState({
                                    newNoteText: text
                                })
                            }}
                            onFocus={() => {
                                this.setState({
                                    updateTaskTextError: false,
                                    updateTaskTextErrorText: "",
                                    updateNoteTextState: {
                                        text: this.props.Day.note.text,
                                        noteID: this.props.Day.note.id,
                                    },
                                    paddingBottom: 250
                                })
                                setTimeout(() => {
                                    this.props.firstScrollView.current!.scrollTo({x: 0, y: Dimensions.get("window").height})
                                }, 300)
                            }}
                            onKeyPress={(e) => {
                                if(e.nativeEvent.key == "Enter"){
                                    this.clearNoteText();
                                }
                            }}
                            onBlur={() => {
                                this.setState({
                                    paddingBottom: 175
                                })
                            }}
                            onSubmitEditing={this.clearNoteText}
                        ></TextInput>                   
                    </View>
                </Fragment>
                }
                </Card.Content>
            </Card>
            <UpdateTaskDialog 
                updateTaskDialogVisible={this.state.updateTaskDialogVisible}
                dismissTaskDialog={this.dismissTaskDialog}
                updateTaskText={this.updateTaskText}
                updateTaskTextState={this.state.updateTaskTextState}
                updatingUpdateTaskTextState={this.updatingUpdateTaskTextState}
                updateTaskTextError={this.state.updateTaskTextError}
                updateTaskTextErrorText={this.state.updateTaskTextErrorText}
                keyboardHeight={this.props.keyboardHeight}
                keyboardOpen={this.props.keyboardOpen}
                updateTaskTextRef={this.updateTaskTextRef}/>
            <UpdateNoteDialog 
                updateNoteDialogVisible={this.state.updateNoteDialogVisible}
                dismissNoteDialog={this.dismissNoteDialog}
                updateNoteText={this.updateNoteText}
                updateNoteTextState={this.state.updateNoteTextState}
                updatingUpdateNoteTextState={this.updatingUpdateNoteTextState}
                updateNoteTextError={this.state.updateNoteTextError}
                updateNoteTextErrorText={this.state.updateNoteTextErrorText}
                keyboardHeight={this.props.keyboardHeight}
                keyboardOpen={this.props.keyboardOpen}
                updateNoteTextRef={this.updateNoteTextRef}/>
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
        elevation: 3,
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
        maxHeight: 125
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