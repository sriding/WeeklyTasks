import React from "react";
import { StyleSheet, View, Dimensions, ScrollView } from "react-native";
import { Chip, TextInput } from "react-native-paper";
import { deleteAllTasks } from "../../functionsInteractingWithRealm/tasks";

interface AppProps {
  firstScrollView: React.RefObject<ScrollView>;
  newTaskTextRef: React.RefObject<TextInput>;
  toggleFabButtonOptions: () => void;
  checkAllTasks: () => void;
  deleteAllTasks: () => void;
  topOffset: number;
  theme: string;
}

const DayScreenFabButtonOptions = (props: AppProps) => {
  return (
    <View style={{ ...styles.chipStyles, top: props.topOffset - 100 }}>
      <Chip
        textStyle={{ fontSize: 15 }}
        style={{
          ...styles.chipStyleAdd,
          backgroundColor: props.theme === "light" ? "#EDF0FF" : "#121212",
        }}
        icon="plus"
        mode="outlined"
        onPress={() => {
          props.firstScrollView.current!.scrollTo({ x: 0, y: 0 });
          props.newTaskTextRef.current!.focus();
          props.toggleFabButtonOptions();
        }}
      >
        Add Task
      </Chip>
      <Chip
        textStyle={{ fontSize: 15 }}
        style={{
          ...styles.chipStyleCheck,
          backgroundColor: props.theme === "light" ? "#EDF0FF" : "#121212",
        }}
        icon="check"
        mode="outlined"
        onPress={() => {
          props.checkAllTasks();
          props.toggleFabButtonOptions();
        }}
      >
        Check All
      </Chip>
      <Chip
        textStyle={{ fontSize: 15 }}
        style={{
          ...styles.chipStyleDelete,
          backgroundColor: props.theme === "light" ? "#EDF0FF" : "#121212",
        }}
        icon="delete"
        mode="outlined"
        onPress={() => {
          props.deleteAllTasks();
          props.toggleFabButtonOptions();
        }}
      >
        Delete All
      </Chip>
    </View>
  );
};

const styles = StyleSheet.create({
  chipStyles: {
    position: "absolute",
    right: 70,
    zIndex: 2,
  },
  chipStyleAdd: {
    marginBottom: 15,
    paddingLeft: 7,
    paddingRight: 7,
  },
  chipStyleCheck: {
    marginBottom: 15,
    paddingLeft: 7,
    paddingRight: 7,
  },
  chipStyleDelete: {
    marginBottom: 15,
    paddingLeft: 7,
    paddingRight: 7,
  },
});

export default DayScreenFabButtonOptions;
