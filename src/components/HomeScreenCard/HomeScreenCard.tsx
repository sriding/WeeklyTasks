import React from 'react'
import {
    StyleSheet
  } from 'react-native';
import { Card, Title, Paragraph, Subheading } from 'react-native-paper';

export default function HomeScreenCard(props) {
    return (
    <Card onPress={() => {
        props.navigation.navigate("Day", {
          id: props.dayInformation.id
        })
      }} style={styles.cardContainer}>
        <Card.Content style={styles.tasksContainer}>
          <Title>{props.dayInformation && props.dayInformation.id}</Title>
          <Subheading>Tasks</Subheading>
          {props.dayInformation && props.dayInformation.tasks.map((task) => {
            return <Paragraph key={task.id}>{`\u2022 ${task.text}`}</Paragraph>
          })}
        </Card.Content>
        <Card.Content style={styles.noteContainer}>
          <Subheading>Note</Subheading>
          <Paragraph>{props.dayInformation && `\u2022 ${props.dayInformation.note.text}`}</Paragraph>
        </Card.Content>
    </Card>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        marginTop: 20,
        marginBottom: 8,
        maxHeight: 450,
        shadowColor: "#4d4dff",
        shadowRadius: 4
    },
    tasksContainer: {
      maxHeight: 330,
      overflow: "hidden"
    },
    noteContainer: {
      maxHeight: 100,
      overflow: "hidden"
    }
})
