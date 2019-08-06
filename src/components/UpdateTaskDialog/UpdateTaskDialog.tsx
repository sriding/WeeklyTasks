import React from 'react'
import { Dialog, Portal, Button, TextInput, Paragraph } from "react-native-paper";
import { Dimensions, StyleSheet } from 'react-native';

export default function UpdateTaskDialog(props) {
        return (
            <Portal>
                <Dialog visible={props.updateTaskDialogVisible}
                onDismiss={props.dismissTaskDialog}
                style={!props.keyboardOpen ? styles.dialogContainer : {
                    maxHeight: Dimensions.get("window").height / 2,
                    marginBottom: props.keyboardHeight - 90
                }}>
                    <Dialog.Title>Update Task</Dialog.Title>
                    <Dialog.Content>
                        {props.updateTaskTextError ? <Paragraph style={{color: "#C00000"}}>
                            {props.updateTaskTextErrorText}
                        </Paragraph> : null}
                        <TextInput mode="outlined"
                        value={props.updateTaskTextState.text}
                        multiline={true}
                        numberOfLines={3}
                        error={props.updateTaskTextError} 
                        onChangeText={(text) => {
                            props.updatingUpdateTaskTextState(text, props.updateTaskTextState.taskID);
                        }}
                        ></TextInput>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={props.dismissTaskDialog}>Cancel</Button>
                        <Button onPress={() => {
                            props.updateTaskText();
                        }}>Update</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        )
}

const styles = StyleSheet.create({
    dialogContainer: {
        maxHeight: Dimensions.get("window").height / 2,
    }
})
