const Realm = require("realm");
import { DayModel } from "../../../models/database/DayModels";
import { TaskModel } from "../../../models/database/TaskModels";
import { NoteModel } from "../../../models/database/NoteModels";
import { LoginModel } from "../../../models/database/LoginModels";
import { SettingsModel } from "../../../models/database/SettingsModels";

import { pushNotifications } from "../../../services/Index";
import { reminderTimes } from "../../../utilities/reminderTimes";

export const addTask = async (
  text: string,
  dayID: string,
  reminder: boolean = false,
  reminderTime: string = "12:00 PM"
) => {
  try {
    let trimmedText = text.trim();
    if (trimmedText.length === 0) {
      return "No text!";
    } else if (trimmedText.length > 350) {
      return "Cannot exceed 350 characters.";
    }

    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 5,
    });
    if (realmContainer.objects("Day").filtered(`id = "${dayID}"`).length > 15) {
      return null;
    }
    const arrayOfIds: number[] = [];
    realmContainer.objects("Task").forEach((task: any) => {
      arrayOfIds.push(task.id);
    });
    await realmContainer.write(() => {
      let newTask = realmContainer.create("Task", {
        id: Math.max(...arrayOfIds) + 1,
        day: dayID,
        text: trimmedText,
        isChecked: false,
        reminder,
        reminderTime,
        reminderTimeValue: reminderTimes[reminderTime],
      });
      let dayToUpdate = realmContainer.create(
        "Day",
        {
          id: dayID,
        },
        true
      );

      pushNotifications.addAWeeklyRepeatingLocalNotification(newTask.id);

      return dayToUpdate.tasks.push(newTask);
    });
    return null;
  } catch (err) {
    return err.toString();
  }
};

export const updateTask = async (
  text: string,
  taskID: number,
  reminder: boolean = false,
  reminderTime: string = "12:00 PM"
) => {
  try {
    let trimmedText = text.trim();
    if (trimmedText.length === 0) {
      return "No text!";
    } else if (trimmedText.length > 350) {
      return "Cannot exceed 350 characters.";
    }
    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 5,
    });
    realmContainer.write(() => {
      realmContainer.create(
        "Task",
        {
          id: taskID,
          text: trimmedText,
          reminder,
          reminderTime,
          reminderTimeValue: reminderTimes[reminderTime],
        },
        true
      );
    });
    pushNotifications.sendLocalNotification();
    return null;
  } catch (err) {
    return err.toString();
  }
};

export const checkTask = async (taskID: number, isChecked: boolean) => {
  try {
    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 5,
    });
    realmContainer.write(() => {
      realmContainer.create(
        "Task",
        { id: taskID, isChecked: !isChecked },
        true
      );
    });
    pushNotifications.sendLocalNotification();
    return null;
  } catch (err) {
    return err.toString();
  }
};

export const deleteTask = async (taskID: number) => {
  try {
    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 5,
    });
    realmContainer.write(() => {
      let taskToDelete = realmContainer.create("Task", { id: taskID }, true);
      realmContainer.delete(taskToDelete);
    });
    pushNotifications.removeALocalScheduledNotification(taskID);
    return null;
  } catch (err) {
    return err.toString();
  }
};

export const checkAllTasks = async (day: string) => {
  try {
    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 5,
    });
    realmContainer.write(() => {
      let tasksToCheck = realmContainer
        .objects("Task")
        .filtered(`day == "${day}" AND isChecked == ${false}`);
      if (tasksToCheck.length !== 0) {
        for (let task of tasksToCheck) {
          task.isChecked = true;
        }
      } else {
        let tasksToUncheck = realmContainer
          .objects("Task")
          .filtered(`day == "${day}"`);
        for (let task of tasksToUncheck) {
          task.isChecked = false;
        }
      }
      return;
    });
  } catch (err) {
    return err.toString();
  }
};

export const deleteAllTasks = async (day: string) => {
  try {
    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 5,
    });
    realmContainer.write(() => {
      realmContainer.delete(
        realmContainer.objects("Task").filtered(`day == "${day}"`)
      );
    });
    pushNotifications.sendLocalNotification();
    return null;
  } catch (err) {
    return err.toString();
  }
};

export const unCheckEveryTaskInTheDatabase = async () => {
  try {
    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 5,
    });
    realmContainer.write(() => {
      let amountOfTasks = realmContainer.objects("Task");
      for (task of amountOfTasks) {
        task.isChecked = false;
      }
      return;
    });
    pushNotifications.sendLocalNotification();
    return null;
  } catch (err) {
    return err.toString();
  }
};

export const getAmountOfTasksForTheDay = async (day: string = "Monday") => {
  try {
    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 5,
    });
    let taskObjects = realmContainer
      .objects("Task")
      .filtered(`day == "${day}" AND isChecked == ${false}`);
    return {
      amount: taskObjects.length,
      taskObjects,
    };
  } catch (err) {
    return err.toString();
  }
};
