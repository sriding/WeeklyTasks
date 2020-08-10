import { addNoteUpdateNoteEH, deleteNoteEH } from "../../../validation/notesEH";

export const addNote = async (text: string, noteID: number): Promise<void> => {
  try {
    const errorsObject = addNoteUpdateNoteEH(text, noteID);
    if (errorsObject.errorsExist) {
      throw errorsObject.errors;
    }

    let trimmedText = text.trim();

    global.realmContainer.write(() => {
      global.realmContainer.create(
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

    global.realmContainer.write(() => {
      global.realmContainer.create(
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

    global.realmContainer.write(() => {
      global.realmContainer.create(
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
