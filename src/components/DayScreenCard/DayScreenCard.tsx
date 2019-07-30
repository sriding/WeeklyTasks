import React, { Component } from 'react'
import { StyleSheet ,Text, View, TextInput as NativeTextInput} from 'react-native'

import { Card, Button, TextInput, Paragraph } from 'react-native-paper';

export default function DayScreenCard(props) {
        return (
            <Card style={styles.cardContainer}>
            <Card.Content>
                <Button mode="contained" style={styles.subHeadingText}>Tasks</Button>
                <View style={styles.addTaskEntry}>
                    <Text style={styles.plusSign}>{"\u002B"}</Text>
                    <TextInput style={styles.newTaskInput}
                        label="New Task"
                        mode="flat"
                        multiline={true}
                    ></TextInput>
                </View>
                {props.Day && props.Day.tasks.map((task) => {
                    return (
                        <View key={task.id}>
                            <NativeTextInput value={`\u2022 ${task.text}`} multiline={true} style={styles.paragraphText}></NativeTextInput>
                            <View style={styles.buttonCombiner}>
                                <Button mode="outlined" style={styles.buttonStyle} icon="check-circle" onPress={() => {
                                    props.checkTask(task.id)
                                }}>Check</Button>
                                <Button mode="outlined" style={styles.buttonStyle} color="#C00000" icon="highlight-off" onPress={() => {
                                    props.deleteTask(task.id)
                                }}>Delete</Button>
                            </View>
                        </View>
                    )
                })}
            </Card.Content>
            <Card.Content>
                <Button mode="contained" style={styles.subHeadingText}>Note</Button>
                <Paragraph style={styles.paragraphText}>{props.Day && `\u2022 ${props.Day.note.text}`}</Paragraph>
                <Button mode="outlined" color="#C00000" style={styles.buttonStyleNote} icon="highlight-off" onPress={() => {
                    props.deleteNote(props.Day.note.id);
                }}>Delete</Button>
            </Card.Content>
        </Card>
        )
}

const styles = StyleSheet.create({
    cardContainer: {
        alignItems: "center",
        textAlign: "center",
        maxWidth: "90%",
        minHeight: "90%",
        marginTop: 20,
        shadowColor: "#000000",
        shadowRadius: 4,
        shadowOffset: {
          width: 0,
          height: 3
        },
    },
    addTaskEntry: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20
    },
    plusSign: {
        width: "3%",
    },
    newTaskInput: {
        backgroundColor: "white",
        width: "90%",
    },
    buttonCombiner: {
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "space-around",
        marginBottom: 20,
        marginTop: 9
    },
    buttonStyle: {
        width: 100,
        borderRadius: 30
    },
    buttonStyleNote: {
        width: 100,
        borderRadius: 30,
        marginBottom: 20,
        marginTop: 9
    },
    subHeadingText: {
        maxWidth: 130,
        marginTop: 5,
        marginBottom: 25,
    },
    paragraphText: {
        marginBottom: 15,
        backgroundColor: "white",
        fontSize: 19
    },
})