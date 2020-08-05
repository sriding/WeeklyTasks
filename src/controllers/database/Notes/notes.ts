//Realm modules
const Realm = require("realm");

//Models
import { DayModel } from "../../../models/database/DayModels";
import { TaskModel } from "../../../models/database/TaskModels";
import { NoteModel } from "../../../models/database/NoteModels";
import { LoginModel } from "../../../models/database/LoginModels";
import { SettingsModel } from "../../../models/database/SettingsModels";
import { addNoteUpdateNoteEH, deleteNoteEH } from "../../../validation/notesEH";

export const addNote = async (text: string, noteID: number): Promise<void> => {
  try {
    const errorsObject = addNoteUpdateNoteEH(text, noteID);
    if (errorsObject.errorsExist) {
      throw errorsObject.errors;
    }

    let trimmedText = text.trim();

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
    return JSON.stringify(err);
  }
};

export const updateNote = async (
  text: string,
  noteID: number
): Promise<void | string> => {
  try {
    const errorsObject = addNoteUpdateNoteEH(text, noteID);
    if (errorsObject.errorsExist) {
      throw errorsObject.errors;
    }

    let trimmedText = text.trim();

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
    return JSON.stringify(err);
  }
};

export const deleteNote = async (noteID: number): Promise<void> => {
  try {
    const errorsObject = deleteNoteEH(noteID);
    if (errorsObject.errorsExist) {
      throw errorsObject.errors;
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
          text: "",
        },
        true
      );
    });
  } catch (err) {
    return JSON.stringify(err);
  }
};
