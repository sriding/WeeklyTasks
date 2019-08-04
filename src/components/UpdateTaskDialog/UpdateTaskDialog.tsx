import React, { Component } from 'react'
import { Dialog, Portal, Button, TextInput, Paragraph } from "react-native-paper";
import { Dimensions, KeyboardAvoidingView, StyleSheet } from 'react-native';

export default class UpdateTaskDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <Portal>
                <Dialog visible={this.props.updateTaskDialogVisible}
                onDismiss={this.props.dismissTaskDialog}
                style={!this.props.keyboardOpen ? styles.dialogContainer : {
                    maxHeight: Dimensions.get("window").height / 2,
                    marginBottom: this.props.keyboardHeight - 90
                }}>
                    <Dialog.Title>Update Task</Dialog.Title>
                    <Dialog.Content>
                        {this.props.updateTaskTextError ? <Paragraph style={{color: "#C00000"}}>
                            {this.props.updateTaskTextErrorText}
                        </Paragraph> : null}
                        <TextInput mode="outlined"
                        value={this.props.updateTaskTextState.text}
                        multiline={true}
                        numberOfLines={3}
                        error={this.props.updateTaskTextError} 
                        onChangeText={(text) => {
                            this.props.updatingUpdateTaskTextState(text, this.props.updateTaskTextState.taskID);
                        }}
                        ></TextInput>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={this.props.dismissTaskDialog}>Cancel</Button>
                        <Button onPress={() => {
                            this.props.updateTaskText();
                        }}>Update</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        )
    }
}

const styles = StyleSheet.create({
    dialogContainer: {
        maxHeight: Dimensions.get("window").height / 2,
    }
})
