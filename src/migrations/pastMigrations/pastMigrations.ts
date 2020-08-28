const Realm = require("realm");

import { DayModel } from "../../models/database/DayModels";
import { LoginModel } from "../../models/database/LoginModels";
import { TaskModel } from "../../models/database/TaskModels";
import { NoteModel } from "../../models/database/NoteModels";
import { SettingsModel } from "../../models/database/SettingsModels";

import reminderTimes from "../../utilities/reminderTimes";

export const pastMigrations = async (): Promise<void> => {
  //Version 5
  try {
    Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 5,
      migration: (oldRealm: any, newRealm: any) => {
        if (oldRealm.schemaVersion < 5) {
          const oldObjects = oldRealm.objects("Task");
          const newObjects = newRealm.objects("Task");

          for (let i = 0; i < oldObjects.length; i++) {
            newObjects[i].reminderTimeValue =
              reminderTimes[oldObjects[i].reminderTime];
          }
        }
      },
    }).then((realm: any) => {
      realm.close();

      //Version 6
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
                newObjects[i].noteFunctionality = "standard";
              }
            }
          },
        }).then((realm: any) => {
          realm.close();
        });
      } catch (err) {
        return JSON.stringify(err);
      }
    });
  } catch (err) {
    return JSON.stringify(err);
  }
};
