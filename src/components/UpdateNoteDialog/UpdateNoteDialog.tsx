import React from "react";
import { Dimensions, StyleSheet, Platform } from "react-native";

import {
  Dialog,
  Portal,
  Button,
  TextInput,
  Paragraph,
} from "react-native-paper";

import { AppProps } from "./UpdateNoteDialog.interface";

export default function UpdateNoteDialog(props: AppProps) {
  return (
    <Portal>
      <Dialog
        visible={props.updateNoteDialogVisible}
        onDismiss={props.dismissNoteDialog}
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
          <Dialog.Title>Update Note</Dialog.Title>
        )}
        <Dialog.Content>
          {props.updateNoteTextError ? (
            <Paragraph style={{ color: "#C00000" }}>
              {props.updateNoteTextErrorText}
            </Paragraph>
          ) : null}
          <TextInput
            ref={props.updateNoteTextRef}
            mode="outlined"
            value={props.updateNoteTextState.text}
            multiline={true}
            numberOfLines={3}
            style={{ minHeight: 80, maxHeight: 125 }}
            error={props.updateNoteTextError}
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
              props.updatingUpdateNoteTextState(
                text,
                props.updateNoteTextState.noteID
              );
            }}
            onKeyPress={(e) => {
              if (e.nativeEvent.key == "Enter") {
                props.updateNoteTextRef.current!.blur();
              }
            }}
          ></TextInput>
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
