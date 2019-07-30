import React, { Component } from 'react'
import { StyleSheet ,Text, View, TextInput as NativeTextInput} from 'react-native'

import { Card, Button, TextInput, Paragraph } from 'react-native-paper';

import { addTask } from "./../../functionsInteractingWithRealm/tasks";

export default class DayScreenCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newTaskText: "",
        }
    }

    clearTaskText = () => {
        addTask(this.state.newTaskText, this.props.id)
        .then(() => {
            this.props.submitTaskText();
        })
        .then(() => {
            this.props.newTaskTextRef.current.blur();
            setTimeout(() => {
                this.setState({
                    newTaskText: ""
                })
            }, 800)
        })
        .catch((error) => {
            console.log(error);
        })
    }

    render() {
        return (
            <Card style={styles.cardContainer}>
                <Card.Content>
                    <Button mode="contained" style={styles.subHeadingText}>Tasks</Button>
                    <View style={styles.addTaskEntry}>
                        <Text style={styles.plusSign}>{"\u002B"}</Text>
                        <TextInput style={styles.newTaskInput}
                            ref={this.props.newTaskTextRef}
                            label="New Task"
                            mode="flat"
                            multiline={true}
                            numberOfLines={4}
                            value={this.state.newTaskText}
                            onChangeText={text => {
                                this.setState({
                                    newTaskText: text
                                })
                            }}
                            onSubmitEditing={this.clearTaskText}
                        ></TextInput>
                    </View>
                    {this.props.Day && this.props.Day.tasks.map((task) => {
                        return (
                            <View key={task.id}>
                                <NativeTextInput 
                                    value={`\u2022 ${task.text}`} 
                                    multiline={true} 
                                    style={styles.paragraphText}
                                    onFocus={() => {
                                        styles.paragraphText.backgroundColor
                                    }}
                                    >
                                </NativeTextInput>
                                <View style={styles.buttonCombiner}>
                                    <Button mode="outlined" style={styles.buttonStyle} icon="check-circle" onPress={() => {
                                        this.props.checkTask(task.id)
                                    }}>Check</Button>
                                    <Button mode="outlined" style={styles.buttonStyle} color="#C00000" icon="highlight-off" onPress={() => {
                                        this.props.deleteTask(task.id)
                                    }}>Delete</Button>
                                </View>
                            </View>
                        )
                    })}
                </Card.Content>
                <Card.Content>
                    <Button mode="contained" style={styles.subHeadingText}>Note</Button>
                    <Paragraph style={styles.paragraphText}>{this.props.Day && `\u2022 ${this.props.Day.note.text}`}</Paragraph>
                    <Button mode="outlined" color="#C00000" style={styles.buttonStyleNote} icon="highlight-off" onPress={() => {
                        this.props.deleteNote(this.props.Day.note.id);
                    }}>Delete</Button>
                </Card.Content>
            </Card>
        )
    }
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
        marginTop: 15,
        marginBottom: 25,
    },
    paragraphText: {
        marginBottom: 15,
        backgroundColor: "white",
        fontSize: 19
    },
})