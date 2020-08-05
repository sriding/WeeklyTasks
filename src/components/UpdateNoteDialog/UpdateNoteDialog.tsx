import React, { Fragment } from "react";
import {
  Dimensions,
  StyleSheet,
  Platform,
  Pressable,
  Keyboard,
} from "react-native";

import {
  Dialog,
  Portal,
  Button,
  TextInput,
  Paragraph,
  Divider,
} from "react-native-paper";

import { AppProps } from "./UpdateNoteDialog.interface";

export default function UpdateNoteDialog(props: AppProps) {
  return (
    <Portal>
      <Dialog
        visible={props.updateNoteDialogVisible}
        onDismiss={props.dismissNoteDialog}
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
              <Dialog.Title>Update Note</Dialog.Title>
              <Divider
                style={{
                  marginTop: 5,
                  marginBottom: 20,
                  backgroundColor: props.theme === "light" ? "silver" : "white",
                }}
              />
            </Fragment>
          )}
          <Dialog.Content>
            <TextInput
              ref={props.updateNoteTextRef}
              mode="outlined"
              value={props.updateNoteTextState.text}
              multiline={true}
              numberOfLines={3}
              style={{ minHeight: 80, maxHeight: 125 }}
              error={props.updateNoteTextError}
              selectionColor={props.theme === "light" ? "black" : "white"}
              onChangeText={(text) => {
                props.updatingUpdateNoteTextState(
                  text,
                  props.updateNoteTextState.noteID
                );
              }}
            ></TextInput>
            {props.updateNoteTextError
              ? props.updateNoteTextErrorText.map((errors, index) => {
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
                onPress={props.dismissNoteDialog}
                color={props.theme === "light" ? "#6200ee" : "white"}
              >
                Cancel
              </Button>
              <Button
                onPress={async () => {
                  await props.updateNoteText();
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
    maxHeight: Dimensions.get("window").height,
    elevation: 10,
    borderWidth: 1,
  },
});
