import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Title, Paragraph, Text, Divider } from "react-native-paper";
import { AppProps } from "./HomeScreenCard.interface";

export default function HomeScreenCard(props: AppProps) {
  return (
    <Card
      onPress={() => {
        props.navigation.navigate("Day", {
          id: props.dayInformation.id,
        });
      }}
      style={{
        ...styles.cardContainer,
        shadowColor: props.theme === "light" ? "#6200ee" : "#383838",
      }}
    >
      <Card.Content style={styles.tasksTitleAndTasksContainer}>
        <Card.Title
          title={props.dayInformation && props.dayInformation.id}
          titleStyle={styles.cardTitle}
          style={styles.cardTitleStyle}
        />
        <Title style={styles.cardTasksTitle}>Tasks</Title>
        <View style={styles.tasksContainer}>
          {props.dayInformation && props.dayInformation.tasks.length !== 0 ? (
            props.dayInformation.tasks.map((task, index, array) => {
              return task.isChecked ? (
                <View key={task.id} style={styles.taskContainer}>
                  <Paragraph style={styles.tasksTextLineThrough}>
                    {task.text}
                  </Paragraph>
                  {index + 1 !== array.length ? <Divider /> : null}
                </View>
              ) : (
                <View key={task.id} style={styles.taskContainer}>
                  <View style={styles.taskAndTimeContainer}>
                    <Paragraph style={styles.tasksText}>{task.text}</Paragraph>
                    <Paragraph style={styles.tasksReminderTime}>
                      {task.reminderTime}
                    </Paragraph>
                  </View>
                  {index + 1 !== array.length ? <Divider /> : null}
                </View>
              );
            })
          ) : (
            <Text>...</Text>
          )}
        </View>
      </Card.Content>
      <Card.Content style={styles.noteContainer}>
        <Title style={styles.noteTitle}>Note</Title>
        {props.dayInformation ? (
          <Paragraph style={styles.noteText}>
            {props.dayInformation.note.text.length === 0
              ? "..."
              : props.dayInformation.note.text}
          </Paragraph>
        ) : null}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginTop: 25,
    marginBottom: 8,
    shadowRadius: 4,
    elevation: 3,
  },
  tasksTitleAndTasksContainer: {},
  cardTitleStyle: {
    elevation: 10,
    margin: 27,
    padding: 13,
    backgroundColor: "#6200ee",
    borderRadius: 40,
  },
  cardTitle: {
    fontSize: 30,
    textAlign: "center",
    color: "white",
  },
  cardTasksTitle: {
    fontSize: 26,
    marginBottom: 10,
    textDecorationStyle: "solid",
    textDecorationLine: "underline",
  },
  tasksContainer: {
    marginBottom: 20,
  },
  taskContainer: {
    marginTop: 12,
    marginBottom: 12,
    justifyContent: "center",
  },
  taskAndTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexGrow: 1,
  },
  tasksText: {
    fontSize: 19,
    width: "70%",
    flexWrap: "wrap",
    lineHeight: 30,
  },
  tasksTextLineThrough: {
    fontSize: 19,
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    width: "75%",
    flexWrap: "wrap",
  },
  tasksReminderTime: {
    fontSize: 19,
    color: "gray",
  },
  noteContainer: {
    marginBottom: 20,
  },
  noteTitle: {
    fontSize: 26,
    marginTop: 8,
    marginBottom: 10,
    textDecorationStyle: "solid",
    textDecorationLine: "underline",
  },
  noteText: {
    fontSize: 19,
    lineHeight: 30,
  },
});
