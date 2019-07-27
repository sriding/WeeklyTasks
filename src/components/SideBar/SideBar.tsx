import React, { Fragment } from 'react'

import { ScrollView, FlatList, Text, StyleSheet } from "react-native"
import { List } from "react-native-paper"

export default function SideBar() {
    const daysOfTheWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
    "Saturday", "Sunday"]

    return (
        <List.Section>
            <List.Subheader>Days</List.Subheader>
            {daysOfTheWeek.map((day, index) => {
            return (
                <List.Item 
                    key={index}
                    title={day}
                />
            )
            })}
        </List.Section>
    )
}

const styles = StyleSheet.create({
    leftPaneText: {
        textAlign: "center",
        fontSize: 22,
        padding: 20
    }
})
