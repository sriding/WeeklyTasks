const Realm = require("realm");

import {
  DaySchema,
  TaskSchema,
  NoteSchema,
  LoginSchema,
  SettingsSchema,
} from "../schemas/schemas";

import { pushNotifications } from "./../services/Index";
import theWeek from "../utilities/theWeek";

export const createInitialDays = async () => {
  try {
    const realmContainer = await Realm.open({
      schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema],
      schemaVersion: 5,
    });

    if (
      realmContainer.objects("Settings")[0] &&
      realmContainer.objects("Day")[0]
    ) {
      return null;
    }

    if (!realmContainer.objects("Settings")[0]) {
      realmContainer.write(() => {
        realmContainer.create("Settings", {
          id: 0,
          dailyUpdate: true,
          dailyUpdatePersistance: false,
          dailyUpdateTime: "9:00 AM",
          taskReminders: true,
          sortTasksBy: "Reminder Time",
          theme: "light",
        });
      });
    }

    if (!realmContainer.objects("Day")[0]) {
      realmContainer.write(() => {
        for (let i = 0; i < theWeek.length; i++) {
          realmContainer.create("Day", {
            id: theWeek[i],
            tasks: [
              {
                id: i,
                day: theWeek[i],
                text: "Create tasks for the day here.",
                isChecked: false,
                reminder: false,
                reminderTime: "N/A",
                reminderTimeValue: 0,
              },
            ],
            note: { id: i, text: "Create a note for the day here." },
          });
        }
      });
    }

    pushNotifications.sendLocalNotification();
  } catch (err) {
    return err.toString();
  }
};
