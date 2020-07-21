import React, { Component, Fragment } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Platform,
  TouchableHighlight,
} from "react-native";

import {
  Card,
  Button,
  TextInput,
  Paragraph,
  Checkbox,
  Caption,
  Menu,
  Divider,
} from "react-native-paper";

import {
  addTask,
  updateTask,
} from "./../../functionsInteractingWithRealm/tasks";

import UpdateTaskDialog from "./../UpdateTaskDialog/UpdateTaskDialog";
import UpdateNoteDialog from "./../UpdateNoteDialog/UpdateNoteDialog";
import SetReminder from "./../SetReminder/SetReminder";
import { addNote, updateNote } from "../../functionsInteractingWithRealm/notes";

interface DayObject {
  id: string;
  tasks: { id: number; day: string; text: string; isChecked: boolean }[];
  note: {
    id: number;
    text: string;
  };
}

interface AppProps {
  Day: DayObject;
  checkTask: (taskID: number, isChecked: boolean) => void;
  deleteTask: (taskID: number) => void;
  deleteNote: (noteID: number) => void;
  submitTaskText: (useSnackBar: boolean, snackBarText?: string) => void;
  id: string;
  newTaskTextRef: React.RefObject<TextInput>;
  newNoteTextRef: React.RefObject<TextInput>;
  firstScrollView: React.RefObject<ScrollView>;
  keyboardHeight: number;
  keyboardOpen: boolean;
  theme: string;
}

interface AppState {
  newTaskText: string;
  newNoteText: string;
  newTaskTextError: boolean;
  newNoteTextError: boolean;
  newTaskTextErrorText: string;
  newNoteTextErrorText: string;
  updateTaskTextError: boolean;
  updateNoteTextError: boolean;
  updateTaskTextErrorText: string;
  updateNoteTextErrorText: string;
  updateTaskTextState: {
    text: string;
    taskID: number;
  };
  updateNoteTextState: {
    text: string;
    noteID: number;
  };
  updateTaskDialogVisible: boolean;
  updateNoteDialogVisible: boolean;
  paddingBottom: number;
  menuVisibility: boolean;
  reminder: boolean;
  reminderTime: string;
}
export default class DayScreenCard extends Component<AppProps, AppState> {
  protected taskTextRef: React.RefObject<HTMLInputElement>;
  protected newNoteScrollViewRef: React.RefObject<ScrollView>;
  protected updateTaskTextRef: React.RefObject<TextInput>;
  protected updateNoteTextRef: React.RefObject<TextInput>;

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
        taskID: -1,
      },
      updateNoteTextState: {
        text: "",
        noteID: -1,
      },
      updateTaskDialogVisible: false,
      updateNoteDialogVisible: false,
      paddingBottom: 175,
      menuVisibility: false,
      reminder: true,
      reminderTime: "12:00 PM",
    };

    this.taskTextRef = React.createRef();
    this.newNoteScrollViewRef = React.createRef();
    this.updateTaskTextRef = React.createRef();
    this.updateNoteTextRef = React.createRef();
  }

  clearTaskText = () => {
    addTask(
      this.state.newTaskText,
      this.props.id,
      this.state.reminder,
      this.state.reminderTime
    )
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
          });
        }, 800);
      })
      .catch((error: string) => {
        this.setState({
          newTaskTextError: true,
          newTaskTextErrorText: error,
        });
        setTimeout(() => {
          this.setState({
            newTaskText: "",
          });
        }, 800);
      });
  };

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
            newNoteTextErrorText: "",
          });
        }, 800);
      })
      .catch((error: string) => {
        this.setState({
          newNoteTextError: true,
          newNoteTextErrorText: error,
        });
        setTimeout(() => {
          this.setState({
            newNoteText: "",
          });
        }, 800);
      });
  };

  updateTaskText = () => {
    updateTask(
      this.state.updateTaskTextState.text,
      this.state.updateTaskTextState.taskID,
      this.state.reminder,
      this.state.reminderTime
    )
      .then(() => {
        this.props.submitTaskText(true, "Task Updated!");
        this.setState({
          updateTaskTextError: false,
          updateTaskTextErrorText: "",
        });
        this.dismissTaskDialog();
      })
      .catch((error: string) => {
        this.setState({
          updateTaskTextError: true,
          updateTaskTextErrorText: error,
        });
      });
  };

  updateNoteText = () => {
    updateNote(
      this.state.updateNoteTextState.text,
      this.state.updateNoteTextState.noteID
    )
      .then(() => {
        this.props.submitTaskText(true, "Note Updated!");
        this.setState({
          updateNoteTextError: false,
          updateNoteTextErrorText: "",
        });
        this.dismissNoteDialog();
      })
      .catch((error: string) => {
        this.setState({
          updateNoteTextError: true,
          updateNoteTextErrorText: error,
        });
      });
  };

  updatingUpdateTaskTextState = (text: string, taskID: number) => {
    this.setState({
      updateTaskTextState: {
        text,
        taskID,
      },
    });
  };

  updatingUpdateNoteTextState = (text: string, noteID: number) => {
    this.setState({
      updateNoteTextState: {
        text,
        noteID,
      },
    });
  };

  dismissTaskDialog = () => {
    this.setState({
      updateTaskDialogVisible: false,
      updateTaskTextError: false,
      updateTaskTextErrorText: "",
    });
  };

  dismissNoteDialog = () => {
    this.setState({
      updateNoteDialogVisible: false,
      updateNoteTextError: false,
      updateNoteTextErrorText: "",
    });
  };

  changeReminderTime = (reminderTime: string) => {
    this.setState({
      reminder: reminderTime === "N/A" ? false : true,
      reminderTime,
    });
  };

  render() {
    return (
      <Fragment>
        <Card
          style={{
            ...styles.cardContainer,
            paddingBottom: this.state.paddingBottom,
          }}
        >
          <Card.Content>
            <Button mode="contained" style={styles.subHeadingText}>
              Tasks
            </Button>
            <SetReminder
              reminder={this.state.reminder}
              reminderTime={this.state.reminderTime}
              changeReminderTime={this.changeReminderTime}
              text="New Task Reminder Time: "
            />
            {this.state.newTaskTextError ? (
              <Paragraph style={{ color: "#C00000" }}>
                {this.state.newTaskTextErrorText}
              </Paragraph>
            ) : null}
            <View style={styles.addTaskEntry}>
              {this.props.theme === "light" ? (
                <Text style={styles.plusSign}>{"\u002B"}</Text>
              ) : (
                <Text style={styles.plusSign}></Text>
              )}
              <TextInput
                style={{
                  ...styles.newTaskInput,
                  backgroundColor:
                    this.props.theme === "light" ? "white" : "#171617",
                }}
                ref={this.props.newTaskTextRef}
                label="New Task"
                mode="flat"
                error={this.state.newTaskTextError}
                multiline={true}
                value={this.state.newTaskText}
                returnKeyType="done"
                selectionColor={
                  this.props.theme === "light" ? "black" : "white"
                }
                placeholderTextColor={
                  this.props.theme === "light" ? "gray" : "white"
                }
                onChangeText={(text) => {
                  this.setState({
                    newTaskText: text,
                  });
                }}
                onKeyPress={(e) => {
                  if (e.nativeEvent.key == "Enter" && Platform.OS != "ios") {
                    this.clearTaskText();
                  } else if (e.nativeEvent.key == "Enter") {
                    this.props.newTaskTextRef.current!.blur();
                  }
                }}
                onSubmitEditing={this.clearTaskText}
                theme={
                  Platform.OS == "ios"
                    ? this.props.theme === "light"
                      ? {}
                      : { colors: { text: "white", primary: "white" } }
                    : this.props.theme === "light"
                    ? {}
                    : Dimensions.get("window").width >
                      Dimensions.get("window").height
                    ? { colors: { text: "gray", primary: "white" } }
                    : { colors: { text: "white", primary: "white" } }
                }
              />
            </View>
            {this.props.Day &&
              this.props.Day.tasks.map((task) => {
                {
                  return task.isChecked ? (
                    <View key={task.id}>
                      <Paragraph
                        style={{
                          ...styles.paragraphTextStrikethrough,
                          backgroundColor:
                            this.props.theme === "light" ? "white" : "#121212",
                        }}
                        onPress={(target) => {
                          this.setState({
                            updateTaskTextState: {
                              text: task.text,
                              taskID: task.id,
                            },
                            updateTaskDialogVisible: true,
                            reminder: task.reminder,
                            reminderTime:
                              task.reminder === false
                                ? "N/A"
                                : task.reminderTime,
                          });
                        }}
                      >
                        {task.text}
                      </Paragraph>
                      <View style={styles.buttonCombiner}>
                        <Button
                          mode="outlined"
                          style={styles.buttonStyle}
                          icon="check-circle"
                          color={
                            this.props.theme === "light" ? "#6200ee" : "#c2c2f0"
                          }
                          onPress={() => {
                            this.props.checkTask(task.id, task.isChecked);
                          }}
                        >
                          Check
                        </Button>
                        <Button
                          mode="outlined"
                          style={styles.buttonStyle}
                          color={
                            this.props.theme === "light" ? "#C00000" : "#ff8080"
                          }
                          icon="close-box"
                          onPress={() => {
                            this.props.deleteTask(task.id);
                          }}
                        >
                          Delete
                        </Button>
                      </View>
                    </View>
                  ) : (
                    <View key={task.id}>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <TouchableHighlight
                          onPress={() => {
                            this.setState({
                              updateTaskTextState: {
                                text: task.text,
                                taskID: task.id,
                              },
                              updateTaskDialogVisible: true,
                              reminder: task.reminder,
                              reminderTime:
                                task.reminder === false
                                  ? "N/A"
                                  : task.reminderTime,
                            });
                          }}
                        >
                          <Checkbox
                            status={task.reminder ? "checked" : "unchecked"}
                          />
                        </TouchableHighlight>
                        <TouchableHighlight
                          onPress={() => {
                            this.setState({
                              updateTaskTextState: {
                                text: task.text,
                                taskID: task.id,
                              },
                              updateTaskDialogVisible: true,
                              reminder: task.reminder,
                              reminderTime:
                                task.reminder === false
                                  ? "N/A"
                                  : task.reminderTime,
                            });
                          }}
                        >
                          <Caption style={styles.captionText}>
                            {task.reminder
                              ? `Reminder set for: ${task.reminderTime}`
                              : "No Reminder set"}
                          </Caption>
                        </TouchableHighlight>
                      </View>
                      <Paragraph
                        style={{
                          ...styles.paragraphText,
                          backgroundColor:
                            this.props.theme === "light" ? "white" : "#121212",
                        }}
                        onPress={(target) => {
                          this.setState({
                            updateTaskTextState: {
                              text: task.text,
                              taskID: task.id,
                            },
                            updateTaskDialogVisible: true,
                            reminder: task.reminder,
                            reminderTime:
                              task.reminder === false
                                ? "N/A"
                                : task.reminderTime,
                          });
                        }}
                      >
                        {task.text}
                      </Paragraph>
                      <View style={styles.buttonCombiner}>
                        <Button
                          mode="outlined"
                          style={styles.buttonStyle}
                          icon="check-circle"
                          color={
                            this.props.theme === "light" ? "#6200ee" : "#c2c2f0"
                          }
                          onPress={() => {
                            this.props.checkTask(task.id, task.isChecked);
                          }}
                        >
                          Check
                        </Button>
                        <Button
                          mode="outlined"
                          style={styles.buttonStyle}
                          color={
                            this.props.theme === "light" ? "#C00000" : "#ff8080"
                          }
                          icon="close-box"
                          onPress={() => {
                            this.props.deleteTask(task.id);
                          }}
                        >
                          Delete
                        </Button>
                      </View>
                    </View>
                  );
                }
              })}
          </Card.Content>
          <Card.Content>
            <Button mode="contained" style={styles.subHeadingText}>
              Note
            </Button>
            {this.props.Day && this.props.Day.note.text !== "" ? (
              <Fragment>
                <Paragraph
                  style={{
                    ...styles.paragraphText,
                    backgroundColor:
                      this.props.theme === "light" ? "white" : "#121212",
                  }}
                  onPress={() => {
                    this.updatingUpdateNoteTextState(
                      this.props.Day.note.text,
                      this.props.Day.note.id
                    );
                    this.setState({
                      updateNoteDialogVisible: true,
                    });
                  }}
                >
                  {this.props.Day && this.props.Day.note.text}
                </Paragraph>
                <Button
                  mode="outlined"
                  color={this.props.theme === "light" ? "#C00000" : "#ff8080"}
                  style={styles.buttonStyleNote}
                  icon="close-box"
                  onPress={() => {
                    this.props.deleteNote(this.props.Day.note.id);
                    this.setState({
                      newNoteText: "",
                    });
                  }}
                >
                  Delete
                </Button>
              </Fragment>
            ) : (
              <Fragment>
                {this.state.newNoteTextError ? (
                  <Paragraph style={{ color: "#C00000" }}>
                    {this.state.newNoteTextErrorText}
                  </Paragraph>
                ) : null}
                <View style={styles.addTaskEntry}>
                  {this.props.theme === "light" ? (
                    <Text style={styles.plusSign}>{"\u002B"}</Text>
                  ) : (
                    <Text style={styles.plusSign}></Text>
                  )}
                  <TextInput
                    style={{
                      ...styles.newTaskInput,
                      backgroundColor:
                        this.props.theme === "light" ? "white" : "#171617",
                    }}
                    ref={this.props.newNoteTextRef}
                    label="New Note"
                    mode="flat"
                    multiline={true}
                    error={this.state.newNoteTextError}
                    value={this.state.newNoteText}
                    selectionColor={
                      this.props.theme === "light" ? "black" : "white"
                    }
                    placeholderTextColor={
                      this.props.theme === "light" ? "gray" : "white"
                    }
                    returnKeyType="done"
                    onChangeText={(text) => {
                      this.setState({
                        newNoteText: text,
                      });
                    }}
                    onFocus={() => {
                      this.setState({
                        updateTaskTextError: false,
                        updateTaskTextErrorText: "",
                        updateNoteTextState: {
                          text: this.props.Day.note.text,
                          noteID: this.props.Day.note.id,
                        },
                        paddingBottom: 250,
                      });
                      setTimeout(() => {
                        this.props.firstScrollView.current!.scrollTo({
                          x: 0,
                          y: Dimensions.get("window").height - 20,
                        });
                      }, 300);
                    }}
                    onKeyPress={(e) => {
                      if (
                        e.nativeEvent.key == "Enter" &&
                        Platform.OS != "ios"
                      ) {
                        this.clearNoteText();
                      } else if (e.nativeEvent.key == "Enter") {
                        this.props.newNoteTextRef.current!.blur();
                      }
                    }}
                    onBlur={() => {
                      this.setState({
                        paddingBottom: 175,
                      });
                    }}
                    theme={
                      Platform.OS == "ios"
                        ? this.props.theme === "light"
                          ? {}
                          : { colors: { text: "white", primary: "white" } }
                        : this.props.theme === "light"
                        ? {}
                        : Dimensions.get("window").width >
                          Dimensions.get("window").height
                        ? { colors: { text: "gray", primary: "white" } }
                        : { colors: { text: "white", primary: "white" } }
                    }
                    onSubmitEditing={this.clearNoteText}
                  ></TextInput>
                </View>
              </Fragment>
            )}
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
          updateTaskTextRef={this.updateTaskTextRef}
          reminder={this.state.reminder}
          reminderTime={this.state.reminderTime}
          changeReminderTime={this.changeReminderTime}
          theme={this.props.theme}
        />
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
          updateNoteTextRef={this.updateNoteTextRef}
          theme={this.props.theme}
        />
      </Fragment>
    );
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
      height: 3,
    },
  },
  addTaskEntry: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  plusSign: {
    width: "3%",
  },
  newTaskInput: {
    width: "90%",
    maxHeight: 125,
  },
  buttonCombiner: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-around",
    marginBottom: 20,
    marginTop: 9,
  },
  buttonStyle: {
    width: 100,
    borderRadius: 30,
  },
  buttonStyleNote: {
    width: 100,
    borderRadius: 30,
    marginBottom: 20,
    marginTop: 9,
  },
  subHeadingText: {
    maxWidth: 130,
    marginTop: 15,
    marginBottom: 25,
  },
  paragraphText: {
    marginBottom: 15,
    fontSize: 19,
    paddingTop: 10,
  },
  paragraphTextStrikethrough: {
    marginBottom: 15,
    fontSize: 19,
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
  },
  captionText: {
    fontSize: 15,
  },
});
