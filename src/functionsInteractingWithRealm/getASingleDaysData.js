const Realm = require("realm");
import {
  DaySchema,
  TaskSchema,
  NoteSchema,
  LoginSchema,
  SettingsSchema,
} from "./../schemas/schemas";

import { getSortTasksBy } from "./../functionsInteractingWithRealm/settings";

export const getASingleDaysData = async (dayID) => {
  try {
    const realmContainer = await Realm.open({
      schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema],
      schemaVersion: 5,
    });

    let sortedTaskData = [];
    let sortedTaskDataChecked = [];

    let realmTaskDataSortedByReminderTime = realmContainer
      .objects("Task")
      .filtered(`day == "${dayID}"`)
      .sorted("reminderTimeValue");

    let realmTaskDataSortedByDescendingId = realmContainer
      .objects("Task")
      .filtered(`day == "${dayID}"`)
      .sorted("id", true);

    let realmDayData = realmContainer.objects("Day").filtered(`id == ${dayID}`);

    const mark = await getSortTasksBy();

    switch (mark) {
      case "Recently Added":
        realmTaskDataSortedByDescendingId.forEach((tasks) => {
          if (tasks.isChecked === true) {
            sortedTaskDataChecked.push({ tasks });
          } else {
            sortedTaskData.push({ tasks });
          }
        });

        sortedTaskData.push(...sortedTaskDataChecked);

        return {
          id: realmDayData[0].id,
          tasks: sortedTaskData,
          note: {
            id: realmDayData[0].note.id,
            text: realmDayData[0].note.text,
          },
        };

      case "Reminder Time":
      default:
        realmTaskDataSortedByReminderTime.forEach((tasks) => {
          if (tasks.isChecked === false) {
            sortedTaskData.push({ tasks });
          } else {
            sortedTaskDataChecked.push({ tasks });
          }
        });

        sortedTaskData.push(...sortedTaskDataChecked);

        return {
          id: realmDayData[0].id,
          tasks: sortedTaskData,
          note: {
            id: realmDayData[0].note.id,
            text: realmDayData[0].note.text,
          },
        };
    }
  } catch (err) {
    return err.toString();
  }
};
