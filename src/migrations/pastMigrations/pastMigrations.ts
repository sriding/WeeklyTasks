const Realm = require("realm");

import { DayModel } from "../../models/database/DayModels";
import { LoginModel } from "../../models/database/LoginModels";
import { TaskModel } from "../../models/database/TaskModels";
import { NoteModel } from "../../models/database/NoteModels";
import { SettingsModel } from "../../models/database/SettingsModels";

import reminderTimes from "../../utilities/reminderTimes";

//Version 5
export const pastMigrations = async (): Promise<void> => {
  try {
    Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 5,
      migration: (oldRealm: any, newRealm: any) => {
        if (oldRealm.schemaVersion < 5) {
          global.migration = true;
          const oldObjects = oldRealm.objects("Task");
          const newObjects = newRealm.objects("Task");

          for (let i = 0; i < oldObjects.length; i++) {
            newObjects[i].reminderTimeValue =
              reminderTimes[oldObjects[i].reminderTime];
          }
        }
      },
    }).then((realm: any) => {
      //global.realmContainer = realm;
      realm.close();
    });
  } catch (err) {
    return JSON.stringify(err);
  }
};
