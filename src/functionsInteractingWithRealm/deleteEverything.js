const Realm = require("realm");
import {
  DaySchema,
  TaskSchema,
  NoteSchema,
  LoginSchema,
  SettingsSchema,
} from "../schemas/schemas";

import { pushNotifications } from "./../services/Index";

export const deleteEverything = async () => {
  try {
    const realmContainer = await Realm.open({
      schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema],
      schemaVersion: 5,
    });

    realmContainer.write(() => {
      realmContainer.deleteAll();
    });

    pushNotifications.sendLocalNotification();
  } catch (err) {
    return err.toString();
  }
};

export default deleteEverything;
