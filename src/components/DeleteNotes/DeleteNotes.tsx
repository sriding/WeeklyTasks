import React from "react";
import { Button } from "react-native-paper";
import { StyleSheet } from "react-native";
import { AppProps } from "./DeleteNotes.interface";

export default function DeleteTasks(props: AppProps) {
  const deleteNotes = () => {
    props.deleteNotes();
  };

  return (
    <Button
      mode="contained"
      onPress={deleteNotes}
      contentStyle={styles.buttonStyling}
    >
      Delete Notes
    </Button>
  );
}

const styles = StyleSheet.create({
  buttonStyling: {
    height: 60,
    width: 170,
  },
});
