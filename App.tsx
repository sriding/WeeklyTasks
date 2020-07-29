//React Native modules
import React from "react";

//React Native Paper modules
import {
  Provider as PaperProvider,
  DefaultTheme,
  DarkTheme,
} from "react-native-paper";

//Functions
import { getTheme } from "./src/controllers/database/Settings/settings";
import { currentMigration } from "./src/migrations/currentMigration/currentMigration";
import { pastMigrations } from "./src/migrations/pastMigrations/pastMigrations";

//React Native Navigation modules
import { NavigationContainer } from "@react-navigation/native";
import MyDrawer from "./src/navigation/drawer/Drawer";
import { AppProps, AppState } from "./App.interface";

class App extends React.PureComponent<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      theme: DefaultTheme,
    };
  }

  componentDidMount = async () => {
    try {
      await pastMigrations();
      await currentMigration();
      //pushNotifications.testLocalNotifications();
      //pushNotifications.removeAllLocalNotifications();
    } catch (err) {
      //Serious error if this bugs.
      console.log(err);
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
