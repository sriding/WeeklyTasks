const Realm = require("realm");

import moment from "moment";

import {DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema} from "./../schemas/schemas";

import { unCheckEveryTaskInTheDatabase } from "./tasks";

export const saveLoginDate = () => {
    return new Promise((resolve, reject) => {
        Realm.open({ schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema], schemaVersion: 5})
        .then((realm) => {
            if (!realm.objects("Login")[0]) {
                realm.write(() => {
                    realm.create("Login", {
                        id: 0,
                        date: moment().format("YYYY-MM-DD"),
                        alreadyLoggedInToday: true
                    })
                    resolve();
                })
            } else if (realm.objects("Login")[0].date !== moment().format("YYYY-MM-DD")) {
                let oldDate = realm.objects("Login")[0].date;
                let newDate = moment().format("YYYY-MM-DD");
                let mondayOfThisWeek = moment().startOf('isoWeek').format("YYYY-MM-DD");

                if (moment(newDate, "YYYY-MM-DD").diff(oldDate, "days") >= 7 || moment(newDate, "YYYY-MM-DD").diff(mondayOfThisWeek, "days") < moment(newDate, "YYYY-MM-DD").diff(oldDate, "days")) {
                    unCheckEveryTaskInTheDatabase()
                    .then(() => {
                        realm.write(() => {
                            realm.create("Login", {
                                id: 0,
                                date: newDate,
                                alreadyLoggedInToday: true
                            }, true)
                            resolve("New Week: All Tasks Unchecked!");
                        })
                    })
                    .catch((error) => {
                        reject(error);
                    })
                } else {
                    realm.write(() => {
                        realm.create("Login", {
                            id: 0,
                            date: newDate,
                            alreadyLoggedInToday: true
                        }, true)
                        resolve();
                    })
                }
            } else {
                resolve();
            }
        })
        .catch((error) => {
            reject(error.toString());
        })
    })
}

