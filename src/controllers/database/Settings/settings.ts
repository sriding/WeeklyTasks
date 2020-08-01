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
import {
  changeDailyUpdateEH,
  changeDailyUpdatePersistanceEH,
  changeDailyUpdateTimeEH,
  changeTaskRemindersEH,
  changeSortTasksByEH,
  changeThemeEH,
} from "../../../validation/settingsEH";

export const getDailyUpdate = async (): Promise<boolean> => {
  try {
    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 5,
    });
    if (realmContainer.objects("Settings")[0] === undefined) {
      return true;
    } else {
      return realmContainer.objects("Settings")[0].dailyUpdate;
    }
  } catch (err) {
    return err;
  }
};

//Not implemented yet
export const getDailyUpdatePersistance = async (): Promise<boolean> => {
  try {
    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 5,
    });
    return realmContainer.objects("Settings")[0].dailyUpdatePersistance;
  } catch (err) {
    return err;
  }
};

export const getDailyUpdateTime = async (): Promise<string> => {
  try {
    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 5,
    });
    if (realmContainer.objects("Settings")[0] === undefined) {
      return "9:00 AM";
    } else {
      return realmContainer.objects("Settings")[0].dailyUpdateTime;
    }
  } catch (err) {
    return err;
  }
};

export const getTaskReminders = async (): Promise<boolean> => {
  try {
    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 5,
    });

    return realmContainer.objects("Settings")[0].taskReminders;
  } catch (err) {
    return err;
  }
};

export const getSortTasksBy = async (): Promise<string> => {
  try {
    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 5,
    });

    return realmContainer.objects("Settings")[0].sortTasksBy;
  } catch (err) {
    return err;
  }
};

export const getTheme = async (): Promise<string> => {
  try {
    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 5,
    });

    if (realmContainer.objects("Settings")[0] === undefined) {
      return "light";
    } else {
      return realmContainer.objects("Settings")[0].theme;
    }
  } catch (err) {
    return err;
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

    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 5,
    });

    realmContainer.write(() => {
      realmContainer.create(
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
      await pushNotifications.removeDailyRepeatingNotification();
    }
  } catch (err) {
    return err;
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

    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 5,
    });
    realmContainer.write(() => {
      realmContainer.create(
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
    return err;
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

    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 5,
    });

    realmContainer.write(() => {
      realmContainer.create(
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
    return err;
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

    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 5,
    });

    realmContainer.write(() => {
      realmContainer.create(
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
    return err;
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

    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 5,
    });
    realmContainer.write(() => {
      realmContainer.create(
        "Settings",
        {
          id: 0,
          sortTasksBy: string,
        },
        true
      );
    });
  } catch (err) {
    return err;
  }
};

export const changeTheme = async (string: string = "light"): Promise<void> => {
  try {
    const errorsObject = changeThemeEH(string);
    if (errorsObject.errorsExist) {
      throw errorsObject.errors;
    }

    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 5,
    });

    realmContainer.write(() => {
      realmContainer.create(
        "Settings",
        {
          id: 0,
          theme: string,
        },
        true
      );
    });
  } catch (err) {
    return err;
  }
};
