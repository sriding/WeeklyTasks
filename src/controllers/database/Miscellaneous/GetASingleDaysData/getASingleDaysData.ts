const Realm = require("realm");
import { DayModel } from "../../../../models/database/DayModels";
import { TaskModel } from "../../../../models/database/TaskModels";
import { NoteModel } from "../../../../models/database/NoteModels";
import { LoginModel } from "../../../../models/database/LoginModels";
import { SettingsModel } from "../../../../models/database/SettingsModels";

import { getSortTasksBy } from "../../Settings/settings";

export const getASingleDaysData = async (dayID: string): Promise<any> => {
  try {
    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 5,
    });

    let sortedTaskData: any[] = [];
    let sortedTaskDataChecked: any[] = [];

    let realmTaskDataSortedByReminderTime = realmContainer
      .objects("Task")
      .filtered(`day == "${dayID}"`)
      .sorted("reminderTimeValue");

    let realmTaskDataSortedByDescendingId = realmContainer
      .objects("Task")
      .filtered(`day == "${dayID}"`)
      .sorted("id", true);

    let realmDayData = realmContainer
      .objects("Day")
      .filtered(`id == "${dayID}"`);

    const mark = await getSortTasksBy();

    switch (mark) {
      case "Recently Added":
        realmTaskDataSortedByDescendingId.forEach((realmTasks: any) => {
          if (realmTasks.isChecked === true) {
            sortedTaskDataChecked.push({
              id: realmTasks.id,
              day: realmTasks.day,
              text: realmTasks.text,
              isChecked: realmTasks.isChecked,
              reminder: realmTasks.reminder,
              reminderTime: realmTasks.reminderTime,
              reminderTimeValue: realmTasks.reminderTimeValue,
            });
          } else {
            sortedTaskData.push({
              id: realmTasks.id,
              day: realmTasks.day,
              text: realmTasks.text,
              isChecked: realmTasks.isChecked,
              reminder: realmTasks.reminder,
              reminderTime: realmTasks.reminderTime,
              reminderTimeValue: realmTasks.reminderTimeValue,
            });
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
        realmTaskDataSortedByReminderTime.forEach((realmTasks: any) => {
          if (realmTasks.isChecked === false) {
            sortedTaskData.push({
              id: realmTasks.id,
              day: realmTasks.day,
              text: realmTasks.text,
              isChecked: realmTasks.isChecked,
              reminder: realmTasks.reminder,
              reminderTime: realmTasks.reminderTime,
              reminderTimeValue: realmTasks.reminderTimeValue,
            });
          } else {
            sortedTaskDataChecked.push({
              id: realmTasks.id,
              day: realmTasks.day,
              text: realmTasks.text,
              isChecked: realmTasks.isChecked,
              reminder: realmTasks.reminder,
              reminderTime: realmTasks.reminderTime,
              reminderTimeValue: realmTasks.reminderTimeValue,
            });
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
    return err;
  }
};
