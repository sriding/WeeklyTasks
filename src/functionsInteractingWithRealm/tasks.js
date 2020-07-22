const Realm = require("realm");
import {
  DaySchema,
  TaskSchema,
  NoteSchema,
  LoginSchema,
  SettingsSchema,
} from "./../schemas/schemas";

import { pushNotifications } from "./../services/Index";
import timeValues from "./../utilities/timeValues";

export const addTask = async (
  text,
  dayID,
  reminder = false,
  reminderTime = "12:00 PM"
) => {
  try {
    let trimmedText = text.trim();
    if (trimmedText.length === 0) {
      return "No text!";
    } else if (trimmedText.length > 350) {
      return "Cannot exceed 350 characters.";
    }

    const realmContainer = await Realm.open({
      schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema],
      schemaVersion: 5,
    });
    if (realmContainer.objects("Day").filtered(`id = "${dayID}"`).length > 15) {
      return null;
    }
    const arrayOfIds = [];
    realmContainer.objects("Task").forEach((task) => {
      arrayOfIds.push(task.id);
    });
    realmContainer.write(() => {
      let newTask = realmContainer.create("Task", {
        id: Math.max(...arrayOfIds) + 1,
        day: dayID,
        text: trimmedText,
        isChecked: false,
        reminder,
        reminderTime,
        reminderTimeValue: timeValues[reminderTime],
      });
      let dayToUpdate = realmContainer.create(
        "Day",
        {
          id: dayID,
        },
        true
      );
      return dayToUpdate.tasks.push(newTask);
    });
    pushNotifications.sendLocalNotification();
    return null;
  } catch (err) {
    return err.toString();
  }
};

export const updateTask = async (
  text,
  taskID,
  reminder = false,
  reminderTime = "12:00 PM"
) => {
  try {
    let trimmedText = text.trim();
    if (trimmedText.length === 0) {
      return "No text!";
    } else if (trimmedText.length > 350) {
      return "Cannot exceed 350 characters.";
    }
    const realmContainer = await Realm.open({
      schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema],
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
          reminderTimeValue: timeValues[reminderTime],
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

export const checkTask = async (taskID, isChecked) => {
  try {
    const realmContainer = await Realm.open({
      schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema],
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

export const deleteTask = async (taskID) => {
  try {
    const realmContainer = await Realm.open({
      schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema],
      schemaVersion: 5,
    });
    realmContainer.write(() => {
      let taskToDelete = realmContainer.create("Task", { id: taskID }, true);
      realmContainer.delete(taskToDelete);
    });
    pushNotifications.sendLocalNotification();
    return null;
  } catch (err) {
    return err.toString();
  }
};

export const checkAllTasks = async (day) => {
  try {
    const realmContainer = await Realm.open({
      schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema],
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

export const deleteAllTasks = async (day) => {
  try {
    const realmContainer = await Realm.open({
      schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema],
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
      schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema],
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

export const getAmountOfTasksForTheDay = async (day = "Monday") => {
  try {
    const realmContainer = await Realm.open({
      schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema],
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
