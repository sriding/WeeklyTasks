import React from 'react'

import { List } from "react-native-paper"

import theWeek from "./../../utilities/theWeek";

import {
    NavigationParams,
    NavigationScreenProp,
    NavigationState,
  } from 'react-navigation';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';

  interface AppProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>,
    date: string
  }
export default function SideBar(props: AppProps) {
    return (
        <ScrollView>
        <List.Section>
            <List.Subheader>Days</List.Subheader>
            {theWeek.map((day, index) => {
            return (
                <List.Item 
                    key={index}
                    title={day}
                    titleStyle={{fontSize: 14}}
                    onPress={() => {
                        props.navigation.navigate("Day", {
                            id: day
                        })
                    }}
                />
            )
            })}
        </List.Section>
        <TouchableHighlight onPress={() => {
            props.navigation.navigate("Settings", {
                navigation: props.navigation,
            })
        }}>
            <List.Icon color="black" icon="settings" />
        </TouchableHighlight>
        </ScrollView>
    )
}
