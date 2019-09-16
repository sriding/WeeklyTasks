const Realm = require("realm");

import {DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema} from "../schemas/schemas";

import { pushNotifications } from "./../services/Index";
import theWeek from "../utilities/theWeek";

export const createInitialDays = () => {
    return new Promise((resolve, reject) => {
        Realm.open({schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema], schemaVersion: 5})
        .then(realm => {
            if (realm.objects('Settings')[0]) {
                //Do Nothing
            } else {
                realm.write(() => {
                    realm.create('Settings', {
                        id: 0,
                        dailyUpdate: true,
                        dailyUpdatePersistance: false,
                        dailyUpdateTime: "9:00 AM",
                        taskReminders: true,
                        sortTasksBy: "Reminder Time",
                        theme: "light"
                    });
                })
            }

            if (realm.objects('Day')[0]) {
                resolve(null);
            } else {
                realm.write(() => {
                    for (let i = 0; i < theWeek.length; i++) {
                        realm.create('Day', {
                            id: theWeek[i],
                            tasks: [{
                                id: i, 
                                day: theWeek[i], 
                                text: "Create tasks for the day here.", 
                                isChecked: false,
                                reminder: false,
                                reminderTime: "12:00 PM",
                                reminderTimeValue: 12
                            }],
                            note: {id: i, text: "Create a note for the day here."}
                        });
                    }
                });
            }
        })
        .then(() => {
            pushNotifications.sendLocalNotification(); 
            resolve();
        })
        .catch(error => {
            reject(error.toString());
        });
    })
}