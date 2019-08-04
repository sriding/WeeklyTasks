import React, { Component } from 'react'

import { ScrollView, StyleSheet, Dimensions, View, KeyboardAvoidingView } from "react-native"
import { Portal, Dialog, TextInput, List, Button, Paragraph } from "react-native-paper"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import theWeek from "../../utilities/theWeek";

export default class NewTaskDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <Portal>
                <Dialog
                    visible={this.props.dialogToggle}
                    onDismiss={this.props.dismissDialogToggle}
                    style={!this.props.keyboardOpen ? styles.dialogContainer :  {
                        maxHeight: Dimensions.get('window').height - 100, 
                        marginBottom: this.props.keyboardHeight - 70
                        }}>
                    <Dialog.Title>Task</Dialog.Title>
                    <Dialog.Content>
                        <TextInput 
                            mode="outlined"
                            label="Input"
                            multiline={true}
                            numberOfLines={3}
                            error={this.props.taskInputError}
                            style={{minHeight: 80, maxHeight: 125}}
                            onChangeText={this.props.taskInputChange}
                            value={this.props.taskInput}
                            ref={this.props.textInputRef}
                        />
                        {this.props.taskInputError ? <Paragraph style={{color: "#C00000"}}>
                            {this.props.taskInputErrorText}
                        </Paragraph> : null}
                    </Dialog.Content>
                    <Dialog.Content>
                        <List.Accordion
                            title={this.props.dayOfTheWeek}
                            expanded={this.props.dialogListToggle}
                            onPress={() => {
                                this.props.toggleDialogList();
                                this.props.textInputRef.current.blur();
                            }}
                            style={{marginBottom: 0}}>
                            <Dialog.ScrollArea style={{marginBottom: 0}}>
                            <ScrollView style={{maxHeight: Dimensions.get("window").height / 5, marginBottom: 0}}>
                                {theWeek.map((day, index) => {
                                return (
                                    <List.Item 
                                    key={index}
                                    onPress={() => {
                                        this.props.dismissDialogList();
                                        this.props.setDayOfTheWeek(day);
                                    }} 
                                    title={day}
                                    />
                                )
                                })}                               
                            </ScrollView>
                            </Dialog.ScrollArea>
                        </List.Accordion>
                    </Dialog.Content>
                    <Dialog.Actions style={{marginTop: 0,}}>
                        <Button
                            onPress={this.props.dismissDialogToggle}>Cancel
                        </Button>
                        <Button
                            onPress={this.props.creatingTask}>Create
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        )
    }
}

const styles = StyleSheet.create({
    dialogContainer: {
        maxHeight: Dimensions.get('window').height - 100, 
    },
})
