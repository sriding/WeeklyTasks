//Core React and React Native modules
import React, { Component, Fragment } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableHighlight,
  Keyboard,
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
import { getASingleDaysData } from "../../controllers/database/Miscellaneous/GetASingleDaysData/getASingleDaysData";

export default class DayScreenCard extends Component<AppProps, AppState> {
  onBlurSubscription: any;

  constructor(props: AppProps) {
    super(props);
    this.state = {
      newTaskText: "",
      newNoteText: "",
      newTaskTextError: false,
      newNoteTextError: false,
      newTaskTextErrorText: [],
      newNoteTextErrorText: [],
      showTaskButtons: false,
      showNoteButtons: false,
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
      Keyboard.dismiss();

      this.setState({
        newTaskText: "",
        newTaskTextError: false,
        newTaskTextErrorText: [],
      });
    } catch (err) {
      this.setState({
        newTaskText: "",
        newTaskTextError: true,
        newTaskTextErrorText: Object.values(JSON.parse(err)),
      });
    }
  };

  submitNote = async (text: string, noteId: number) => {
    try {
      const submittedNote = await addNote(text, noteId);
      if (submittedNote !== undefined && submittedNote !== null) {
        throw submittedNote;
      }

      await this.props.submitTaskText(true, "Note Created!");
      Keyboard.dismiss();

      this.setState({
        newNoteText: "",
        newNoteTextError: false,
        newNoteTextErrorText: [],
      });
    } catch (err) {
      this.setState({
        newNoteTextError: true,
        newNoteTextErrorText: Object.values(JSON.parse(err)),
      });
    }
  };

  updateTaskText = async (): Promise<void> => {
    try {
      await this.props.submitTaskText(true, "Task Updated!");
      this.dismissTaskDialog();
    } catch (err) {}
  };

  updateNoteText = async (): Promise<void> => {
    try {
      await this.props.submitTaskText(true, "Note Updated!");
      this.setState({
        updateNoteTextError: false,
        updateNoteTextErrorText: [],
      });
      this.dismissNoteDialog();
    } catch (err) {
      this.setState({
        updateNoteTextError: true,
        updateNoteTextErrorText: Object.values(JSON.parse(err)),
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
        updateNoteTextErrorText: Object.values(JSON.parse(err)),
      });
    }
  };

  updatingUpdateNoteTextState = async (): Promise<void> => {
    await this.props.submitTaskText(true, "Note Updated!");
    this.dismissNoteDialog();
  };

  toggleTaskButtons = () => {
    this.setState({
      showTaskButtons: !this.state.showTaskButtons,
    });
  };

  toggleNoteButtons = () => {
    this.setState({
      showNoteButtons: !this.state.showNoteButtons,
    });
  };

  removeTaskErrors = () => {
    this.setState({
      newTaskTextError: false,
      newTaskTextErrorText: [],
    });
  };

  dismissTaskDialog = (): void => {
    try {
      this.setState({
        updateTaskDialogVisible: false,
        updateTaskTextError: false,
        updateTaskTextErrorText: [],
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
        updateNoteTextErrorText: [],
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

  renderComponent = (theme: string) => {
    switch (theme) {
      case "dark":
        return (
          <Text
            style={{
              ...styles.plusSign,
              color: "white",
            }}
          >
            {"\u002B"}
          </Text>
        );
      case "light":
      default:
        return <Text style={styles.plusSign}>{"\u002B"}</Text>;
    }
  };

  render() {
    return (
      <Fragment>
        <Card
          style={{
            ...styles.cardContainer,
            paddingBottom: this.state.paddingBottom,
            shadowColor: this.props.theme === "light" ? "#000000" : "#c2c2f0",
            borderColor: this.props.theme === "light" ? "#FFFFFF" : "#D3D3D3",
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
              theme={this.props.theme}
              text="New Task Reminder Time: "
            />
            <View style={styles.addTaskEntry}>
              {this.renderComponent(this.props.theme)}
              <TextInput
                style={{
                  ...styles.newTaskInput,
                  backgroundColor:
                    this.props.theme === "light" ? "white" : "#101010",
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
                onFocus={() => {
                  this.toggleTaskButtons();
                }}
                onBlur={() => {
                  this.toggleTaskButtons();
                  this.removeTaskErrors();
                }}
              />
              {this.state.showTaskButtons ? (
                <View style={{ width: "17%" }}>
                  <IconButton
                    icon="check-circle-outline"
                    color={this.props.theme === "light" ? "#6200ee" : "#c2c2f0"}
                    size={30}
                    style={styles.submitAndClearIcons}
                    onPress={() => {
                      this.clearTaskText();
                    }}
                  />
                  <IconButton
                    icon="checkbox-blank-circle-outline"
                    color={this.props.theme === "light" ? "red" : "#ff8080"}
                    size={30}
                    style={styles.submitAndClearIcons}
                    onPress={() => {
                      this.setState({
                        newTaskText: "",
                        newTaskTextError: false,
                        newTaskTextErrorText: [],
                      });
                      Keyboard.dismiss();
                    }}
                  />
                </View>
              ) : null}
            </View>
            {this.state.newTaskTextErrorText.map((err, index) => {
              return (
                <Paragraph
                  key={index}
                  style={{
                    color: this.props.theme === "light" ? "#C00000" : "#ff8080",
                    marginTop: 0,
                  }}
                >
                  {err}
                </Paragraph>
              );
            })}
            <View style={{ marginTop: 15 }}>
              {this.props.Day !== null
                ? this.props.Day.tasks.map((task, index) => {
                    return task.isChecked ? (
                      <View key={index} style={styles.mapTaskContainer}>
                        <Paragraph
                          style={{
                            ...styles.paragraphTextStrikethrough,
                            backgroundColor:
                              this.props.theme === "light"
                                ? "white"
                                : "#121212",
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
                              this.props.theme === "light"
                                ? "#6200ee"
                                : "#c2c2f0"
                            }
                            onPress={async () => {
                              Keyboard.dismiss();
                              await this.props.checkTask(
                                task.id,
                                task.isChecked
                              );
                            }}
                          >
                            Check
                          </Button>
                          <Button
                            mode="outlined"
                            style={styles.buttonStyle}
                            color={
                              this.props.theme === "light"
                                ? "#C00000"
                                : "#ff8080"
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
                              this.props.theme === "light"
                                ? "white"
                                : "#121212",
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
                              this.props.theme === "light"
                                ? "#6200ee"
                                : "#c2c2f0"
                            }
                            onPress={async () => {
                              Keyboard.dismiss();
                              await this.props.checkTask(
                                task.id,
                                task.isChecked
                              );
                            }}
                          >
                            Check
                          </Button>
                          <Button
                            mode="outlined"
                            style={styles.buttonStyle}
                            color={
                              this.props.theme === "light"
                                ? "#C00000"
                                : "#ff8080"
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
                  })
                : null}
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
            {this.props.Day !== null ? (
              this.props.Day.note.text !== "" ? (
                <Fragment>
                  <Paragraph
                    style={{
                      ...styles.paragraphText,
                      backgroundColor:
                        this.props.theme === "light" ? "white" : "#121212",
                    }}
                    onPress={() => {
                      this.setState({
                        updateNoteTextState: {
                          text: this.props.Day.note.text,
                          noteID: this.props.Day.note.id,
                        },
                        updateNoteDialogVisible: true,
                      });
                    }}
                  >
                    {this.props.Day !== null ? this.props.Day.note.text : null}
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
                  <View style={styles.addTaskEntry}>
                    {this.renderComponent(this.props.theme)}
                    <TextInput
                      style={{
                        ...styles.newTaskInput,
                        backgroundColor:
                          this.props.theme === "light" ? "white" : "#171617",
                      }}
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
                        this.setState(
                          {
                            updateTaskTextError: false,
                            updateTaskTextErrorText: [],
                            updateNoteTextState: {
                              text: this.props.Day.note.text,
                              noteID: this.props.Day.note.id,
                            },
                            paddingBottom: 300,
                            showNoteButtons: true,
                          },
                          () => {
                            setTimeout(() => {
                              this.props.firstScrollView.current!.scrollTo({
                                x: 0,
                                y:
                                  Dimensions.get("window").height +
                                  this.state.paddingBottom,
                              });
                            }, 300);
                          }
                        );
                      }}
                      onBlur={() => {
                        this.setState({
                          paddingBottom: 175,
                          newNoteTextError: false,
                          newNoteTextErrorText: [],
                          showNoteButtons: false,
                        });
                      }}
                    />
                    {this.state.showNoteButtons ? (
                      <View style={{ width: "17%" }}>
                        <IconButton
                          icon="check-circle-outline"
                          color={
                            this.props.theme === "light" ? "#6200ee" : "#c2c2f0"
                          }
                          size={30}
                          style={styles.submitAndClearIcons}
                          onPress={async () => {
                            await this.submitNote(
                              this.state.newNoteText,
                              this.state.updateNoteTextState.noteID
                            );
                          }}
                        />
                        <IconButton
                          icon="checkbox-blank-circle-outline"
                          color={
                            this.props.theme === "light" ? "red" : "#ff8080"
                          }
                          size={30}
                          style={styles.submitAndClearIcons}
                          onPress={() => {
                            this.setState({
                              newNoteText: "",
                              newNoteTextError: false,
                              newNoteTextErrorText: [],
                              showNoteButtons: false,
                            });
                            Keyboard.dismiss();
                          }}
                        />
                      </View>
                    ) : null}
                  </View>
                  {this.state.newNoteTextErrorText.map((err, index) => {
                    return (
                      <Paragraph
                        key={index}
                        style={{
                          color:
                            this.props.theme === "light"
                              ? "#C00000"
                              : "#ff8080",
                        }}
                      >
                        {err}
                      </Paragraph>
                    );
                  })}
                </Fragment>
              )
            ) : null}
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
    borderWidth: 1,
    borderRadius: 20,
    shadowRadius: 3,
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
