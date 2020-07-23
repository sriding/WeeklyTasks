import React from "react";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import color from "color";

import { pushNotifications } from "./src/services/Index";
import { getTheme } from "./src/controllers/database/Settings/settings";
import { NavigationContainer } from "@react-navigation/native";
import MyDrawer from "./src/navigation/drawer/Drawer";
import { lastMigration } from "./src/migrations/currentMigration/currentMigration";
import { pastMigrations } from "./src/migrations/pastMigrations/pastMigrations";

lastMigration();
pushNotifications.configure();

const DarkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: "#171617",
    accent: "#03dac6",
    background: "#121212",
    surface: "#121212",
    error: "#CF6679",
    onBackground: "#FFFFFF",
    onSurface: "#FFFFFF",
    text: "white",
    disabled: color("white").alpha(0.38).rgb().string(),
    placeholder: color("white").alpha(0.54).rgb().string(),
    backdrop: color("black").alpha(0.5).rgb().string(),
    notification: "#ff80ab",
  },
};

class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      theme: null,
    };
  }

  componentDidMount = () => {
    getTheme().then((mark) => {
      this.setState({
        theme: mark === "light" ? DefaultTheme : DarkTheme,
      });
    });
  };

  render() {
    return (
      <PaperProvider
        theme={this.state.theme !== null ? this.state.theme : DefaultTheme}
      >
        <NavigationContainer>
          <MyDrawer />
        </NavigationContainer>
      </PaperProvider>
    );
  }
}

export default App;
