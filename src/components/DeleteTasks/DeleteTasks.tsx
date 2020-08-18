import React from "react";
import { Button } from "react-native-paper";
import { StyleSheet } from "react-native";
import { AppProps } from "./DeleteTasks.interface";

export default function DeleteTasks(props: AppProps) {
  const deleteTasks = () => {
    props.deleteTasks();
  };

  return (
    <Button
      mode="contained"
      onPress={deleteTasks}
      contentStyle={styles.buttonStyling}
    >
      Delete Tasks
    </Button>
  );
}

const styles = StyleSheet.create({
  buttonStyling: {
    height: 60,
    width: 170,
  },
});
