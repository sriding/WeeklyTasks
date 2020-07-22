const Realm = require("realm");
import {
  DaySchema,
  TaskSchema,
  NoteSchema,
  LoginSchema,
  SettingsSchema,
} from "./../schemas/schemas";

export const addNote = async (text, noteID) => {
  try {
    let trimmedText = text.trim();
    if (trimmedText.length === 0) {
      return "No text!";
    } else if (trimmedText.length > 350) {
      return "Cannot exceed 350 characters.";
    }

    const realmContainer = await Realm.open({
      schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema],
      schemaVersion: 5,
    });
    realmContainer.write(() => {
      realmContainer.create(
        "Note",
        {
          id: noteID,
          text: trimmedText,
        },
        true
      );

      return null;
    });
  } catch (err) {
    return err.toString();
  }
};

export const updateNote = async (text, noteID) => {
  try {
    let trimmedText = text.trim();
    if (trimmedText.length === 0) {
      return "No text!";
    } else if (trimmedText.length > 350) {
      return "Cannot exceed 350 characters.";
    }
    const realmContainer = await Realm.open({
      schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema],
      schemaVersion: 5,
    });
    realmContainer.write(() => {
      realmContainer.create(
        "Note",
        {
          id: noteID,
          text: trimmedText,
        },
        true
      );
      return null;
    });
  } catch (err) {
    return err.toString();
  }
};

export const deleteNote = async (noteID) => {
  try {
    const realmContainer = await Realm.open({
      schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema],
      schemaVersion: 5,
    });
    realmContainer.write(() => {
      realmContainer.create(
        "Note",
        {
          id: noteID,
          text: "",
        },
        true
      );
      return null;
    });
  } catch (err) {
    return err.toString();
  }
};
