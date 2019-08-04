import React, { Fragment } from 'react'
import {
    StyleSheet,
    View
  } from 'react-native';
import { Card, Title, Paragraph, Subheading, Text } from 'react-native-paper';

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
          {props.dayInformation && props.dayInformation.tasks.length !== 0 ? props.dayInformation.tasks.map((task) => {
            return (task.isChecked ? 
              <View key={task.id} style={{flexDirection: "row"}}>
              <Paragraph>{`\u2022 `}</Paragraph>
              <Paragraph style={{textDecorationLine: 'line-through', textDecorationStyle: "solid"}}>{task.text}</Paragraph>
              </View> :
              <Paragraph key={task.id}>{`\u2022 ${task.text}`}</Paragraph>
            )
          }) : <Text>...</Text>}
        </Card.Content>
        <Card.Content style={styles.noteContainer}>
          <Subheading>Note</Subheading>
          {props.dayInformation ? 
          <Paragraph>{props.dayInformation.note.text.length === 0 ? 
           "..." : "\u2022 " + props.dayInformation.note.text}</Paragraph> : null }
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
