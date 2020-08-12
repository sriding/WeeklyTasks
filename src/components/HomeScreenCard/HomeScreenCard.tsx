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
        shadowColor: props.theme === "light" ? "#6200ee" : "#F5F5F5",
      }}
    >
      <Card.Content style={styles.tasksTitleAndTasksContainer}>
        <Card.Title
          title={props.dayInformation && props.dayInformation.id}
          titleStyle={{
            ...styles.cardTitle,
            color: props.theme === "light" ? "white" : "black",
          }}
          style={{
            ...styles.cardTitleStyle,
            backgroundColor: props.theme === "light" ? "#6200ee" : "#c2c2f0",
          }}
        />
        <Title style={styles.cardTasksTitle}>Tasks</Title>
        <Divider
          style={{
            marginBottom: 10,
            backgroundColor: props.theme === "light" ? "silver" : "white",
          }}
        />
        <View style={styles.tasksContainer}>
          {props.dayInformation && props.dayInformation.tasks.length !== 0 ? (
            props.dayInformation.tasks.map((task, index, array) => {
              return task.isChecked ? (
                <View key={task.id} style={styles.taskContainer}>
                  <Paragraph style={styles.tasksTextLineThrough}>
                    {task.text}
                  </Paragraph>
                  {array.length !== 1 ? (
                    <Divider
                      style={{
                        backgroundColor:
                          props.theme === "light" ? "silver" : "white",
                      }}
                    />
                  ) : null}
                </View>
              ) : (
                <View key={task.id} style={styles.taskContainer}>
                  <View style={styles.taskAndTimeContainer}>
                    <Paragraph style={styles.tasksText}>{task.text}</Paragraph>
                    <Paragraph style={styles.tasksReminderTime}>
                      {task.reminderTime}
                    </Paragraph>
                  </View>
                  {array.length !== 1 ? (
                    <Divider
                      style={{
                        backgroundColor:
                          props.theme === "light" ? "silver" : "white",
                      }}
                    />
                  ) : null}
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
        <Divider
          style={{
            marginBottom: 15,
            backgroundColor: props.theme === "light" ? "silver" : "white",
          }}
        />
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
    shadowRadius: 1,
    elevation: 3,
    width: "97%",
    maxWidth: "97%",
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#F5F5F5",
  },
  cardTitleStyle: {
    elevation: 10,
    margin: 27,
    padding: 13,
    borderRadius: 40,
    maxWidth: 350,
    alignSelf: "center",
  },
  cardTitle: {
    fontSize: 30,
    textAlign: "center",
  },
  cardTasksTitle: {
    fontSize: 26,
    marginBottom: 10,
  },
  tasksContainer: {
    marginBottom: 20,
  },
  taskContainer: {
    marginTop: 12,
    marginBottom: 12,
    marginLeft: 12,
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
    marginBottom: 12,
  },
  noteText: {
    fontSize: 19,
    lineHeight: 30,
    marginLeft: 12,
  },
});
