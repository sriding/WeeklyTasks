import React from 'react'

import { ScrollView, StyleSheet, Dimensions, Platform } from "react-native"
import { Portal, Dialog, TextInput, List, Button, Paragraph } from "react-native-paper"

import theWeek from "../../utilities/theWeek";

interface AppProps {
    dialogToggle: boolean,
    dialogListToggle: boolean,
    dismissDialogToggle: () => void,
    dismissDialogList: () => void,
    taskInputChange: (text: string) => void,
    taskInput: string
    textInputRef: React.RefObject<TextInput>,
    toggleDialogList: () => void,
    creatingTask: () => void,
    setDayOfTheWeek: (day: string) => void,
    dayOfTheWeek: string,
    taskInputError: boolean,
    taskInputErrorText: string,
    keyboardHeight: number,
    keyboardOpen: boolean
}

export default function NewTaskDialog(props: AppProps) {
        return (
            <Portal>
                <Dialog
                    visible={props.dialogToggle}
                    onDismiss={props.dismissDialogToggle}
                    style={!props.keyboardOpen ?  {maxHeight: Dimensions.get('window').height, elevation: 10}  :  {
                        maxHeight: Dimensions.get('window').height - props.keyboardHeight - 50, 
                        marginBottom: props.keyboardHeight,
                        elevation: 10
                        }}>
                    {props.keyboardHeight > 0 ? null : <Dialog.Title>Task</Dialog.Title> }
                    <Dialog.Content>
                        <TextInput 
                            mode="outlined"
                            multiline={true}
                            numberOfLines={3}
                            placeholder="Input"
                            error={props.taskInputError}
                            style={{minHeight: 80, maxHeight: 125}}
                            onChangeText={props.taskInputChange}
                            value={props.taskInput}
                            onKeyPress={(e) => {
                                if(e.nativeEvent.key == "Enter"){
                                    props.textInputRef.current!.blur();
                                }
                            }}
                            ref={props.textInputRef}
                        />
                        {props.taskInputError ? <Paragraph style={{color: "#C00000"}}>
                            {props.taskInputErrorText}
                        </Paragraph> : null}
                    </Dialog.Content>
                    {Platform.OS == "ios" && Dimensions.get("window").width > Dimensions.get("window").height && props.keyboardHeight > 0 ? null : 
                    <Dialog.Content>
                        <List.Accordion
                            title={props.dayOfTheWeek}
                            expanded={props.dialogListToggle}
                            onPress={() => {
                                props.toggleDialogList();
                                props.textInputRef.current!.blur();
                            }}
                            style={{marginBottom: 0}}>
                            <Dialog.ScrollArea style={{marginBottom: 0}}>
                            <ScrollView style={{maxHeight: Dimensions.get("window").height / 5, marginBottom: 0}}>
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
                    }
                    {Platform.OS === "ios" && Dimensions.get("window").width > Dimensions.get("window").height && props.keyboardHeight > 0 ? null : 
                    <Dialog.Actions style={{marginTop: 0,}}>
                        <Button
                            onPress={props.dismissDialogToggle}>Cancel
                        </Button>
                        <Button
                            onPress={props.creatingTask}>Create
                        </Button>
                    </Dialog.Actions>
                    }
                </Dialog>
            </Portal>
        )
}
