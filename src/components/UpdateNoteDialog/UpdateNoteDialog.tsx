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
import { updateNote } from "../../controllers/database/Notes/notes";

export default function UpdateNoteDialog(props: AppProps) {
  const [text, updateText] = React.useState<string>("");
  const [noteId, updateNoteId] = React.useState<number>(-1);
  const [textInputErrorExists, updateTextInputErrorExists] = React.useState<
    boolean
  >(false);
  const [textInputErrorArray, updateTextInputErrorArray] = React.useState<
    string[]
  >([]);

  React.useEffect(() => {
    updateText(props.updateNoteTextState.text);
    updateNoteId(props.updateNoteTextState.noteID);
  }, [props.updateNoteTextState.text, props.updateNoteTextState.noteID]);

  const submitUpdatedNote = async () => {
    try {
      let expectVoid: void | string = await updateNote(text, noteId);
      if (expectVoid !== null && expectVoid !== undefined) {
        throw expectVoid;
      }

      clearDialogErrors();
      props.updatingUpdateNoteTextState();
    } catch (err) {
      updateTextInputErrorExists(true);
      updateTextInputErrorArray(Object.values(JSON.parse(err)));
    }
  };

  const clearDialogErrors = () => {
    updateTextInputErrorExists(false);
    updateTextInputErrorArray([]);
  };

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
                  ...styles.dividerStyling,
                  backgroundColor: props.theme === "light" ? "silver" : "white",
                }}
              />
            </Fragment>
          )}
          <Dialog.Content>
            <TextInput
              mode="outlined"
              value={text}
              multiline={true}
              numberOfLines={3}
              style={styles.textInputStyle}
              error={textInputErrorExists}
              selectionColor={props.theme === "light" ? "black" : "white"}
              onChangeText={(text) => {
                updateText(text);
              }}
            ></TextInput>
            {textInputErrorArray.map((errors, index) => {
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
                onPress={props.dismissNoteDialog}
                color={props.theme === "light" ? "#6200ee" : "white"}
              >
                Cancel
              </Button>
              <Button
                onPress={async () => {
                  await submitUpdatedNote();
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
    borderColor: "white",
  },
  dividerStyling: {
    marginTop: 5,
    marginBottom: 20,
  },
  textInputStyle: {
    minHeight: 80,
    maxHeight: 125,
  },
});
