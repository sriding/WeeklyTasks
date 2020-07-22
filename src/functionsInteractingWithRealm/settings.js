const Realm = require("realm");
import {
  DaySchema,
  TaskSchema,
  NoteSchema,
  LoginSchema,
  SettingsSchema,
} from "./../schemas/schemas";

import { pushNotifications } from "./../services/Index";

export const getDailyUpdate = async () => {
  try {
    const realmContainer = await Realm.open({
      schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema],
      schemaVersion: 5,
    });
    if (realmContainer.objects("Settings")[0] === undefined) {
      return true;
    } else {
      return realmContainer.objects("Settings")[0].dailyUpdate;
    }
  } catch (err) {
    return err.toString();
  }
};

export const getDailyUpdatePersistance = async () => {
  try {
    const realmContainer = await Realm.open({
      schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema],
      schemaVersion: 5,
    });
    return realmContainer.objects("Settings")[0].dailyUpdatePersistance;
  } catch (err) {
    return err.toString();
  }
};

export const getDailyUpdateTime = async () => {
  try {
    const realmContainer = await Realm.open({
      schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema],
      schemaVersion: 5,
    });
    if (realmContainer.objects("Settings")[0] === undefined) {
      return "9:00 AM";
    } else {
      return realmContainer.objects("Settings")[0].dailyUpdateTime;
    }
  } catch (err) {
    return err.toString();
  }
};

export const getTaskReminders = async () => {
  try {
    const realmContainer = await Realm.open({
      schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema],
      schemaVersion: 5,
    });
    return realmContainer.objects("Settings")[0].taskReminders;
  } catch (err) {
    return err.toString();
  }
};

export const getSortTasksBy = async () => {
  try {
    const realmContainer = await Realm.open({
      schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema],
      schemaVersion: 5,
    });
    return realmContainer.objects("Settings")[0].sortTasksBy;
  } catch (err) {
    return err.toString();
  }
};

export const getTheme = async () => {
  try {
    const realmContainer = await Realm.open({
      schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema],
      schemaVersion: 5,
    });
    if (realmContainer.objects("Settings")[0] === undefined) {
      return "light";
    } else {
      return realmContainer.objects("Settings")[0].theme;
    }
  } catch (err) {
    return err.toString();
  }
};

export const changeDailyUpdate = async (bool = true) => {
  try {
    const realmContainer = await Realm.open({
      schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema],
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
    pushNotifications.sendLocalNotification();
    return null;
  } catch (err) {
    return err.toString();
  }
};

export const changeDailyUpdatePersistance = async (bool = true) => {
  try {
    const realmContainer = await Realm.open({
      schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema],
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
    pushNotifications.sendLocalNotification();
    return null;
  } catch (err) {
    return err.toString();
  }
};

export const changeDailyUpdateTime = async (string = "9:00 AM") => {
  try {
    const realmContainer = await Realm.open({
      schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema],
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
    pushNotifications.sendLocalNotification();
    return null;
  } catch (err) {
    return err.toString();
  }
};

export const changeTaskReminders = async (bool = true) => {
  try {
    const realmContainer = await Realm.open({
      schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema],
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
    pushNotifications.sendLocalNotification();
    return null;
  } catch (err) {
    return err.toString();
  }
};

export const changeSortTasksBy = async (string = "Reminder Time") => {
  try {
    const realmContainer = await Realm.open({
      schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema],
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
      return null;
    });
  } catch (err) {
    return err.toString();
  }
};

export const changeTheme = async (string = "light") => {
  try {
    const realmContainer = await Realm.open({
      schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema],
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
      return null;
    });
  } catch (err) {
    return err.toString();
  }
};
