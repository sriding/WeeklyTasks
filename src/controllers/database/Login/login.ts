const Realm = require("realm");

import moment from "moment";

import { DayModel } from "../../../models/database/DayModels";
import { TaskModel } from "../../../models/database/TaskModels";
import { NoteModel } from "../../../models/database/NoteModels";
import { LoginModel } from "../../../models/database/LoginModels";
import { SettingsModel } from "../../../models/database/SettingsModels";

import { unCheckEveryTaskInTheDatabase } from "../Tasks/tasks";

export const saveLoginDate = async () => {
  try {
    const realmContainer = await Realm.open({
      schema: [DayModel, TaskModel, NoteModel, LoginModel, SettingsModel],
      schemaVersion: 5,
    });

    let loginDateExists = realmContainer.objects("Login")[0]
      ? realmContainer.objects("Login")[0]
      : null;
    let currentDate = moment().format("YYYY-MM-DD");

    if (!loginDateExists) {
      realmContainer.write(() => {
        realmContainer.create("Login", {
          id: 0,
          date: currentDate,
          alreadyLoggedInToday: true,
        });

        return null;
      });
    } else if (loginDateExists.date !== currentDate) {
      let mondayOfThisWeek = moment().startOf("isoWeek").format("YYYY-MM-DD");

      if (
        moment(currentDate, "YYYY-MM-DD").diff(loginDateExists.date, "days") >=
          7 ||
        moment(currentDate, "YYYY-MM-DD").diff(mondayOfThisWeek, "days") <
          moment(currentDate, "YYYY-MM-DD").diff(loginDateExists.date, "days")
      ) {
        const unCheckedTasksInDatabase = await unCheckEveryTaskInTheDatabase();

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

          return "New Week: All Tasks Unchecked!";
        });
      } else {
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

          return null;
        });
      }
    } else {
      return null;
    }
  } catch (err) {
    return err.toString();
  }
};
