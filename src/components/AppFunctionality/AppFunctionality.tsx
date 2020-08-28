import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Switch, Caption } from "react-native-paper";
import {
  getAppFunctionality,
  setAppFunctionality,
  getDailyUpdateTime,
} from "../../controllers/database/Settings/settings";
import {
  newWeekStandardBehavior,
  newWeekAlternativeBehavior,
} from "../../controllers/database/Login/login";
import { createDailyRepeatingNotification } from "../../services/pushNotifications";

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
        case "alternative":
          setAlternativeBehaviorSwitch(true);
          setStandardBehaviorSwitch(false);
          newWeekAlternativeBehavior();
          break;
        case "standard":
        default:
          newWeekStandardBehavior().then(() => {
            setStandardBehaviorSwitch(true);
            setAlternativeBehaviorSwitch(false);
          });
          break;
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const changeStandardBehaviorSwitch = async () => {
    setAppFunctionality(standardBehaviorSwitch ? false : true);
    setStandardBehaviorSwitch(!standardBehaviorSwitch);
    setAlternativeBehaviorSwitch(!alternativeBehaviorSwitch);

    let dailyUpdateTime = await getDailyUpdateTime();
    await createDailyRepeatingNotification(dailyUpdateTime);
  };

  const changeAlternativeBehaviorSwitch = async () => {
    setAppFunctionality(alternativeBehaviorSwitch ? true : false);
    setAlternativeBehaviorSwitch(!alternativeBehaviorSwitch);
    setStandardBehaviorSwitch(!standardBehaviorSwitch);

    let dailyUpdateTime = await getDailyUpdateTime();
    await createDailyRepeatingNotification(dailyUpdateTime);
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
