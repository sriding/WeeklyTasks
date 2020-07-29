const Realm = require("realm");

import { DayModel } from "../../../../models/database/DayModels";
import { TaskModel } from "../../../../models/database/TaskModels";
import { NoteModel } from "../../../../models/database/NoteModels";
import { LoginModel } from "../../../../models/database/LoginModels";
import { SettingsModel } from "../../../../models/database/SettingsModels";

export const getAllDaysData = async (): Promise<any> => {
  console.log(Realm.defaultPath);
  try {
    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 5,
    });

    let daysContainer = realmContainer.objects("Day");
    let customObjectToReturn: {
      [key: string]: { id: string; tasks: string; note: string };
    } = {};

    daysContainer.forEach((day: any) => {
      customObjectToReturn[day.id] = {
        id: day.id,
        tasks: day.tasks,
        note: day.note,
      };
    });

    return customObjectToReturn;
  } catch (err) {
    return err;
  }
};
