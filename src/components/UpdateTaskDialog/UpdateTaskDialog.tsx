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

export default function UpdateTaskDialog(props: AppProps) {
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
          borderColor: "white",
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
                  marginTop: 5,
                  marginBottom: 20,
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
              ref={props.updateTaskTextRef}
              mode="outlined"
              value={props.updateTaskTextState.text}
              multiline={true}
              numberOfLines={3}
              style={{ minHeight: 80, maxHeight: 125 }}
              error={props.updateTaskTextError}
              selectionColor={props.theme === "light" ? "black" : "white"}
              onChangeText={(text) => {
                props.updatingUpdateTaskTextState(
                  text,
                  props.updateTaskTextState.taskID
                );
              }}
            ></TextInput>
            {props.updateTaskTextError
              ? props.updateTaskTextErrorText.map((errors, index) => {
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
                })
              : null}
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
                  await props.updateTaskText();
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
  },
});
