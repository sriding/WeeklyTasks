const Realm = require("realm");
import { DayModel } from "../../../models/database/DayModels";
import { TaskModel } from "../../../models/database/TaskModels";
import { NoteModel } from "../../../models/database/NoteModels";
import { LoginModel } from "../../../models/database/LoginModels";
import { SettingsModel } from "../../../models/database/SettingsModels";

export const addNote = async (text: string, noteID: number) => {
  try {
    let trimmedText = text.trim();
    if (trimmedText.length === 0) {
      return "No text!";
    } else if (trimmedText.length > 350) {
      return "Cannot exceed 350 characters.";
    }

    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
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

export const updateNote = async (text: string, noteID: number) => {
  try {
    let trimmedText = text.trim();
    if (trimmedText.length === 0) {
      return "No text!";
    } else if (trimmedText.length > 350) {
      return "Cannot exceed 350 characters.";
    }
    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
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

export const deleteNote = async (noteID: number) => {
  try {
    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
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
