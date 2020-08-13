import React, { Fragment } from "react";
import {
  Dialog,
  Portal,
  Button,
  TextInput,
  Paragraph,
  Divider,
} from "react-native-paper";
import { Dimensions, StyleSheet, Pressable, Keyboard } from "react-native";

import SetReminder from "./../SetReminder/SetReminder";

import { AppProps } from "./UpdateTaskDialog.interface";
import { updateTask } from "../../controllers/database/Tasks/tasks";

export default function UpdateTaskDialog(props: AppProps) {
  const [text, updateText] = React.useState<string>("");
  const [taskId, updateTaskId] = React.useState<number>(-1);
  const [textErrorExists, updateTextErrorExists] = React.useState<boolean>(
    false
  );
  const [textErrorText, updateTextErrorText] = React.useState<string[]>([]);
  const [dialogTopProperty, setDialogTopProperty] = React.useState<number>(0);
  const [keyboardOpen, setKeyboardOpen] = React.useState<boolean>(false);
  const [dialogContainerMargins, setDialogContainerMargins] = React.useState({
    marginLeft: 0,
    marginRight: 0,
  });
  const [isLandscape, setIsLandscape] = React.useState<boolean>(false);

  React.useEffect(() => {
    updateText(props.updateTaskTextState.text);
    updateTaskId(props.updateTaskTextState.taskID);

    dialogContainerCentering();
    Dimensions.addEventListener("change", () => {
      dialogContainerCentering();
    });
    Keyboard.addListener("keyboardDidShow", (e) => keyboardDidShowFunction(e));
    Keyboard.addListener("keyboardDidHide", (e) => keyboardDidHideFunction(e));

    return function cleanup() {
      Dimensions.removeEventListener("change", () => {
        dialogContainerCentering();
      });
      Keyboard.removeListener("keyboardDidShow", (e) =>
        keyboardDidShowFunction(e)
      );
      Keyboard.removeListener("keyboardDidHide", (e) =>
        keyboardDidHideFunction(e)
      );
    };
  }, [props.updateTaskTextState.text, props.updateTaskTextState.taskID]);

  const keyboardDidShowFunction = (e) => {
    setKeyboardOpen(true);
    if (Dimensions.get("window").height < Dimensions.get("window").width) {
      setDialogTopProperty(
        (Dimensions.get("window").height - e.endCoordinates.height - 70) / 2
      );
      setIsLandscape(true);
    } else {
      setDialogTopProperty(
        (Dimensions.get("window").height - e.endCoordinates.height - 300) / 2
      );
      setIsLandscape(false);
    }
  };

  const keyboardDidHideFunction = (e) => {
    setKeyboardOpen(false);
    setDialogTopProperty(0);
  };

  const submitTask = async () => {
    try {
      let expectVoid: void = await updateTask(
        text,
        taskId,
        props.reminder,
        props.reminderTime
      );
      if (expectVoid !== null && expectVoid !== undefined) {
        throw expectVoid;
      }

      updateTextErrorExists(false);
      updateTextErrorText([]);
      await props.updateTaskText();
    } catch (err) {
      updateTextErrorExists(true);
      updateTextErrorText(Object.values(JSON.parse(err)));
    }
  };

  const dialogContainerCentering = () => {
    let screenWidth = Dimensions.get("window").width;

    if (screenWidth > 700) {
      setDialogContainerMargins({
        marginLeft: (screenWidth - 700) / 2,
        marginRight: (screenWidth - 700) / 2,
      });
    } else {
      setDialogContainerMargins({
        marginLeft: 0,
        marginRight: 0,
      });
    }
  };

  return (
    <Portal>
      <Dialog
        visible={props.updateTaskDialogVisible}
        onDismiss={props.dismissTaskDialog}
        style={{
          ...styles.dialogContainer,
          position: keyboardOpen ? "absolute" : "relative",
          top: dialogTopProperty,
          width: Dimensions.get("window").width >= 700 ? 700 : "90%",
          marginLeft: dialogContainerMargins.marginLeft,
          marginRight: dialogContainerMargins.marginRight,
          backgroundColor: props.theme === "light" ? "white" : "#181818",
        }}
      >
        <Pressable
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          {keyboardOpen && isLandscape ? null : (
            <Fragment>
              <Dialog.Title style={{ marginBottom: 0 }}>
                Update Task
              </Dialog.Title>
              <Divider
                style={{
                  ...styles.dividerStyling,
                  backgroundColor: props.theme === "light" ? "silver" : "white",
                }}
              />
            </Fragment>
          )}
          {keyboardOpen && isLandscape ? null : (
            <SetReminder
              reminder={props.reminder}
              reminderTime={props.reminderTime}
              changeReminderTime={props.changeReminderTime}
              theme={props.theme}
              text="Change Reminder Time: "
            />
          )}
          <Dialog.Content style={{ marginTop: 5 }}>
            <TextInput
              mode="outlined"
              value={text}
              multiline={true}
              numberOfLines={3}
              style={styles.textInputStyling}
              error={textErrorExists}
              selectionColor={props.theme === "light" ? "black" : "white"}
              onChangeText={(text) => {
                updateText(text);
              }}
            ></TextInput>
            {textErrorText.map((errors, index) => {
              return (
                <Paragraph
                  key={index}
                  style={{
                    color: props.theme === "light" ? "#C00000" : "#ff8080",
                  }}
                >
                  {errors}
                </Paragraph>
              );
            })}
          </Dialog.Content>
          {keyboardOpen && isLandscape ? null : (
            <Dialog.Actions>
              <Button
                onPress={props.dismissTaskDialog}
                color={props.theme === "light" ? "#6200ee" : "white"}
              >
                Cancel
              </Button>
              <Button
                onPress={async () => {
                  await submitTask();
                }}
                color={props.theme === "light" ? "#6200ee" : "white"}
              >
                Update
              </Button>
            </Dialog.Actions>
          )}
        </Pressable>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialogContainer: {
    elevation: 10,
    borderWidth: 1,
    borderColor: "white",
    maxWidth: 700,
    alignSelf: "center",
    minHeight: 70,
  },
  dividerStyling: {
    marginTop: 5,
    marginBottom: 20,
  },
  textInputStyling: {
    minHeight: 80,
    maxHeight: 125,
  },
});
