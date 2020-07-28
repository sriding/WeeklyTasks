const Realm = require("realm");

import { DayModel } from "../../models/database/DayModels";
import { LoginModel } from "../../models/database/LoginModels";
import { TaskModel } from "../../models/database/TaskModels";
import { NoteModel } from "../../models/database/NoteModels";
import { SettingsModel } from "../../models/database/SettingsModels";

import { reminderTimes } from "../../utilities/reminderTimes";

//MAKE SURE THAT IF YOU MAKE ANY NEW CHANGES HERE TO ISSUE A NEW MIGRATION, YOU ADD THE CODE THAT IS
//ALREADY HERE TO THE PAST MIGRATIONS FILE!
export const currentMigration = async () => {
  //Version 5 --->
  await Realm.open({
    schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
    schemaVersion: 5,
    migration: (oldRealm: any, newRealm: any) => {
      if (oldRealm.schemaVersion < 5) {
        const oldObjects = oldRealm.objects("Task");
        const newObjects = newRealm.objects("Task");

        // loop through all objects and set the name property in the new schema
        for (let i = 0; i < oldObjects.length; i++) {
          newObjects[i].reminderTimeValue =
            reminderTimes[oldObjects[i].reminderTime];
        }
      }
    },
  });
  // <---
};
