import { getSortTasksBy } from "../../Settings/settings";
import { getASingleDaysDataEH } from "../../../../validation/getASingleDaysDataEH";

export const getASingleDaysData = async (dayID: string): Promise<any> => {
  try {
    let errorsObject = getASingleDaysDataEH(dayID);
    if (errorsObject.errorsExist) {
      throw errorsObject.errors;
    }

    let sortedTaskData: any[] = [];
    let sortedTaskDataChecked: any[] = [];

    let realmTaskDataSortedByReminderTime = global.realmContainer
      .objects("Task")
      .filtered(`day == "${dayID}"`)
      .sorted("reminderTimeValue");

    let realmTaskDataSortedByDescendingId = global.realmContainer
      .objects("Task")
      .filtered(`day == "${dayID}"`)
      .sorted("id", true);

    let realmDayData = global.realmContainer
      .objects("Day")
      .filtered(`id == "${dayID}"`);

    let mark = await getSortTasksBy();

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

        errorsObject = null;
        sortedTaskDataChecked: null;
        realmTaskDataSortedByReminderTime = null;
        realmTaskDataSortedByDescendingId = null;
        mark = null;

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
    return JSON.stringify(err);
  }
};
