import React from "react";
import { Portal, Dialog, Paragraph, Button } from "react-native-paper";
import { AppProps } from "./TextDialog.interface";
import { StyleSheet } from "react-native";

export default function TextDialog(props: AppProps) {
  return (
    <Portal>
      <Dialog
        visible={props.showTextDialog}
        onDismiss={props.toggleTextDialog}
        style={styles.dialogStyle}
      >
        <Dialog.Content>
          <Paragraph style={styles.textStyle}>{props.text}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            mode="contained"
            onPress={props.toggleTextDialog}
            style={styles.buttonStyling}
          >
            NO
          </Button>
          <Button
            mode="contained"
            onPress={props.functionToRun}
            style={styles.buttonStyling}
          >
            YES
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialogStyle: {
    borderWidth: 1,
    borderColor: "white",
  },
  textStyle: {
    fontSize: 20,
  },
  buttonStyling: {
    borderRadius: 20,
    marginRight: 10,
    paddingRight: 7,
    paddingLeft: 7,
  },
});
