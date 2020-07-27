import React from "react";
import {
  Provider as PaperProvider,
  DefaultTheme,
  DarkTheme,
} from "react-native-paper";

import { pushNotifications } from "./src/services/Index";
import { getTheme } from "./src/controllers/database/Settings/settings";
import { NavigationContainer } from "@react-navigation/native";
import MyDrawer from "./src/navigation/drawer/Drawer";
import { currentMigration } from "./src/migrations/currentMigration/currentMigration";
import { pastMigrations } from "./src/migrations/pastMigrations/pastMigrations";

class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      theme: null,
    };
  }

  componentDidMount = async () => {
    await pastMigrations();
    await currentMigration();
    //pushNotifications.testLocalNotifications();
    //pushNotifications.removeAllLocalNotifications();

    const themeName = await getTheme();
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
