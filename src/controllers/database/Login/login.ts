//3rd party modules
import moment from "moment";

//Functions
import {
  unCheckEveryTaskInTheDatabase,
  removeEveryCheckedTaskInTheDatabase,
} from "../Tasks/tasks";

export const createLoginDate = (): void => {
  try {
    let loginDateExists: string = global.realmContainer.objects("Login")[0];
    let currentDate: string = moment().format("YYYY-MM-DD");

    if (!loginDateExists) {
      global.realmContainer.write(() => {
        global.realmContainer.create("Login", {
          id: 0,
          date: currentDate,
          alreadyLoggedInToday: true,
        });
      });
    }
  } catch (err) {
    return JSON.stringify(err);
  }
};

export const updateLoginDate = async (): Promise<string | void> => {
  try {
    let loginDateExists: string = global.realmContainer.objects("Login")[0];
    let currentDate: string = moment().format("YYYY-MM-DD");

    if (!loginDateExists) {
      createLoginDate();
      return;
    }

    if (loginDateExists.date === currentDate) {
      return;
    } else {
      global.realmContainer.write(() => {
        global.realmContainer.create(
          "Login",
          {
            id: 0,
            date: currentDate,
            alreadyLoggedInToday: true,
          },
          true
        );
      });
    }
  } catch (err) {
    return JSON.stringify(err);
  }
};

export const determiningIfNewWeek = () => {
  try {
    const loginDate = global.realmContainer.objects("Login")[0].date;

    let mondayOfThisWeek: string = moment()
      .startOf("isoWeek")
      .format("YYYY-MM-DD");
    let differenceBetweenLoginDateAndThisWeeksMonday: number = moment(
      loginDate,
      "YYYY-MM-DD"
    ).diff(mondayOfThisWeek, "days");

    if (differenceBetweenLoginDateAndThisWeeksMonday < 0) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return JSON.stringify(err);
  }
};

export const newWeekStandardBehavior = async (): Promise<string | null> => {
  try {
    const newWeekTrueOrFalse = determiningIfNewWeek();
    if (!newWeekTrueOrFalse) {
      return null;
    } else {
      await unCheckEveryTaskInTheDatabase();
      return "New Week: All Tasks Unchecked!";
    }
  } catch (err) {
    return JSON.stringify(err);
  }
};

export const newWeekAlternativeBehavior = (): string | null => {
  try {
    const newWeekTrueOrFalse = determiningIfNewWeek();
    if (!newWeekTrueOrFalse) {
      return null;
    } else {
      removeEveryCheckedTaskInTheDatabase();
      return "New Week: Checked Tasks Deleted!";
    }
  } catch (err) {
    return JSON.stringify(err);
  }
};
