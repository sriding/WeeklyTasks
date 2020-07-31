//React Native modules
import "react-native-gesture-handler";
import { AppRegistry } from "react-native";

//Components
import App from "./App";

//Services
import { configure } from "./src/services/pushNotifications";

import { name as appName } from "./app.json";

configure().then(AppRegistry.registerComponent(appName, () => App));
