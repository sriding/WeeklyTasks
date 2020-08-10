//React Native modules
import "react-native-gesture-handler";
import { AppRegistry } from "react-native";

//Components
import App from "./App";

//Services
import { configure } from "./src/services/pushNotifications";

//Migrations
import { pastMigrations } from "./src/migrations/pastMigrations/pastMigrations";
import { currentMigration } from "./src/migrations/currentMigration/currentMigration";

import { name as appName } from "./app.json";

configure()
  .then(async () => {
    try {
      await pastMigrations();
      const expectVoid = await currentMigration();
      if (expectVoid !== null && expectVoid !== undefined) {
        throw expectVoid;
      }
    } catch (err) {
      console.log("Migration:", err);
    }
  })
  .then(() => AppRegistry.registerComponent(appName, () => App));
