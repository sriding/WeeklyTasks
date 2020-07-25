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

  const realmTaskObject = realmContainer
    .objects("Task")
    .filtered(`id == "${taskId}"`);

  return {
    id: realmTaskObject.id,
    day: realmTaskObject.day,
    text: realmTaskObject.text,
    isChecked: realmTaskObject.isChecked,
    reminder: realmTaskObject.reminder,
    reminderTime: realmTaskObject.reminderTime,
    reminderTimeValue: realmTaskObject.reminderTimeValue,
  };
};
