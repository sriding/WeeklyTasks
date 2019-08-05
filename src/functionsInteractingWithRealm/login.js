const Realm = require("realm");

import moment from "moment";
import {DaySchema, TaskSchema, NoteSchema, LoginSchema} from "./../schemas/schemas";

import { unCheckEveryTaskInTheDatabase } from "./tasks";

export const saveLoginDate = () => {
    return new Promise((resolve, reject) => {
        Realm.open({ schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema]})
        .then((realm) => {
            if (!realm.objects("Login")[0]) {
                realm.write(() => {
                    realm.create("Login", {
                        id: 0,
                        date: moment(new Date()).format("MM/DD/YYYY"),
                        alreadyLoggedInToday: true
                    })
                    resolve("No date saved, so created a new one.");
                })
            } else if (realm.objects("Login")[0].date !== moment(new Date()).format("MM/DD/YYYY")) {
                let oldDate = realm.objects("Login")[0].date;
                let newDate = moment(new Date()).format("MM/DD/YYYY");
                let mondayOfThisWeek = moment().startOf('isoWeek').format("MM/DD/YYYY");

                if (newDate.diff(oldDate, "days") >= 7 || newDate.diff(mondayOfThisWeek, "days") < newDate.diff(oldDate, "days")) {
                    unCheckEveryTaskInTheDatabase()
                    .then(() => {
                        realm.write(() => {
                            realm.create("Login", {
                                id: 0,
                                date: newDate,
                                alreadyLoggedInToday: true
                            }, true)
                            resolve("New week - All tasks unchecked!");
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
                        resolve("New date saved.");
                    })
                }
            } else {
                resolve("Hello again.");
            }
        })
        .catch((error) => {
            reject(error);
        })
    })
}

