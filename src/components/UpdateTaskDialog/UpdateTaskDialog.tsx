import React, { Fragment } from "react";
import {
  Dialog,
  Portal,
  Button,
  TextInput,
  Paragraph,
  Divider,
} from "react-native-paper";
import {
  Dimensions,
  StyleSheet,
  Platform,
  Pressable,
  Keyboard,
} from "react-native";

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

  React.useEffect(() => {
    updateText(props.updateTaskTextState.text);
    updateTaskId(props.updateTaskTextState.taskID);
  }, [props.updateTaskTextState.text, props.updateTaskTextState.taskID]);

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

  return (
    <Portal>
      <Dialog
        visible={props.updateTaskDialogVisible}
        onDismiss={props.dismissTaskDialog}
        style={{
          ...styles.dialogContainer,
          maxHeight: !props.keyboardOpen
            ? Dimensions.get("window").height
            : Dimensions.get("window").height - props.keyboardHeight,
          marginBottom: !props.keyboardOpen ? 0 : props.keyboardHeight,
          backgroundColor: props.theme === "light" ? "white" : "#181818",
        }}
      >
        <Pressable
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          {props.keyboardHeight > 0 ? null : (
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
          <SetReminder
            reminder={props.reminder}
            reminderTime={props.reminderTime}
            changeReminderTime={props.changeReminderTime}
            theme={props.theme}
            text="Change Reminder Time: "
          />
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
          {Platform.OS === "ios" &&
          Dimensions.get("window").width > Dimensions.get("window").height &&
          props.keyboardHeight > 0 ? null : (
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
