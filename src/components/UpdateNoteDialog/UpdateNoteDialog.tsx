import React, { Fragment } from "react";
import { Dimensions, StyleSheet, Pressable, Keyboard } from "react-native";

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
  const [dialogContainerMargins, setDialogContainerMargins] = React.useState({
    marginLeft: 0,
    marginRight: 0,
  });
  const [keyboardOpen, setKeyboardOpen] = React.useState<boolean>(false);
  const [dialogTopProperty, setDialogTopProperty] = React.useState<number>(0);
  const [isLandscape, setIsLandscape] = React.useState<boolean>(false);

  React.useEffect(() => {
    updateText(props.updateNoteTextState.text);
    updateNoteId(props.updateNoteTextState.noteID);

    changeDialogDimensions();
    Dimensions.addEventListener("change", () => {
      changeDialogDimensions();
    });
    Keyboard.addListener("keyboardDidShow", (e) => keyboardDidShowFunction(e));
    Keyboard.addListener("keyboardDidHide", (e) => keyboardDidHideFunction(e));

    return function cleanup() {
      Dimensions.removeEventListener("change", () => {
        changeDialogDimensions();
      });
      Keyboard.removeListener("keyboardDidShow", (e) =>
        keyboardDidShowFunction(e)
      );
      Keyboard.removeListener("keyboardDidHide", (e) =>
        keyboardDidHideFunction(e)
      );
    };
  }, [props.updateNoteTextState.text, props.updateNoteTextState.noteID]);

  const keyboardDidShowFunction = (e) => {
    setKeyboardOpen(true);
    if (Dimensions.get("window").height < Dimensions.get("window").width) {
      setDialogTopProperty(
        Math.abs(
          (Dimensions.get("window").height - e.endCoordinates.height - 70) / 2
        )
      );
      setIsLandscape(true);
    } else {
      setDialogTopProperty(
        Math.abs(
          (Dimensions.get("window").height - e.endCoordinates.height - 300) / 2
        )
      );
      setIsLandscape(false);
    }
  };

  const keyboardDidHideFunction = (e) => {
    setKeyboardOpen(false);
    setDialogTopProperty(0);
  };

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

  const changeDialogDimensions = () => {
    let screenWidth = Dimensions.get("window").width;
    if (screenWidth > 700) {
      setDialogContainerMargins({
        marginLeft: (screenWidth - 700) / 2,
        marginRight: (screenWidth - 700) / 2,
      });
    }
  };

  return (
    <Portal>
      <Dialog
        visible={props.updateNoteDialogVisible}
        onDismiss={props.dismissNoteDialog}
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
          {keyboardOpen && isLandscape ? null : (
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
  textInputStyle: {
    minHeight: 80,
    maxHeight: 125,
  },
});
