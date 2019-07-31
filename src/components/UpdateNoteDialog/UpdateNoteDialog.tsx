import React from 'react'
import { View, Text } from 'react-native'

import { Dialog, Portal, Button, TextInput } from "react-native-paper";

const UpdateNoteDialog = (props) => {
    return (
        <Portal>
            <Dialog visible={props.updateNoteDialogVisible}
            onDismiss={props.dismissNoteDialog}>
                <Dialog.Content>
                    <TextInput value={props.updateNoteTextState.text} 
                    onChangeText={(text) => {
                        props.updatingUpdateNoteTextState(text, props.updateNoteTextState.noteID);
                    }}
                    ></TextInput>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={props.dismissNoteDialog}>Cancel</Button>
                    <Button onPress={() => {
                        props.updateNoteText();
                        props.dismissNoteDialog();
                    }}>Update</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

export default UpdateNoteDialog
