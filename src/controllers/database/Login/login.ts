//Realm modules
const Realm = require("realm");

//3rd party modules
import moment from "moment";

//Models
import { DayModel } from "../../../models/database/DayModels";
import { TaskModel } from "../../../models/database/TaskModels";
import { NoteModel } from "../../../models/database/NoteModels";
import { LoginModel } from "../../../models/database/LoginModels";
import { SettingsModel } from "../../../models/database/SettingsModels";

//Functions
import { unCheckEveryTaskInTheDatabase } from "../Tasks/tasks";

export const createLoginDate = async (): Promise<string> => {
  try {
    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 5,
    });

    let loginDateExists: any = realmContainer.objects("Login")[0]
      ? realmContainer.objects("Login")[0]
      : null;
    let currentDate: string = moment().format("YYYY-MM-DD");

    if (!loginDateExists) {
      realmContainer.write(() => {
        realmContainer.create("Login", {
          id: 0,
          date: currentDate,
          alreadyLoggedInToday: true,
        });
      });
    }

    return loginDateExists ? loginDateExists.date : currentDate;
  } catch (err) {
    return err;
  }
};

export const saveLoginDate = async (): Promise<string | void> => {
  try {
    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 5,
    });

    let loginDateExists: string = await createLoginDate();
    let currentDate: string = moment().format("YYYY-MM-DD");

    if (loginDateExists !== currentDate) {
      realmContainer.write(() => {
        realmContainer.create(
          "Login",
          {
            id: 0,
            date: currentDate,
            alreadyLoggedInToday: true,
          },
          true
        );
      });

      let mondayOfThisWeek: string = moment()
        .startOf("isoWeek")
        .format("YYYY-MM-DD");
      let differenceBetweenLoginDateAndThisWeeksMonday: number = moment(
        loginDateExists,
        "YYYY-MM-DD"
      ).diff(mondayOfThisWeek, "days");

      if (differenceBetweenLoginDateAndThisWeeksMonday < 0) {
        const expectVoid: void = await unCheckEveryTaskInTheDatabase();

        if (expectVoid !== null && expectVoid !== undefined) {
          throw expectVoid;
        }

        return "New Week: All Tasks Unchecked!";
      }
    }
  } catch (err) {
    return err;
  }
};
