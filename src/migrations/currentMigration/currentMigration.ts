const Realm = require("realm");

//Models
import { DayModel } from "../../models/database/DayModels";
import { LoginModel } from "../../models/database/LoginModels";
import { TaskModel } from "../../models/database/TaskModels";
import { NoteModel } from "../../models/database/NoteModels";
import { SettingsModel } from "../../models/database/SettingsModels";

//Services
import { pushNotifications } from "../../services/Index";
import {
  getDailyUpdate,
  getTaskReminders,
  getDailyUpdateTime,
} from "../../controllers/database/Settings/settings";

//MAKE SURE THAT IF YOU MAKE ANY NEW CHANGES HERE TO ISSUE A NEW MIGRATION, YOU ADD THE CODE THAT IS
//ALREADY HERE TO THE PAST MIGRATIONS FILE!
export const currentMigration = async (): Promise<void> => {
  try {
    Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 6,
      migration: (oldRealm: any, newRealm: any) => {
        if (oldRealm.schemaVersion < 6) {
          global.migration = true;
          const oldObjects = oldRealm.objects("Settings");
          const newObjects = newRealm.objects("Settings");

          for (let i = 0; i < oldObjects.length; i++) {
            newObjects[i].appFunctionality = "standard";
            newObjects[i].noteFunctionality = "standard";
          }
        }
      },
    }).then(async (realm: any) => {
      //console.log(Realm.defaultPath);
      global.realmContainer = realm;
      if (
        global.migration &&
        realm.objects("Settings")[0] &&
        realm.objects("Day")[0]
      ) {
        console.log("migration code necessary!");
        await pushNotifications.removeAllLocalNotifications();
        const dailyNotifications = await getDailyUpdate();
        const taskNotifications = await getTaskReminders();
        if (dailyNotifications) {
          const dailyReminderTime = await getDailyUpdateTime();
          pushNotifications.createDailyRepeatingNotification(dailyReminderTime);
        }
        if (taskNotifications) {
          await pushNotifications.addingAllTasksNotifications();
        }
        global.migration = false;
      }
    });
  } catch (err) {
    return JSON.stringify(err);
  }
};
