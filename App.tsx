//React Native modules
import React from "react";
import { Platform } from "react-native";

//React Native Paper modules
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";

//Functions
import {
  getTheme,
  getDailyUpdatePersistance,
} from "./src/controllers/database/Settings/settings";
import { createInitialDays } from "./src/controllers/database/Miscellaneous/CreateInitialDays/createInitialDays";

//React Native Navigation modules
import { NavigationContainer } from "@react-navigation/native";
import MyDrawer from "./src/navigation/drawer/Drawer";
import { AppProps, AppState } from "./App.interface";

//Utilities
import DarkTheme from "./src/utilities/darkTheme";

//Services
import { testLocalNotifications } from "./src/services/pushNotifications";
import { backgroundFetch } from "./src/services/Index";
import BackgroundFetch from "react-native-background-fetch";

class App extends React.PureComponent<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      theme: DefaultTheme,
    };
  }

  componentDidMount = async () => {
    //testLocalNotifications();
    let dailyUpdate = await getDailyUpdatePersistance();
    if (Platform.OS === "android" && dailyUpdate) {
      BackgroundFetch.configure(
        {
          minimumFetchInterval: 1440, // <-- minutes (15 is minimum allowed)
          // Android options
          forceAlarmManager: false, // <-- Set true to bypass JobScheduler.
          stopOnTerminate: false,
          startOnBoot: false,
          enableHeadless: true,
        },
        async (taskId) => {
          // This is the fetch-event callback.
          console.log("[BackgroundFetch] taskId: ", taskId);

          // Use a switch statement to route task-handling.
          switch (taskId) {
            case "com.foo.customtask":
              console.log("Received custom task");
              //scheduleTaskOngoingNotification();
              break;
            case "bonkers":
              console.log("Bonkers!");
              break;
            default:
              console.log("Default fetch task");
          }
          // Finish, providing received taskId.
          BackgroundFetch.finish(taskId);
        }
      );
      backgroundFetch.scheduleTaskInitialNotification();
    }

    try {
      let expectVoid: void = await createInitialDays();
      if (expectVoid !== undefined && expectVoid !== null) {
        throw expectVoid;
      }
    } catch (err) {
      console.log("Creating initial days: ", err);
    }

    try {
      let themeName: string = await getTheme();
      switch (themeName) {
        case "dark":
          this.setState({
            theme: DarkTheme,
          });
          break;
        case "light":
        default:
          this.setState({
            theme: DefaultTheme,
          });
      }
    } catch (err) {
      this.setState({
        theme: DefaultTheme,
      });
    }
  };

  componentWillUnmount = () => {
    //close global realm
    if (global.realmContainer !== null && !global.realmContainer.isClosed) {
      global.realmContainer.close();
    }
  };

  render() {
    return (
      <PaperProvider theme={this.state.theme}>
        <NavigationContainer>
          <MyDrawer />
        </NavigationContainer>
      </PaperProvider>
    );
  }
}

export default App;
