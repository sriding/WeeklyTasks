import React from 'react'
import { View, Text, Dimensions } from 'react-native'

import { Dialog, Portal, Button, TextInput, Paragraph } from "react-native-paper";

const UpdateNoteDialog = (props) => {
    return (
        <Portal>
            <Dialog visible={props.updateNoteDialogVisible}
            onDismiss={props.dismissNoteDialog}
            style={{maxHeight: Dimensions.get("window").height / 2}}>              
                <Dialog.Title>Update Note</Dialog.Title>
                <Dialog.Content>
                    {props.updateNoteTextError ? 
                        <Paragraph style={{color: "#C00000"}}>{props.updateNoteTextErrorText}</Paragraph> : 
                    null}
                    <TextInput mode="outlined"
                    value={props.updateNoteTextState.text}
                    multiline={true}
                    numberOfLines={4}
                    error={props.updateNoteTextError}
                    onChangeText={(text) => {
                        props.updatingUpdateNoteTextState(text, props.updateNoteTextState.noteID);
                    }}
                    ></TextInput>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={props.dismissNoteDialog}>Cancel</Button>
                    <Button onPress={() => {
                        props.updateNoteText();
                    }}>Update</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

export default UpdateNoteDialog
