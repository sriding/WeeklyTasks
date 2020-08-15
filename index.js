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

import { registerHeadlessFunction } from "./src/services/backgroundFetch";

configure()
  .then(async () => {
    try {
      //Run Migrations for Realm
      await pastMigrations();
      const expectVoid = await currentMigration();
      if (expectVoid !== null && expectVoid !== undefined) {
        throw expectVoid;
      }

      //Create global for if the user opens the app by clicking on a notification
      global.notificationClicked = false;

      //Register the function that runs if persistent daily notifications is enabled
      registerHeadlessFunction();
    } catch (err) {
      console.log("Migration: ", err);
    }
  })
  .then(() => AppRegistry.registerComponent(appName, () => App));
