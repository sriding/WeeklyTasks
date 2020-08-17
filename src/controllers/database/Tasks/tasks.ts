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
  tasksForADayEH,
} from "../../../validation/tasksEH";
import { getDailyUpdateTime } from "../Settings/settings";

//Interfaces
import { getTaskReturnType } from "./tasks.interface";

export const getTask = async (
  taskId: number
): Promise<getTaskReturnType | string> => {
  try {
    const errorObject = getTaskEH(taskId);
    if (errorObject.errorsExist) {
      throw errorObject.errors;
    }

    const realmTaskArray = global.realmContainer
      .objects("Task")
      .filtered(`id == "${taskId}"`);

    const task: getTaskReturnType = {
      id: realmTaskArray[0].id,
      day: realmTaskArray[0].day,
      text: realmTaskArray[0].text,
      isChecked: realmTaskArray[0].isChecked,
      reminder: realmTaskArray[0].reminder,
      reminderTime: realmTaskArray[0].reminderTime,
      reminderTimeValue: realmTaskArray[0].reminderTimeValue,
    };

    return task;
  } catch (err) {
    return JSON.stringify(err);
  }
};

export const addTask = async (
  text: string,
  dayID: string,
  reminder: boolean = false,
  reminderTime: string = "12:00 PM"
): Promise<void | string> => {
  try {
    const errorObject = addEH(text, dayID, reminder, reminderTime);
    if (errorObject.errorsExist) {
      throw errorObject.errors;
    }

    const trimmedText = text.trim();

    let arrayOfTaskIds: number[] = [];
    global.realmContainer.objects("Task").forEach((task: any) => {
      arrayOfTaskIds.push(task.id);
    });
    let newTaskId = Math.max(...arrayOfTaskIds) + 1;

    global.realmContainer.write(() => {
      const newTask = global.realmContainer.create("Task", {
        id: newTaskId,
        day: dayID,
        text: trimmedText,
        isChecked: false,
        reminder,
        reminderTime,
        reminderTimeValue: reminderTimes[reminderTime],
      });

      let weekdayToUpdate = global.realmContainer.create(
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
    return JSON.stringify(err);
  }
};

export const updateTask = async (
  text: string,
  taskId: number,
  reminder: boolean = false,
  reminderTime: string = "12:00 PM"
): Promise<void | string> => {
  try {
    const errorObject = updateEH(text, taskId, reminder, reminderTime);
    if (errorObject.errorsExist) {
      throw errorObject.errors;
    }

    const trimmedText = text.trim();

    global.realmContainer.write(() => {
      global.realmContainer.create(
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
    return JSON.stringify(err);
  }
};

export const checkTask = async (
  taskID: number,
  isChecked: boolean
): Promise<void | string> => {
  try {
    const errorObject = checkEH(taskID, isChecked);
    if (errorObject.errorsExist) {
      throw errorObject.errors;
    }

    global.realmContainer.write(() => {
      global.realmContainer.create(
        "Task",
        { id: taskID, isChecked: !isChecked },
        true
      );
    });

    if (isChecked === true) {
      await pushNotifications.checkingATaskNotification(taskID, false);
    } else if (isChecked === false) {
      await pushNotifications.checkingATaskNotification(taskID, true);
    }
  } catch (err) {
    return JSON.stringify(err);
  }
};

export const deleteTask = async (taskID: number): Promise<void | string> => {
  try {
    const errorObject = deleteEH(taskID);
    if (errorObject.errorsExist) {
      throw errorObject.errors;
    }

    //Before deleting the task
    const task = await getTask(taskID);
    await pushNotifications.removeALocalScheduledNotification(taskID);
    await pushNotifications.updateADailyRepeatingNotification(task.day);

    global.realmContainer.write(() => {
      let taskToDelete = global.realmContainer.create(
        "Task",
        { id: taskID },
        true
      );
      global.realmContainer.delete(taskToDelete);
    });
  } catch (err) {
    return JSON.stringify(err);
  }
};

export const checkAllTasks = async (day: string): Promise<void | string> => {
  try {
    const errorObject = checkAllDeleteAllGetDayTaskIdsEH(day);
    if (errorObject.errorsExist) {
      throw errorObject.errors;
    }

    global.realmContainer.write(() => {
      let tasksToCheck = global.realmContainer
        .objects("Task")
        .filtered(`day == "${day}" AND isChecked == ${false}`);

      if (tasksToCheck.length !== 0) {
        for (let task of tasksToCheck) {
          task.isChecked = true;
        }
      } else {
        let tasksToUncheck = global.realmContainer
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

    await pushNotifications.updateADailyRepeatingNotification(day);
  } catch (err) {
    return JSON.stringify(err);
  }
};

export const deleteAllTasks = async (day: string): Promise<void | string> => {
  try {
    const errorObject = checkAllDeleteAllGetDayTaskIdsEH(day);
    if (errorObject.errorsExist) {
      throw errorObject.errors;
    }

    global.realmContainer.write(() => {
      global.realmContainer.delete(
        global.realmContainer.objects("Task").filtered(`day == "${day}"`)
      );
    });

    const taskIdsArray = await getAllTaskIdsForASingleDay(day);

    //Adjust to read in parallel later
    for (let taskIds of taskIdsArray) {
      await pushNotifications.removeALocalScheduledNotification(taskIds);
    }
    await pushNotifications.updateADailyRepeatingNotification(day);
  } catch (err) {
    return JSON.stringify(err);
  }
};

export const removeEveryCheckedTaskInTheDatabase = () => {
  global.realmContainer.write(() => {
    let tasks = global.realmContainer
      .objects("Task")
      .filtered(`isChecked == ${true}`);
    global.realmContainer.delete(tasks);
  });
};

export const unCheckEveryTaskInTheDatabase = async (): Promise<
  void | string
> => {
  try {
    global.realmContainer.write(() => {
      let amountOfTasks = global.realmContainer.objects("Task");
      for (let task of amountOfTasks) {
        task.isChecked = false;
      }
    });

    const reminderTime = await getDailyUpdateTime();
    await pushNotifications.createDailyRepeatingNotification(reminderTime);
  } catch (err) {
    return JSON.stringify(err);
  }
};

export const getAllUncheckedTaskIdsForASingleDay = async (
  day: string
): Promise<number[] | string> => {
  try {
    const errorObject = checkAllDeleteAllGetDayTaskIdsEH(day);
    if (errorObject.errorsExist) {
      throw errorObject.errors;
    }

    const taskObjectsArray = global.realmContainer
      .objects("Task")
      .filtered(`day == "${day}" AND isChecked == ${false}`);

    let taskIdsArray: number[] = [];

    taskObjectsArray.forEach((task: any) => {
      taskIdsArray.push(task.id);
    });

    return taskIdsArray;
  } catch (err) {
    return JSON.stringify(err);
  }
};

export const getAllCheckedTaskIdsForASingleDay = async (
  day: string
): Promise<number[] | string> => {
  try {
    const errorObject = checkAllDeleteAllGetDayTaskIdsEH(day);
    if (errorObject.errorsExist) {
      throw errorObject.errors;
    }

    const taskObjectsArray = global.realmContainer
      .objects("Task")
      .filtered(`day == "${day}" AND isChecked == ${true}`);

    let taskIdsArray: number[] = [];

    taskObjectsArray.forEach((task: any) => {
      taskIdsArray.push(task.id);
    });

    return taskIdsArray;
  } catch (err) {
    return JSON.stringify(err);
  }
};

export const getAllTaskIdsForASingleDay = async (
  day: string
): Promise<number[] | string> => {
  try {
    const errorObject = checkAllDeleteAllGetDayTaskIdsEH(day);
    if (errorObject.errorsExist) {
      throw errorObject.errors;
    }

    const taskObjectsArray = global.realmContainer
      .objects("Task")
      .filtered(`day == "${day}"`);

    let taskIdsArray: number[] = [];

    taskObjectsArray.forEach((task: any) => {
      taskIdsArray.push(task.id);
    });

    return taskIdsArray;
  } catch (err) {
    return JSON.stringify(err);
  }
};

export const tasksForADayOrdered = async (
  day: string,
  reminder: string = "Reminder Time"
): Promise<any[] | string> => {
  try {
    const errorObject = tasksForADayEH(day, reminder);
    if (errorObject.errorsExist) {
      throw errorObject.errors;
    }

    let sortedTasksArray: any[] = [];

    switch (reminder) {
      case "Recently Added":
        const realmObjTasksUnchecked1 = global.realmContainer
          .objects("Task")
          .filtered(`day == "${day}" AND isChecked == ${false}`)
          .sorted("id", true);

        const realmObjTasksChecked1 = global.realmContainer
          .objects("Task")
          .filtered(`day == "${day}" AND isChecked == ${true}`)
          .sorted("id", true);

        realmObjTasksUnchecked1.forEach((task: any) => {
          sortedTasksArray.push(task);
        });

        realmObjTasksChecked1.forEach((task: any) => {
          sortedTasksArray.push(task);
        });

        return sortedTasksArray;
      case "Reminder Time":
      default:
        const realmObjTasksUnchecked2 = global.realmContainer
          .objects("Task")
          .filtered(`day == "${day}" AND isChecked == ${false}`)
          .sorted("reminderTimeValue", false);

        const realmObjTasksChecked2 = global.realmContainer
          .objects("Task")
          .filtered(`day == "${day}" AND isChecked == ${true}`)
          .sorted("reminderTimeValue", false);

        realmObjTasksUnchecked2.forEach((task: any) => {
          sortedTasksArray.push(task);
        });

        realmObjTasksChecked2.forEach((task: any) => {
          sortedTasksArray.push(task);
        });

        return sortedTasksArray;
    }
  } catch (err) {
    return JSON.stringify(err);
  }
};
