import React from 'react'
import {
    View,
    Text,
    StyleSheet
  } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Subheading } from 'react-native-paper';

export default function DayCard(props) {
    return (
    <Card onPress={() => {props.navigation.navigate("DayScreen")}} style={styles.cardContainer}>
        <Card.Content>
          <Title>Monday</Title>
          <Subheading>Tasks</Subheading>
          <Paragraph>Number one.</Paragraph>
          <Paragraph>Number two.</Paragraph>
        </Card.Content>
        <Card.Content>
          <Subheading>Note</Subheading>
          <Paragraph>There will be one note available per card/per day.</Paragraph>
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
