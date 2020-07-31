//Realm modules
const Realm = require("realm");

//Models
import { DayModel } from "../../../models/database/DayModels";
import { TaskModel } from "../../../models/database/TaskModels";
import { NoteModel } from "../../../models/database/NoteModels";
import { LoginModel } from "../../../models/database/LoginModels";
import { SettingsModel } from "../../../models/database/SettingsModels";

//Services
import { pushNotifications } from "../../../services/Index";

//Utilities
import { reminderTimes } from "../../../utilities/reminderTimes";

//Error Handling
import {
  addEH,
  updateEH,
  checkEH,
  deleteEH,
  checkAllDeleteAllGetDayTaskIdsEH,
  getTaskEH,
} from "../../../error-handling/tasksEH";

export const getTask = async (taskId: number): Promise<any> => {
  const errorObject = getTaskEH(taskId);
  if (errorObject.errorsExist) {
    throw errorObject.errors;
  }

  const realmContainer = await Realm.open({
    schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
    schemaVersion: 5,
  });

  const realmTaskArray = realmContainer
    .objects("Task")
    .filtered(`id == "${taskId}"`);

  return {
    id: realmTaskArray[0].id,
    day: realmTaskArray[0].day,
    text: realmTaskArray[0].text,
    isChecked: realmTaskArray[0].isChecked,
    reminder: realmTaskArray[0].reminder,
    reminderTime: realmTaskArray[0].reminderTime,
    reminderTimeValue: realmTaskArray[0].reminderTimeValue,
  };
};

export const addTask = async (
  text: string,
  dayID: string,
  reminder: boolean = false,
  reminderTime: string = "12:00 PM"
): Promise<void> => {
  try {
    const errorObject = addEH(text, dayID, reminder, reminderTime);
    if (errorObject.errorsExist) {
      throw errorObject.errors;
    }

    const trimmedText = text.trim();

    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 5,
    });

    let arrayOfTaskIds: number[] = [];
    realmContainer.objects("Task").forEach((task: any) => {
      arrayOfTaskIds.push(task.id);
    });
    let newTaskId = Math.max(...arrayOfTaskIds) + 1;

    realmContainer.write(() => {
      const newTask = realmContainer.create("Task", {
        id: newTaskId,
        day: dayID,
        text: trimmedText,
        isChecked: false,
        reminder,
        reminderTime,
        reminderTimeValue: reminderTimes[reminderTime],
      });

      let weekdayToUpdate = realmContainer.create(
        "Day",
        {
          id: dayID,
        },
        true
      );

      weekdayToUpdate.tasks.push(newTask);
    });

    await pushNotifications.addARepeatingLocalNotification(newTaskId);
  } catch (err) {
    return err;
  }
};

export const updateTask = async (
  text: string,
  taskId: number,
  reminder: boolean = false,
  reminderTime: string = "12:00 PM"
): Promise<void> => {
  try {
    const errorObject = updateEH(text, taskId, reminder, reminderTime);
    if (errorObject.errorsExist) {
      throw errorObject.errors;
    }

    const trimmedText = text.trim();

    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 5,
    });

    realmContainer.write(() => {
      realmContainer.create(
        "Task",
        {
          id: taskId,
          text: trimmedText,
          reminder,
          reminderTime,
          reminderTimeValue: reminderTimes[reminderTime],
        },
        true
      );
    });

    await pushNotifications.removeALocalScheduledNotification(taskId);
    await pushNotifications.addARepeatingLocalNotification(taskId);
  } catch (err) {
    return err;
  }
};

export const checkTask = async (
  taskID: number,
  isChecked: boolean
): Promise<void> => {
  try {
    const errorObject = checkEH(taskID, isChecked);
    if (errorObject.errorsExist) {
      throw errorObject.errors;
    }

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

    if (isChecked === true) {
      await pushNotifications.unCheckingATaskNotification(taskID);
    } else if (isChecked === false) {
      await pushNotifications.checkingATaskNotification(taskID, 1);
    }
  } catch (err) {
    return err;
  }
};

export const deleteTask = async (taskID: number): Promise<void> => {
  try {
    const errorObject = deleteEH(taskID);
    if (errorObject.errorsExist) {
      throw errorObject.errors;
    }

    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 5,
    });

    realmContainer.write(() => {
      let taskToDelete = realmContainer.create("Task", { id: taskID }, true);
      realmContainer.delete(taskToDelete);
    });

    pushNotifications.removeALocalScheduledNotification(taskID);
  } catch (err) {
    return err;
  }
};

export const checkAllTasks = async (day: string): Promise<void> => {
  try {
    const errorObject = checkAllDeleteAllGetDayTaskIdsEH(day);
    if (errorObject.errorsExist) {
      throw errorObject.errors;
    }

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
    });

    const taskIdsArray = await getAllUncheckedTaskIdsForASingleDay(day);

    //Adjust to read in parallel later
    for (let taskIds of taskIdsArray) {
      await pushNotifications.removeALocalScheduledNotification(taskIds);
    }
  } catch (err) {
    return err;
  }
};

export const deleteAllTasks = async (day: string): Promise<void> => {
  try {
    const errorObject = checkAllDeleteAllGetDayTaskIdsEH(day);
    if (errorObject.errorsExist) {
      throw errorObject.errors;
    }

    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 5,
    });

    realmContainer.write(() => {
      realmContainer.delete(
        realmContainer.objects("Task").filtered(`day == "${day}"`)
      );
    });

    const taskIdsArray = await getAllTaskIdsForASingleDay(day);

    //Adjust to read in parallel later
    for (let taskIds of taskIdsArray) {
      await pushNotifications.removeALocalScheduledNotification(taskIds);
    }
  } catch (err) {
    return err;
  }
};

export const unCheckEveryTaskInTheDatabase = async (): Promise<void> => {
  try {
    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 5,
    });

    realmContainer.write(() => {
      let amountOfTasks = realmContainer.objects("Task");
      for (let task of amountOfTasks) {
        task.isChecked = false;
      }
    });
  } catch (err) {
    return err;
  }
};

export const getAllUncheckedTaskIdsForASingleDay = async (
  day: string
): Promise<number[]> => {
  try {
    const errorObject = checkAllDeleteAllGetDayTaskIdsEH(day);
    if (errorObject.errorsExist) {
      throw errorObject.errors;
    }

    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 5,
    });

    const taskObjectsArray = realmContainer
      .objects("Task")
      .filtered(`day == "${day}" AND isChecked == ${false}`);

    console.log(taskObjectsArray);

    let taskIdsArray: number[] = [];

    taskObjectsArray.forEach((task: any) => {
      taskIdsArray.push(task.id);
    });

    return taskIdsArray;
  } catch (err) {
    return err;
  }
};

export const getAllCheckedTaskIdsForASingleDay = async (
  day: string
): Promise<number[]> => {
  try {
    const errorObject = checkAllDeleteAllGetDayTaskIdsEH(day);
    if (errorObject.errorsExist) {
      throw errorObject.errors;
    }

    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 5,
    });

    const taskObjectsArray = realmContainer
      .objects("Task")
      .filtered(`day == "${day}" AND isChecked == ${true}`);

    let taskIdsArray: number[] = [];

    taskObjectsArray.forEach((task: any) => {
      taskIdsArray.push(task.id);
    });

    return taskIdsArray;
  } catch (err) {
    return err;
  }
};

export const getAllTaskIdsForASingleDay = async (
  day: string
): Promise<number[]> => {
  try {
    const errorObject = checkAllDeleteAllGetDayTaskIdsEH(day);
    if (errorObject.errorsExist) {
      throw errorObject.errors;
    }

    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 5,
    });

    const taskObjectsArray = realmContainer
      .objects("Task")
      .filtered(`day == "${day}"`);

    let taskIdsArray: number[] = [];

    taskObjectsArray.forEach((task: any) => {
      taskIdsArray.push(task.id);
    });

    return taskIdsArray;
  } catch (err) {
    return err;
  }
};
