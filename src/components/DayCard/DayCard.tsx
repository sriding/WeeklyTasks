import React from 'react'
import {
    View,
    Text,
    StyleSheet
  } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Subheading } from 'react-native-paper';

export default function DayCard(props) {
    return (
    <Card onPress={() => {
        props.navigation.navigate("Day", {
          id: props.dayInformation.id
        })
      }} style={styles.cardContainer}>
        <Card.Content>
          <Title>{props.dayInformation && props.dayInformation.id}</Title>
          <Subheading>Tasks</Subheading>
          {props.dayInformation && props.dayInformation.tasks.map((task) => {
            return <Paragraph key={task.id}>{task.text}</Paragraph>
          })}
        </Card.Content>
        <Card.Content>
          <Subheading>Note</Subheading>
          <Paragraph>{props.dayInformation && props.dayInformation.note.text}</Paragraph>
        </Card.Content>
    </Card>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        marginTop: 20,
        shadowColor: "blue",
        shadowRadius: 3,
        shadowOffset: {
          width: 0,
          height: 4
        },
    }
})
