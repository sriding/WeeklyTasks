import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Switch, Caption } from "react-native-paper";
import { getAppFunctionality } from "../../controllers/database/Settings/settings";
import {
  newWeekStandardBehavior,
  newWeekAlternativeBehavior,
} from "../../controllers/database/Login/login";

export default function AppFunctionality() {
  const [standardBehaviorSwitch, setStandardBehaviorSwitch] = React.useState(
    false
  );
  const [
    alternativeBehaviorSwitch,
    setAlternativeBehaviorSwitch,
  ] = React.useState(false);

  React.useEffect(() => {
    try {
      const appFunctionality = getAppFunctionality();

      switch (appFunctionality) {
        case "Alternative":
          setAlternativeBehaviorSwitch(true);
          setStandardBehaviorSwitch(false);
          newWeekAlternativeBehavior();
        case "Standard":
        default:
          newWeekStandardBehavior().then(() => {
            setStandardBehaviorSwitch(true);
            setAlternativeBehaviorSwitch(false);
          });
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const changeStandardBehaviorSwitch = () => {
    setStandardBehaviorSwitch(!standardBehaviorSwitch);
    setAlternativeBehaviorSwitch(!alternativeBehaviorSwitch);
  };

  const changeAlternativeBehaviorSwitch = () => {
    setAlternativeBehaviorSwitch(!alternativeBehaviorSwitch);
    setStandardBehaviorSwitch(!standardBehaviorSwitch);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.standardBehaviorView}>
        <Switch
          value={standardBehaviorSwitch}
          onValueChange={changeStandardBehaviorSwitch}
          style={styles.standardBehaviorSwitch}
        />
        <View>
          <Text style={styles.standardBehaviorText}>
            At the end of each week, checked off tasks are unchecked and carried
            over.
          </Text>
          <Caption>Default behavior.</Caption>
        </View>
      </View>
      <View style={styles.alternativeBehaviorView}>
        <Switch
          value={alternativeBehaviorSwitch}
          onValueChange={changeAlternativeBehaviorSwitch}
          style={styles.alternativeBehaviorSwitch}
        />
        <Text style={styles.alternativeBehaviorText}>
          At the end of each week, checked off tasks are deleted.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    maxWidth: "85%",
  },
  standardBehaviorView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  standardBehaviorSwitch: {
    marginRight: 5,
  },
  standardBehaviorText: {
    fontSize: 17,
  },
  alternativeBehaviorView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  alternativeBehaviorSwitch: {
    marginRight: 5,
  },
  alternativeBehaviorText: {
    fontSize: 17,
  },
});
