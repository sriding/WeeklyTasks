import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Switch, Caption, Text } from "react-native-paper";
import {
  changeDailyUpdatePersistance,
  getDailyUpdatePersistance,
} from "../../controllers/database/Settings/settings";
import { backgroundFetch } from "../../services/Index";

export default function DailyPersistence() {
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  React.useEffect(() => {
    getDailyUpdatePersistance().then((data: any) => {
      setIsSwitchOn(data);
    });
  }, []);

  const onToggleSwitch = async () => {
    setIsSwitchOn(!isSwitchOn);
    try {
      await changeDailyUpdatePersistance(!isSwitchOn);
      if (!isSwitchOn === true && Platform.OS === "android") {
        await backgroundFetch.configure();
        backgroundFetch.scheduleTaskInitialNotification();
      }
    } catch (err) {}
  };

  return (
    <View style={styles.mainView}>
      <View style={styles.subView}>
        <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
        <Text style={{ fontSize: 22 }}>Persistent</Text>
      </View>
      <Caption style={styles.caption}>
        Experimental and may drain battery.
      </Caption>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    marginLeft: 8,
  },
  subView: {
    flexDirection: "row",
  },
  caption: {
    marginLeft: 6,
  },
});
