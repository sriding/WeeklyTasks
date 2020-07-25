import "react-native-gesture-handler";

import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import { configure } from "./src/services/pushNotifications";

configure().then(AppRegistry.registerComponent(appName, () => App));
