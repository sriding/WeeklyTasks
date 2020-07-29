import React from "react";
import {
  Dialog,
  Portal,
  Button,
  TextInput,
  Paragraph,
} from "react-native-paper";
import { Dimensions, StyleSheet, Platform } from "react-native";

import SetReminder from "./../SetReminder/SetReminder";

import { AppProps } from "./UpdateTaskDialog.interface";

export default function UpdateTaskDialog(props: AppProps) {
  return (
    <Portal>
      <Dialog
        visible={props.updateTaskDialogVisible}
        onDismiss={props.dismissTaskDialog}
        style={
          !props.keyboardOpen
            ? styles.dialogContainer
            : {
                maxHeight:
                  Dimensions.get("window").height - props.keyboardHeight,
                marginBottom: props.keyboardHeight,
                elevation: 10,
              }
        }
      >
        {props.keyboardHeight > 0 ? null : (
          <Dialog.Title>Update Task</Dialog.Title>
        )}
        <SetReminder
          reminder={props.reminder}
          reminderTime={props.reminderTime}
          changeReminderTime={props.changeReminderTime}
          text="Change Reminder Time: "
        />
        <Dialog.Content>
          {props.updateTaskTextError ? (
            <Paragraph style={{ color: "#C00000" }}>
              {props.updateTaskTextErrorText}
            </Paragraph>
          ) : null}
          <TextInput
            ref={props.updateTaskTextRef}
            mode="outlined"
            value={props.updateTaskTextState.text}
            multiline={true}
            numberOfLines={3}
            style={{ minHeight: 80, maxHeight: 125 }}
            error={props.updateTaskTextError}
            selectionColor={props.theme === "light" ? "black" : "white"}
            theme={
              Platform.OS == "ios"
                ? props.theme === "light"
                  ? {}
                  : { colors: { text: "white", primary: "white" } }
                : props.theme === "light"
                ? {}
                : Dimensions.get("window").width >
                  Dimensions.get("window").height
                ? { colors: { text: "gray", primary: "white" } }
                : { colors: { text: "white", primary: "white" } }
            }
            onChangeText={(text) => {
              props.updatingUpdateTaskTextState(
                text,
                props.updateTaskTextState.taskID
              );
            }}
            onKeyPress={(e) => {
              if (e.nativeEvent.key == "Enter") {
                props.updateTaskTextRef.current!.blur();
              }
            }}
          ></TextInput>
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
              onPress={() => {
                props.updateTaskText();
              }}
              color={props.theme === "light" ? "#6200ee" : "white"}
            >
              Update
            </Button>
          </Dialog.Actions>
        )}
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialogContainer: {
    maxHeight: Dimensions.get("window").height,
    elevation: 10,
  },
});
