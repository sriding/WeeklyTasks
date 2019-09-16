import React, { Component } from 'react'

import { List, Paragraph, Divider } from "react-native-paper"

import theWeek from "./../../utilities/theWeek";

import {
    NavigationParams,
    NavigationScreenProp,
    NavigationState,
  } from 'react-navigation';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import { SafeAreaView, Text, View } from 'react-native';

import { getTheme } from "./../../functionsInteractingWithRealm/settings";
  interface AppProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>,
  }

  interface AppState {
      theme: string
  }
export default class SideBar extends Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = {
            theme: "light"
        }
    }

    componentDidMount = () => {
        getTheme().then((mark) => {
            this.setState({
                theme: mark
            })
        })
    }

    render() {
        return (
            <SafeAreaView style={{backgroundColor: this.state.theme === "light" ? "#fff" : "#171617", minHeight: "100%"}}>
                <List.Section>
                    <View style={{marginBottom: 0}}>
                    <List.Subheader style={{fontSize: 22}}>Days</List.Subheader>
                    <Divider />
                    </View>
                    <ScrollView style={{height: "70%", marginTop: 0}}>
                    {theWeek.map((day, index) => {
                    return (
                        <List.Item 
                            key={index}
                            title={day}
                            titleStyle={{fontSize: 20}}
                            onPress={() => {
                                this.props.navigation.navigate("Day", {
                                    id: day
                                })
                            }}
                        />
                    )
                    })}
                </ScrollView>
                </List.Section>
                <View style={{height: "15%", display: "flex", justifyContent: "center"}}>
                    <List.Item title="Settings" titleStyle={{fontSize: 24}}
                    left={props => <List.Icon {...props} style={{marginLeft: 0, marginRight: 0}} icon="settings" />} 
                    onPress={() => {
                        this.props.navigation.navigate("Settings", {
                            navigation: this.props.navigation,
                        })
                    }}/>
                </View>
            </SafeAreaView>
        )
    }
}
