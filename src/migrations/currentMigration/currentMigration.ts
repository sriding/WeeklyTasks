const Realm = require("realm");

import { DayModel } from "../../models/database/DayModels";
import { LoginModel } from "../../models/database/LoginModels";
import { TaskModel } from "../../models/database/TaskModels";
import { NoteModel } from "../../models/database/NoteModels";
import { SettingsModel } from "../../models/database/SettingsModels";

//MAKE SURE THAT IF YOU MAKE ANY NEW CHANGES HERE TO ISSUE A NEW MIGRATION, YOU ADD THE CODE THAT IS
//ALREADY HERE TO THE PAST MIGRATIONS FILE!
export const currentMigration = async (): Promise<void> => {
  try {
    Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 6,
      migration: (oldRealm: any, newRealm: any) => {
        if (oldRealm.schemaVersion < 6) {
          const oldObjects = oldRealm.objects("Settings");
          const newObjects = newRealm.objects("Settings");

          for (let i = 0; i < oldObjects.length; i++) {
            newObjects[i].appFunctionality = "standard";
          }
        }
      },
    }).then((realm: any) => {
      console.log(Realm.defaultPath);
      global.realmContainer = realm;
    });
  } catch (err) {
    return JSON.stringify(err);
  }
};
