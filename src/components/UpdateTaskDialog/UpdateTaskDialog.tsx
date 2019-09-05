import React from 'react'
import { Dialog, Portal, Button, TextInput, Paragraph } from "react-native-paper";
import { Dimensions, StyleSheet, Platform } from 'react-native';

import SetReminder from "./../SetReminder/SetReminder";

interface AppProps {
    updateTaskDialogVisible: boolean,
    dismissTaskDialog: () => void,
    updateTaskText: () => void,
    updateTaskTextState: {
        text: string,
        taskID: number
    },
    updatingUpdateTaskTextState: (text: string, taskID: number) => void,
    updateTaskTextError: boolean,
    updateTaskTextErrorText: string,
    keyboardHeight: number,
    keyboardOpen: boolean,
    updateTaskTextRef: React.RefObject<TextInput>,
    reminder: boolean,
    reminderTime: string,
    changeReminderTime: (reminderTime: string) => void
}

export default function UpdateTaskDialog(props: AppProps) {
        return (
            <Portal>
                <Dialog visible={props.updateTaskDialogVisible}
                onDismiss={props.dismissTaskDialog}
                style={!props.keyboardOpen ? styles.dialogContainer : {
                    maxHeight: Dimensions.get("window").height - props.keyboardHeight,
                    marginBottom: props.keyboardHeight,
                    elevation: 10
                }}>
                    {props.keyboardHeight > 0 ? null :
                    <Dialog.Title>Update Task</Dialog.Title>
                    }
                    <SetReminder reminder={props.reminder}
                    reminderTime={props.reminderTime}
                    changeReminderTime={props.changeReminderTime}/>
                    <Dialog.Content>
                        {props.updateTaskTextError ? <Paragraph style={{color: "#C00000"}}>
                            {props.updateTaskTextErrorText}
                        </Paragraph> : null}
                        <TextInput ref={props.updateTaskTextRef}
                        mode="outlined"
                        value={props.updateTaskTextState.text}
                        multiline={true}
                        numberOfLines={3}
                        style={{minHeight: 80, maxHeight: 125}}
                        error={props.updateTaskTextError} 
                        onChangeText={(text) => {
                            props.updatingUpdateTaskTextState(text, props.updateTaskTextState.taskID);
                        }}
                        onKeyPress={(e) => {
                            if(e.nativeEvent.key == "Enter"){
                                props.updateTaskTextRef.current!.blur();
                            }
                        }}
                        ></TextInput>
                    </Dialog.Content>
                    {Platform.OS === "ios" && Dimensions.get("window").width > Dimensions.get("window").height && props.keyboardHeight > 0 ? null :
                    <Dialog.Actions>
                        <Button onPress={props.dismissTaskDialog}>Cancel</Button>
                        <Button onPress={() => {
                            props.updateTaskText();
                        }}>Update</Button>
                    </Dialog.Actions>
                    }
                </Dialog>
            </Portal>
        )
}

const styles = StyleSheet.create({
    dialogContainer: {
        maxHeight: Dimensions.get("window").height,
        elevation: 10
    }
})
