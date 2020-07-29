const Realm = require("realm");
import { DayModel } from "../../../models/database/DayModels";
import { TaskModel } from "../../../models/database/TaskModels";
import { NoteModel } from "../../../models/database/NoteModels";
import { LoginModel } from "../../../models/database/LoginModels";
import { SettingsModel } from "../../../models/database/SettingsModels";

export const addNote = async (
  text: string,
  noteID: number
): Promise<void | string> => {
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
    });
  } catch (err) {
    return err;
  }
};

export const updateNote = async (
  text: string,
  noteID: number
): Promise<void | string> => {
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
    });
  } catch (err) {
    return err;
  }
};

export const deleteNote = async (noteID: number): Promise<void> => {
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
    });
  } catch (err) {
    return err;
  }
};
