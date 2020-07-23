const Realm = require("realm");

import { DayModel } from "../../../../models/database/DayModels";
import { TaskModel } from "../../../../models/database/TaskModels";
import { NoteModel } from "../../../../models/database/NoteModels";
import { LoginModel } from "../../../../models/database/LoginModels";
import { SettingsModel } from "../../../../models/database/SettingsModels";

import { pushNotifications } from "../../../../services/Index";

export const deleteEverythingInDb = async () => {
  try {
    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
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

export default deleteEverythingInDb;
