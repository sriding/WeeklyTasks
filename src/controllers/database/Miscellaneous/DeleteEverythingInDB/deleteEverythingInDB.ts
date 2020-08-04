//Realm modules
const Realm = require("realm");

//Models
import { DayModel } from "../../../../models/database/DayModels";
import { TaskModel } from "../../../../models/database/TaskModels";
import { NoteModel } from "../../../../models/database/NoteModels";
import { LoginModel } from "../../../../models/database/LoginModels";
import { SettingsModel } from "../../../../models/database/SettingsModels";

//Services
import { pushNotifications } from "../../../../services/Index";

export const deleteEverythingInDB = async (
  path: null | string = null
): Promise<void> => {
  try {
    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 5,
      path: path || Realm.defaultPath,
    });

    realmContainer.write(() => {
      realmContainer.deleteAll();
    });

    await pushNotifications.removeAllLocalNotifications();
  } catch (err) {
    return JSON.stringify(err);
  }
};

export default deleteEverythingInDB;
