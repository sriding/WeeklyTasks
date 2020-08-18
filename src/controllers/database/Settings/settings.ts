//Services
import { pushNotifications } from "../../../services/Index";
import {
  changeDailyUpdateEH,
  changeDailyUpdatePersistanceEH,
  changeDailyUpdateTimeEH,
  changeTaskRemindersEH,
  changeSortTasksByEH,
  changeThemeEH,
} from "../../../validation/settingsEH";

export const getAppFunctionality = () => {
  try {
    if (global.realmContainer.objects("Settings")[0] === undefined) {
      return true;
    } else {
      return global.realmContainer.objects("Settings")[0].appFunctionality;
    }
  } catch (err) {
    return JSON.stringify(err);
  }
};

export const getDailyUpdate = async (): Promise<boolean> => {
  try {
    if (global.realmContainer.objects("Settings")[0] === undefined) {
      return true;
    } else {
      return global.realmContainer.objects("Settings")[0].dailyUpdate;
    }
  } catch (err) {
    return JSON.stringify(err);
  }
};

//Not implemented yet
export const getDailyUpdatePersistance = async (): Promise<boolean> => {
  try {
    return global.realmContainer.objects("Settings")[0].dailyUpdatePersistance;
  } catch (err) {
    return JSON.stringify(err);
  }
};

export const getDailyUpdateTime = async (): Promise<string> => {
  try {
    if (global.realmContainer.objects("Settings")[0] === undefined) {
      return "9:00 AM";
    } else {
      return global.realmContainer.objects("Settings")[0].dailyUpdateTime;
    }
  } catch (err) {
    return JSON.stringify(err);
  }
};

export const getTaskReminders = async (): Promise<boolean> => {
  try {
    return global.realmContainer.objects("Settings")[0].taskReminders;
  } catch (err) {
    return JSON.stringify(err);
  }
};

export const getSortTasksBy = async (): Promise<string> => {
  try {
    return global.realmContainer.objects("Settings")[0].sortTasksBy;
  } catch (err) {
    return JSON.stringify(err);
  }
};

export const getTheme = async (): Promise<string> => {
  try {
    if (global.realmContainer.objects("Settings")[0] === undefined) {
      return "light";
    } else {
      return global.realmContainer.objects("Settings")[0].theme;
    }
  } catch (err) {
    return JSON.stringify(err);
  }
};

export const setAppFunctionality = (bool: boolean = true): void => {
  try {
    global.realmContainer.write(() => {
      if (bool) {
        global.realmContainer.create(
          "Settings",
          {
            id: 0,
            appFunctionality: "standard",
          },
          true
        );
      } else {
        global.realmContainer.create(
          "Settings",
          {
            id: 0,
            appFunctionality: "alternative",
          },
          true
        );
      }
    });
  } catch (err) {
    return JSON.stringify(err);
  }
};

export const changeDailyUpdate = async (
  bool: boolean = true
): Promise<void> => {
  try {
    const errorsObject = changeDailyUpdateEH(bool);
    if (errorsObject.errorsExist) {
      throw errorsObject.errors;
    }

    global.realmContainer.write(() => {
      global.realmContainer.create(
        "Settings",
        {
          id: 0,
          dailyUpdate: bool,
        },
        true
      );
    });

    const updateTime = await getDailyUpdateTime();
    if (typeof updateTime !== "string") {
      throw updateTime;
    }

    if (bool === true) {
      await pushNotifications.createDailyRepeatingNotification(updateTime);
    } else if (bool === false) {
      await pushNotifications.removeDailyRepeatingNotifications();
    }
  } catch (err) {
    return JSON.stringify(err);
  }
};

//Not implemented yet
export const changeDailyUpdatePersistance = async (
  bool: boolean = true
): Promise<void> => {
  try {
    const errorsObject = changeDailyUpdatePersistanceEH(bool);
    if (errorsObject.errorsExist) {
      throw errorsObject.errors;
    }

    global.realmContainer.write(() => {
      global.realmContainer.create(
        "Settings",
        {
          id: 0,
          dailyUpdatePersistance: bool,
        },
        true
      );
    });
    //pushNotifications.sendLocalNotification();
  } catch (err) {
    return JSON.stringify(err);
  }
};

export const changeDailyUpdateTime = async (
  string: string = "9:00 AM"
): Promise<void> => {
  try {
    const errorsObject = changeDailyUpdateTimeEH(string);
    if (errorsObject.errorsExist) {
      throw errorsObject.errors;
    }

    global.realmContainer.write(() => {
      global.realmContainer.create(
        "Settings",
        {
          id: 0,
          dailyUpdateTime: string,
        },
        true
      );
    });

    await pushNotifications.createDailyRepeatingNotification(string);
  } catch (err) {
    return JSON.stringify(err);
  }
};

export const changeTaskReminders = async (
  bool: boolean = true
): Promise<void> => {
  try {
    const errorsObject = changeTaskRemindersEH(bool);
    if (errorsObject.errorsExist) {
      throw errorsObject.errors;
    }

    global.realmContainer.write(() => {
      global.realmContainer.create(
        "Settings",
        {
          id: 0,
          taskReminders: bool,
        },
        true
      );
    });

    if (bool === true) {
      await pushNotifications.addingAllTasksNotifications();
    } else if (bool === false) {
      await pushNotifications.removingAllTasksNotifications();
    }
  } catch (err) {
    return JSON.stringify(err);
  }
};

export const changeSortTasksBy = async (
  string: string = "Reminder Time"
): Promise<void> => {
  try {
    const errorsObject = changeSortTasksByEH(string);
    if (errorsObject.errorsExist) {
      throw errorsObject.errors;
    }

    global.realmContainer.write(() => {
      global.realmContainer.create(
        "Settings",
        {
          id: 0,
          sortTasksBy: string,
        },
        true
      );
    });
  } catch (err) {
    return JSON.stringify(err);
  }
};

export const changeTheme = async (string: string = "light"): Promise<void> => {
  try {
    const errorsObject = changeThemeEH(string);
    if (errorsObject.errorsExist) {
      throw errorsObject.errors;
    }

    global.realmContainer.write(() => {
      global.realmContainer.create(
        "Settings",
        {
          id: 0,
          theme: string,
        },
        true
      );
    });
  } catch (err) {
    return JSON.stringify(err);
  }
};

export const getNotesFunctionality = () => {
  try {
    if (global.realmContainer.objects("Settings")[0] === undefined) {
      return "standard";
    } else {
      return global.realmContainer.objects("Settings")[0].noteFunctionality;
    }
  } catch (err) {
    return JSON.stringify(err);
  }
};

export const setNotesFunctionality = (name: string = "standard") => {
  global.realmContainer.write(() => {
    switch (name) {
      case "alternative":
        global.realmContainer.create(
          "Settings",
          {
            id: 0,
            noteFunctionality: "alternative",
          },
          true
        );
        break;
      case "standard":
      default:
        global.realmContainer.create(
          "Settings",
          {
            id: 0,
            noteFunctionality: "standard",
          },
          true
        );
    }
  });
};
