import React from 'react'

import { List } from "react-native-paper"

import theWeek from "./../../utilities/theWeek";

import {
    NavigationParams,
    NavigationScreenProp,
    NavigationState,
  } from 'react-navigation';

  interface AppProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>,
  }
export default function SideBar(props: AppProps) {
    return (
        <List.Section style={{minHeight: "100%"}}>
            <List.Subheader>Days</List.Subheader>
            {theWeek.map((day, index) => {
            return (
                <List.Item 
                    key={index}
                    title={day}
                    onPress={() => {
                        props.navigation.navigate("Day", {
                            id: day
                        })
                    }}
                />
            )
            })}
        </List.Section>
    )
}
