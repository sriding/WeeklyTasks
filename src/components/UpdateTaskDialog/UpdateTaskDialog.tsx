import React, { Component } from 'react'
import { Dialog, Portal, Button, TextInput } from "react-native-paper";

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
                onDismiss={this.props.dismissTaskDialog}>
                    <Dialog.Content>
                        <TextInput value={this.props.updateTaskTextState.text} 
                        onChangeText={(text) => {
                            this.props.updatingUpdateTaskTextState(text, this.props.updateTaskTextState.taskID);
                        }}
                        ></TextInput>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={this.props.dismissTaskDialog}>Cancel</Button>
                        <Button onPress={() => {
                            this.props.updateTaskText();
                            this.props.dismissTaskDialog();
                        }}>Update</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        )
    }
}
