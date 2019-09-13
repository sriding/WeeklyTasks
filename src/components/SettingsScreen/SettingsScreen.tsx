import React, { Component } from 'react'
import { Text, View, SafeAreaView, ScrollView, StyleSheet } from 'react-native'
import { Headline, Switch, Paragraph, Divider, Subheading, Menu, Button } from 'react-native-paper'
import {
    NavigationParams,
    NavigationScreenProp,
    NavigationState,
  } from 'react-navigation';

import moment from "moment";

import Header from "./../Header/Header";
import SetReminder from "./../SetReminder/SetReminder";

interface AppProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

interface AppState {
    date: string
    dailyUpdateSwitch: boolean,
    tasksRemindersSwitch: boolean,
    dailyUpdateReminder: boolean,
    dailyUpdatePersistenceSwitch: boolean,
    sortTasksMenu: boolean,
    sortTasksOption: string,
    darkThemeSwitch: boolean,
    dailyUpdateReminderTime: string
}

export default class SettingsScreen extends Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = {
            date: moment().format('YYYY-MM-DD'),
            dailyUpdateSwitch: true,
            tasksRemindersSwitch: true,
            dailyUpdateReminder: true,
            dailyUpdatePersistenceSwitch: false,
            sortTasksMenu: false,
            sortTasksOption: "Reminder Time",
            darkThemeSwitch: false,
            dailyUpdateReminderTime: "10:00AM"
        }
    }

    changeReminderTime = (time: string) => {
        this.setState({
            dailyUpdateReminderTime: time
        })
    }

    render() {
        return (
            <SafeAreaView style={{backgroundColor: "#EDF0FF", minHeight: "100%"}}>
                    <Header 
                        title="Settings" 
                        date={this.state.date} 
                        navigation={this.props.navigation}/>
                    <ScrollView style={styles.mainContainer}>
                        <Headline>Notifications</Headline>
                        <View style={styles.switchContainer}>
                            <Switch style={styles.switchButton}
                                value={this.state.dailyUpdateSwitch}
                                onValueChange={() => { 
                                    this.setState({ 
                                        dailyUpdateSwitch: !this.state.dailyUpdateSwitch
                                    }) 
                                }
                            }/><Subheading style={{fontSize: 17}}>Daily Update</Subheading>
                        </View>
                        <View style={{...styles.switchContainer, justifyContent: "center", alignItems: "center"}}>
                            <Switch style={{transform: [{scaleX: 0.6}, {scaleY: 0.6}]}}
                            value={this.state.dailyUpdatePersistenceSwitch}
                            onValueChange={() => {
                                this.setState({
                                    dailyUpdatePersistenceSwitch: !this.state.dailyUpdatePersistenceSwitch
                                })
                            }}></Switch>
                            <Paragraph>Persistent Notification (Android Only)</Paragraph>
                        </View>
                        <SetReminder reminder={this.state.dailyUpdateReminder}
                        reminderTime={this.state.dailyUpdateReminderTime}
                        changeReminderTime={this.changeReminderTime}
                        text="Daily update reminder at: " />
                        <View style={styles.switchContainer}>
                            <Switch style={styles.switchButton}
                                value={this.state.tasksRemindersSwitch}
                                onValueChange={() => { 
                                    this.setState({ 
                                        tasksRemindersSwitch: !this.state.tasksRemindersSwitch
                                    }) 
                                }
                            }/>
                            <Subheading style={{fontSize: 17}}>Task Reminders</Subheading>
                        </View>
                        <Divider style={{marginTop: 20, marginBottom: 20}} />
                        <Headline>Tasks</Headline>
                        <View style={{...styles.switchContainer, justifyContent: "center", alignItems: "center"}}>
                            <Subheading>Sort tasks by: </Subheading>
                            <Menu
                            visible={this.state.sortTasksMenu}
                            onDismiss={() => {
                                this.setState({
                                    sortTasksMenu: false
                                })
                            }}
                            anchor={
                                <Paragraph style={{fontSize: 15, padding: 4, margin: 4, 
                                    borderWidth: 1}}
                                    onPress={() => {
                                        this.setState({
                                            sortTasksMenu: true
                                        })
                                    }}>{this.state.sortTasksOption}</Paragraph>
                            }>
                                <Menu.Item onPress={() => {
                                    this.setState({
                                        sortTasksMenu: false,
                                        sortTasksOption: "Reminder Time"
                                    })
                                }} title="Reminder Time" />
                                <Menu.Item onPress={() => {
                                    this.setState({
                                        sortTasksMenu: false,
                                        sortTasksOption: "Recently Added"
                                    })
                                }} title="Recently Added" />
                            </Menu>
                        </View>
                        <Divider style={{marginTop: 20, marginBottom: 20}} />
                        <Headline>Theme</Headline>
                        <View style={styles.switchContainer}>
                            <Switch style={styles.switchButton}
                                    value={this.state.darkThemeSwitch}
                                    onValueChange={() => { 
                                        this.setState({ 
                                            darkThemeSwitch: !this.state.darkThemeSwitch
                                        }) 
                                    }
                                    }/>
                            <Subheading style={{fontSize: 17}}>Dark Theme</Subheading>
                        </View>
                    </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: "white", 
        width: "86%", 
        margin: "7%",
        padding: "4%",
        overflow: "visible",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.7,
        shadowRadius: 1,
        shadowColor: "black"
    },
    switchContainer: {
        display: "flex",
        flexDirection: "row",
    },
    switchButton: {
        transform: [{ scaleX: .75 }, { scaleY: .75 }]
    },
    tasksContainer: {
        marginLeft: 8
    }
})