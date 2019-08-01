import React from 'react'

import { ScrollView, StyleSheet, Dimensions } from "react-native"
import { Portal, Dialog, TextInput, List, Button, Paragraph } from "react-native-paper"

import theWeek from "../../utilities/theWeek";

    export default function NewTaskDialog(props) {
        return (
            <Portal>
                <Dialog
                    visible={props.dialogToggle}
                    onDismiss={props.dismissDialogToggle}
                    style={{maxHeight: Dimensions.get('window').height - 100 }}>
                    <Dialog.Title>Task</Dialog.Title>
                    <Dialog.Content>
                        <TextInput 
                            mode="outlined"
                            label="Input"
                            multiline={true}
                            numberOfLines={4}
                            error={props.taskInputError}
                            style={{minHeight: 80, maxHeight: 300}}
                            onChangeText={props.taskInputChange}
                            value={props.taskInput}
                            ref={props.textInputRef}
                        />
                        {props.taskInputError ? <Paragraph style={{color: "#C00000"}}>
                            {props.taskInputErrorText}
                        </Paragraph> : null}
                    </Dialog.Content>
                    <Dialog.Title style={{marginTop: 0}}>Day</Dialog.Title>
                    <Dialog.Content>
                        <List.Accordion
                            title={props.dayOfTheWeek}
                            expanded={props.dialogListToggle}
                            onPress={() => {
                                props.toggleDialogList();
                                props.textInputRef.current.blur();
                            }}>
                            <Dialog.ScrollArea>
                            <ScrollView style={{maxHeight: Dimensions.get("window").height / 4}}>
                                {theWeek.map((day, index) => {
                                return (
                                    <List.Item 
                                    key={index}
                                    onPress={() => {
                                        props.dismissDialogList();
                                        props.setDayOfTheWeek(day);
                                    }} 
                                    title={day}
                                    />
                                )
                                })}                               
                            </ScrollView>
                            </Dialog.ScrollArea>
                        </List.Accordion>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button
                            onPress={props.dismissDialogToggle}>Cancel
                        </Button>
                        <Button
                            onPress={props.creatingTask}>Create
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        )
    }

const styles = StyleSheet.create({
    dialogButtons: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginTop: 0,
        marginBottom: 20
      }
})
