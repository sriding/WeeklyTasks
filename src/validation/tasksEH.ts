import theWeek from "../utilities/theWeek";
import reminderTimes from "../utilities/reminderTimes";

export const getTaskEH = (taskId: number) => {
  const errorsObject: { errorsExist: boolean; errors: any } = {
    errorsExist: false,
    errors: {},
  };

  if (typeof taskId !== "number") {
    errorsObject.errors.text = "The task id is not in the proper format.";
    errorsObject.errorsExist = true;
  }

  return errorsObject;
};

export const addEH = (
  text: string,
  day: string,
  reminder: boolean,
  reminderTime: string
): { errorsExist: boolean; errors: any } => {
  const errorsObject: { errorsExist: boolean; errors: any } = {
    errorsExist: false,
    errors: {},
  };

  //Required
  if (typeof text !== "string") {
    errorsObject.errors.text = "The text is not in the proper format.";
    errorsObject.errorsExist = true;
  } else if (text.trim().length === 0) {
    errorsObject.errors.text = "There is no text to save.";
    errorsObject.errorsExist = true;
  } else if (text.trim().length > 350) {
    errorsObject.errors.text = "Text cannot be greater than 350 characters.";
    errorsObject.errorsExist = true;
  }

  if (typeof day !== "string") {
    errorsObject.errors.day = "The day is not in the proper format.";
    errorsObject.errorsExist = true;
  } else if (theWeek.includes(day) === false) {
    errorsObject.errors.day = "A day of the week must be selected.";
    errorsObject.errorsExist = true;
  }

  //Optional
  if (typeof reminder !== "boolean") {
    errorsObject.errors.reminder = "The reminder is not in the proper format.";
    errorsObject.errorsExist = true;
  }

  if (typeof reminderTime !== "string") {
    errorsObject.errors.reminderTime !==
      "The reminder time is not in the proper format.";
    errorsObject.errorsExist = true;
  } else if (reminderTimes[reminderTime] === undefined) {
    errorsObject.errors.reminderTime =
      "Reminder time must be from displayed options.";
    errorsObject.errorsExist = true;
  }

  return errorsObject;
};

export const updateEH = (
  text: string,
  taskId: number,
  reminder: boolean = false,
  reminderTime: string = "12:00 PM"
): { errorsExist: boolean; errors: any } => {
  const errorsObject: { errorsExist: boolean; errors: any } = {
    errorsExist: false,
    errors: {},
  };

  //Required
  if (typeof text !== "string") {
    errorsObject.errors.text = "The text is not in the proper format.";
    errorsObject.errorsExist = true;
  } else if (text.trim().length === 0) {
    errorsObject.errors.text = "There is no text to save.";
    errorsObject.errorsExist = true;
  } else if (text.trim().length > 350) {
    errorsObject.errors.text = "Text cannot be greater than 350 characters.";
    errorsObject.errorsExist = true;
  }

  if (typeof taskId !== "number") {
    errorsObject.errors.taskId = "Specified Task ID is not valid.";
    errorsObject.errorsExist = true;
  }

  //Optional
  if (typeof reminder !== "boolean") {
    errorsObject.errors.reminder = "The reminder is not in the proper format.";
    errorsObject.errorsExist = true;
  }

  if (typeof reminderTime !== "string") {
    errorsObject.errors.reminderTime !==
      "The reminder time is not in the proper format.";
    errorsObject.errorsExist = true;
  } else if (reminderTimes[reminderTime] === undefined) {
    errorsObject.errors.reminderTime =
      "Reminder time must be from displayed options.";
    errorsObject.errorsExist = true;
  }

  return errorsObject;
};

export const checkEH = (
  taskID: number,
  isChecked: boolean
): { errorsExist: boolean; errors: any } => {
  const errorObject: { errorsExist: boolean; errors: any } = {
    errorsExist: false,
    errors: {},
  };

  //Required
  if (typeof taskID !== "number") {
    errorObject.errors.taskID = "Task ID is not a number somehow.";
    errorObject.errorsExist = true;
  }

  if (typeof isChecked !== "boolean") {
    errorObject.errors.isChecked =
      "A check/uncheck event was not sent somehow.";
    errorObject.errorsExist = true;
  }

  return errorObject;
};

export const deleteEH = (
  taskID: number
): { errorsExist: boolean; errors: any } => {
  const errorObject: { errorsExist: boolean; errors: any } = {
    errorsExist: false,
    errors: {},
  };

  //Required
  if (typeof taskID !== "number") {
    errorObject.errors.taskID = "Task ID is not a number somehow.";
    errorObject.errorsExist = true;
  }

  return errorObject;
};

export const checkAllDeleteAllGetDayTaskIdsEH = (
  day: string
): { errorsExist: boolean; errors: any } => {
  const errorObject: { errorsExist: boolean; errors: any } = {
    errorsExist: false,
    errors: {},
  };

  //Required
  if (typeof day !== "string") {
    errorObject.errors.day = "The day is not in the proper format.";
    errorObject.errorsExist = true;
  } else if (theWeek.includes(day) === false) {
    errorObject.errors.day = "The day must be a day of the week.";
    errorObject.errorsExist = true;
  }

  return errorObject;
};

export const tasksForADayEH = (
  day: string,
  reminder: string
): { errorsExist: boolean; errors: any } => {
  const errorObject: { errorsExist: boolean; errors: any } = {
    errorsExist: false,
    errors: {},
  };

  //Required
  if (typeof day !== "string") {
    errorObject.errors.day = "The day is not in the proper format.";
    errorObject.errorsExist = true;
  } else if (theWeek.includes(day) === false) {
    errorObject.errors.day = "The day must be a day of the week.";
    errorObject.errorsExist = true;
  }

  if (typeof reminder !== "string") {
    errorObject.errors.day = "The reminder is not in the proper format.";
    errorObject.errorsExist = true;
  } else if (reminder !== "Recently Added" && reminder !== "Reminder Time") {
    errorObject.errors.day = "The reminder string is not valid.";
    errorObject.errorsExist = true;
  }

  return errorObject;
};
