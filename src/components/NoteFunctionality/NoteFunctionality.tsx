import React from "react";
import { View, StyleSheet } from "react-native";
import { Switch, Text } from "react-native-paper";
import {
  setNotesFunctionality,
  getNotesFunctionality,
} from "../../controllers/database/Settings/settings";

export default function NoteFunctionality() {
  const [switchValue, setSwitchValue] = React.useState<boolean>(false);

  React.useEffect(() => {
    const noteFunctionality = getNotesFunctionality();
    switch (noteFunctionality) {
      case "alternative":
        setSwitchValue(true);
        break;
      case "standard":
      default:
        setSwitchValue(false);
    }
  }, []);

  const changeSwitchValue = () => {
    setSwitchValue(!switchValue);
    if (!switchValue === true) {
      setNotesFunctionality("alternative");
    } else {
      setNotesFunctionality("standard");
    }
  };

  return (
    <View style={styles.mainViewContainer}>
      <Switch value={switchValue} onValueChange={changeSwitchValue} />
      <Text style={styles.switchText}>
        At the end of each week, all notes are deleted.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mainViewContainer: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "85%",
    marginTop: 10,
    marginBottom: 10,
  },
  switchText: {
    fontSize: 17,
    marginLeft: 5,
  },
});
