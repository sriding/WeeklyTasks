import theWeek from "../utilities/theWeek";

export const getASingleDaysDataEH = (dayID: string) => {
  const errorsObject: { errors: object; errorsExist: boolean } = {
    errors: {},
    errorsExist: false,
  };

  if (typeof dayID !== "string") {
    errorsObject.errors.day = "Day is in an invalid format.";
    errorsObject.errorsExist = true;
  } else if (theWeek.includes(dayID) === false) {
    errorsObject.errors.day = "The day specified is not valid.";
    errorsObject.errorsExist = true;
  }

  return errorsObject;
};
