const Realm = require("realm");

import { DayModel } from "../../../models/database/DayModels";
import { TaskModel } from "../../../models/database/TaskModels";
import { NoteModel } from "../../../models/database/NoteModels";
import { LoginModel } from "../../../models/database/LoginModels";
import { SettingsModel } from "../../../models/database/SettingsModels";

export const getTask = async (taskId: number) => {
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
