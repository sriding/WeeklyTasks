export const addNoteUpdateNoteEH = (text: string, noteId: number) => {
  const errorsObject: { errors: object; errorsExist: boolean } = {
    errors: {},
    errorsExist: false,
  };

  //Text
  if (typeof text !== "string") {
    errorsObject.errors.text = "Text format for the note is incorrect.";
    errorsObject.errorsExist = true;
  }

  let trimmedText = text.trim();

  if (trimmedText.length === 0) {
    errorsObject.errors.text = "No text entered!";
    errorsObject.errorsExist = true;
  } else if (trimmedText.length > 350) {
    errorsObject.errors.text =
      "Text length cannot be longer than 350 characters.";
    errorsObject.errorsExist = true;
  }

  //NoteId
  if (typeof noteId !== "number") {
    errorsObject.errors.noteId = "Note ID is not in the correct format.";
    errorsObject.errorsExist = true;
  }

  return errorsObject;
};

export const deleteNoteEH = (noteID: number) => {
  const errorsObject: { errors: object; errorsExist: boolean } = {
    errors: {},
    errorsExist: false,
  };

  if (typeof noteID !== "number") {
    errorsObject.errors.noteId = "Note ID format is not correct.";
    errorsObject.errorsExist = true;
  }

  return errorsObject;
};
