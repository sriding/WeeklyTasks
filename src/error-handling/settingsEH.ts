import reminderTimes from "../utilities/reminderTimes";

export const changeDailyUpdateEH = (bool: boolean) => {
  const errorsObject: { errors: object; errorsExist: boolean } = {
    errors: {},
    errorsExist: false,
  };

  if (typeof bool !== "boolean") {
    errorsObject.errors.bool = "Format for boolean is invalid.";
    errorsObject.errorsExist = true;
  }

  return errorsObject;
};

export const changeDailyUpdatePersistanceEH = (bool: boolean) => {
  const errorsObject: { errors: object; errorsExist: boolean } = {
    errors: {},
    errorsExist: false,
  };

  if (typeof bool !== "boolean") {
    errorsObject.errors.bool = "Format for boolean is invalid.";
    errorsObject.errorsExist = true;
  }

  return errorsObject;
};

export const changeDailyUpdateTimeEH = (time: string) => {
  const errorsObject: { errors: object; errorsExist: boolean } = {
    errors: {},
    errorsExist: false,
  };

  if (typeof time !== "string") {
    errorsObject.errors.time = "Time is not in the correct format.";
    errorsObject.errorsExist = true;
  } else if (Object.keys(reminderTimes).includes(time) !== true) {
    errorsObject.errors.time = "Time is not one of the dropdown values.";
    errorsObject.errorsExist = true;
  }

  return errorsObject;
};

export const changeTaskRemindersEH = (bool: boolean) => {
  const errorsObject: { errors: object; errorsExist: boolean } = {
    errors: {},
    errorsExist: false,
  };

  if (typeof bool !== "boolean") {
    errorsObject.errors.bool = "Format for boolean is invalid.";
    errorsObject.errorsExist = true;
  }

  return errorsObject;
};

export const changeSortTasksByEH = (string: string) => {
  const errorsObject: { errors: object; errorsExist: boolean } = {
    errors: {},
    errorsExist: false,
  };

  if (typeof string !== "string") {
    errorsObject.errors.sort = "Format for sort name is invalid.";
    errorsObject.errorsExist = true;
  } else if (string !== "Recently Added" && string !== "Reminder Time") {
    errorsObject.errors.sort = "Sort name inputted is not valid.";
    errorsObject.errorsExist = true;
  }

  return errorsObject;
};

export const changeThemeEH = (string: string) => {
  const errorsObject: { errors: object; errorsExist: boolean } = {
    errors: {},
    errorsExist: false,
  };

  if (typeof string !== "string") {
    errorsObject.errors.theme = "Format for theme name is invalid.";
    errorsObject.errorsExist = true;
  } else if (string !== "light" && string !== "dark") {
    errorsObject.errors.theme = "Theme name inputted is not valid.";
    errorsObject.errorsExist = true;
  }

  return errorsObject;
};
