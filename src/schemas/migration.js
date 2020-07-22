const Realm = require("realm");

import {
  DaySchema,
  TaskSchema,
  NoteSchema,
  LoginSchema,
  SettingsSchema,
} from "./schemas";

import timeValues from "./../utilities/timeValues";

const migration = () => {
  Realm.open({
    schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema],
    schemaVersion: 5,
    migration: (oldRealm, newRealm) => {
      // only apply this change if upgrading to schemaVersion 1
      if (oldRealm.schemaVersion < 5) {
        const oldObjects = oldRealm.objects("Task");
        const newObjects = newRealm.objects("Task");

        // loop through all objects and set the name property in the new schema
        for (let i = 0; i < oldObjects.length; i++) {
          newObjects[i].reminderTimeValue =
            timeValues[oldObjects[i].reminderTime];
        }
      }
    },
  });
};

export default migration;
