const Realm = require("realm");
import {
  DaySchema,
  TaskSchema,
  NoteSchema,
  LoginSchema,
  SettingsSchema,
} from "./../schemas/schemas";

export const getAllDaysData = async () => {
  console.log(Realm.defaultPath);
  try {
    const realmContainer = await Realm.open({
      schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema],
      schemaVersion: 5,
    });

    let daysContainer = await realmContainer.objects("Day");
    let customObjectToReturn = {};

    daysContainer.forEach((day) => {
      customObjectToReturn[day.id] = {
        id: day.id,
        tasks: day.tasks,
        note: day.note,
      };
    });

    return customObjectToReturn;
  } catch (err) {
    console.log(err);
  }
};
