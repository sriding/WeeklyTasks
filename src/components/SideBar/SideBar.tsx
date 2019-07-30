import React from 'react'

import { List } from "react-native-paper"

import theWeek from "./../../utilities/theWeek";

export default function SideBar(props) {
    return (
        <List.Section>
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
