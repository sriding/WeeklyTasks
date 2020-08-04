//Core React and React Native modules
import React, { Component, Fragment } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Platform,
  TouchableHighlight,
  Keyboard,
  TextInput as NativeTextInput,
} from "react-native";

//React Native Paper modules
import {
  Card,
  Button,
  TextInput,
  Paragraph,
  Checkbox,
  Caption,
  IconButton,
} from "react-native-paper";

//Interfaces
import { AppProps, AppState } from "./DayScreenCard.interface";

//Functions
import { addTask, updateTask } from "../../controllers/database/Tasks/tasks";
import { addNote, updateNote } from "../../controllers/database/Notes/notes";
import UpdateTaskDialog from "./../UpdateTaskDialog/UpdateTaskDialog";
import UpdateNoteDialog from "./../UpdateNoteDialog/UpdateNoteDialog";

//Components
import SetReminder from "./../SetReminder/SetReminder";

export default class DayScreenCard extends Component<AppProps, AppState> {
  taskTextRef: React.RefObject<HTMLInputElement>;
  newNoteScrollViewRef: React.RefObject<ScrollView>;
  updateTaskTextRef: React.RefObject<NativeTextInput>;
  updateNoteTextRef: React.RefObject<NativeTextInput>;
  onBlurSubscription: any;

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
    this.onBlurSubscription = null;
  }

  clearTaskText = async (): Promise<void> => {
    try {
      let expectVoid: void = await addTask(
        this.state.newTaskText,
        this.props.id,
        this.state.reminder,
        this.state.reminderTime
      );
      if (expectVoid !== undefined && expectVoid !== null) {
        throw expectVoid;
      }
      await this.props.submitTaskText(true, "Task Created!");
      this.props.newTaskTextRef.current!.blur();

      //Why is there a timeout here again?
      setTimeout(() => {
        this.setState({
          newTaskText: "",
          newTaskTextError: false,
          newTaskTextErrorText: "",
        });
      }, 800);
    } catch (err) {
      this.setState({
        newTaskTextError: true,
        newTaskTextErrorText: err.replace(/[^:]*/, "").replace(/[}:"]/g, ""),
      });
      setTimeout(() => {
        this.setState({
          newTaskText: "",
        });
      }, 800);
    }
  };

  clearNoteText = async () => {
    try {
      Keyboard.dismiss();
      let expectVoidOrString: void | string = await addNote(
        this.state.newNoteText,
        this.state.updateNoteTextState.noteID
      );
      if (expectVoidOrString && typeof expectVoidOrString !== "string") {
        throw expectVoidOrString;
      }

      await this.props.submitTaskText(true, "Note Created!");

      //Timeout?
      setTimeout(() => {
        this.setState({
          newNoteText: "",
          newNoteTextError: false,
          newNoteTextErrorText: "",
        });
      }, 800);
    } catch (err) {
      this.setState({
        newNoteTextError: true,
        newNoteTextErrorText: err,
      });
      setTimeout(() => {
        this.setState({
          newNoteText: "",
        });
      }, 800);
    }
  };

  updateTaskText = async (): Promise<void> => {
    try {
      let expectVoid: void = await updateTask(
        this.state.updateTaskTextState.text,
        this.state.updateTaskTextState.taskID,
        this.state.reminder,
        this.state.reminderTime
      );
      if (expectVoid !== null && expectVoid !== undefined) {
        throw expectVoid;
      }

      await this.props.submitTaskText(true, "Task Updated!");
      this.setState({
        updateTaskTextError: false,
        updateTaskTextErrorText: "",
      });
      this.dismissTaskDialog();
    } catch (err) {
      this.setState({
        updateTaskTextError: true,
        updateTaskTextErrorText: err,
      });
    }
  };

  updateNoteText = async (): Promise<void> => {
    try {
      let expectVoidOrString: void | string = await updateNote(
        this.state.updateNoteTextState.text,
        this.state.updateNoteTextState.noteID
      );
      if (expectVoidOrString && typeof expectVoidOrString !== "string") {
        throw expectVoidOrString;
      }

      await this.props.submitTaskText(true, "Note Updated!");
      this.setState({
        updateNoteTextError: false,
        updateNoteTextErrorText: "",
      });
      this.dismissNoteDialog();
    } catch (err) {
      this.setState({
        updateNoteTextError: true,
        updateNoteTextErrorText: err,
      });
    }
  };

  updatingUpdateTaskTextState = (text: string, taskID: number): void => {
    try {
      this.setState({
        updateTaskTextState: {
          text,
          taskID,
        },
      });
    } catch (err) {
      this.setState({
        updateNoteTextError: true,
        updateNoteTextErrorText: err,
      });
    }
  };

  updatingUpdateNoteTextState = (text: string, noteID: number): void => {
    try {
      this.setState({
        updateNoteTextState: {
          text,
          noteID,
        },
      });
    } catch (err) {
      this.setState({
        updateNoteTextError: true,
        updateNoteTextErrorText: err,
      });
    }
  };

  dismissTaskDialog = (): void => {
    try {
      this.setState({
        updateTaskDialogVisible: false,
        updateTaskTextError: false,
        updateTaskTextErrorText: "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  dismissNoteDialog = (): void => {
    try {
      this.setState({
        updateNoteDialogVisible: false,
        updateNoteTextError: false,
        updateNoteTextErrorText: "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  changeReminderTime = (reminderTime: string) => {
    try {
      this.setState({
        reminder: reminderTime === "N/A" ? false : true,
        reminderTime,
      });
    } catch (err) {
      console.log(err);
    }
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
            <Button
              mode="contained"
              style={styles.subHeadingText}
              labelStyle={{ fontSize: 20 }}
            >
              Tasks
            </Button>
            <SetReminder
              reminder={this.state.reminder}
              reminderTime={this.state.reminderTime}
              changeReminderTime={this.changeReminderTime}
              text="New Task Reminder Time: "
            />
            <View style={styles.addTaskEntry}>
              {this.props.theme === "light" ? (
                <Text style={styles.plusSign}>{"\u002B"}</Text>
              ) : (
                <Text style={styles.plusSign} />
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
              {this.props.newTaskTextRef.current?.isFocused() ? (
                <View style={{ width: "17%" }}>
                  <IconButton
                    icon="check-circle-outline"
                    color="blue"
                    size={30}
                    style={styles.submitAndClearIcons}
                    onPress={() => {
                      this.clearTaskText();
                    }}
                  />
                  <IconButton
                    icon="checkbox-blank-circle-outline"
                    color="red"
                    size={30}
                    style={styles.submitAndClearIcons}
                    onPress={() => {
                      this.setState({
                        newTaskText: "",
                        newTaskTextError: false,
                        newTaskTextErrorText: "",
                      });
                      Keyboard.dismiss();
                    }}
                  />
                </View>
              ) : null}
            </View>
            {this.state.newTaskTextError ? (
              <Paragraph style={{ color: "#C00000", marginTop: 0 }}>
                {this.state.newTaskTextErrorText}
              </Paragraph>
            ) : null}
            <View style={{ marginTop: 15 }}>
              {this.props.Day &&
                this.props.Day.tasks.map((task, index) => {
                  return task.isChecked ? (
                    <View key={index} style={styles.mapTaskContainer}>
                      <Paragraph
                        style={{
                          ...styles.paragraphTextStrikethrough,
                          backgroundColor:
                            this.props.theme === "light" ? "white" : "#121212",
                        }}
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
                          onPress={async () => {
                            Keyboard.dismiss();
                            await this.props.checkTask(task.id, task.isChecked);
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
                          onPress={async () => {
                            Keyboard.dismiss();
                            await this.props.deleteTask(task.id);
                          }}
                        >
                          Delete
                        </Button>
                      </View>
                    </View>
                  ) : (
                    <View key={index}>
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
                          onPress={async () => {
                            Keyboard.dismiss();
                            await this.props.checkTask(task.id, task.isChecked);
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
                          onPress={async () => {
                            Keyboard.dismiss();
                            await this.props.deleteTask(task.id);
                          }}
                        >
                          Delete
                        </Button>
                      </View>
                    </View>
                  );
                })}
            </View>
          </Card.Content>
          <Card.Content>
            <Button
              mode="contained"
              style={styles.subHeadingText}
              labelStyle={{ fontSize: 20 }}
            >
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
                  onPress={async () => {
                    Keyboard.dismiss();
                    await this.props.deleteNote(this.props.Day?.note.id);
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
                    <Text style={styles.plusSign} />
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
                  />
                  {this.props.newNoteTextRef.current?.isFocused() ? (
                    <View style={{ width: "17%" }}>
                      <IconButton
                        icon="check-circle-outline"
                        color="blue"
                        size={30}
                        style={styles.submitAndClearIcons}
                        onPress={() => {
                          this.clearNoteText();
                        }}
                      />
                      <IconButton
                        icon="checkbox-blank-circle-outline"
                        color="red"
                        size={30}
                        style={styles.submitAndClearIcons}
                        onPress={() => {
                          this.setState({
                            newNoteText: "",
                          });
                          Keyboard.dismiss();
                        }}
                      />
                    </View>
                  ) : null}
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
    width: "89%",
    minHeight: "90%",
    marginTop: 25,
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
    marginBottom: 5,
  },
  plusSign: {
    width: "3%",
  },
  newTaskInput: {
    width: "80%",
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
    marginTop: 25,
    marginBottom: 25,
    borderRadius: 40,
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
  mapTaskContainer: {
    marginBottom: 15,
    marginTop: 15,
  },
  submitAndClearIcons: {
    marginBottom: 0,
    marginTop: 0,
  },
});
