const Realm = require("realm");
import { DayModel } from "../../../../models/database/DayModels";
import { TaskModel } from "../../../../models/database/TaskModels";
import { NoteModel } from "../../../../models/database/NoteModels";
import { LoginModel } from "../../../../models/database/LoginModels";
import { SettingsModel } from "../../../../models/database/SettingsModels";

import { getSortTasksBy } from "../../Settings/settings";

export const getASingleDaysData = async (dayID: string) => {
  try {
    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 5,
    });

    let sortedTaskData = [];
    let sortedTaskDataChecked: any[] = [];

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
        realmTaskDataSortedByDescendingId.forEach((tasks: any) => {
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
        realmTaskDataSortedByReminderTime.forEach((tasks: any) => {
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
