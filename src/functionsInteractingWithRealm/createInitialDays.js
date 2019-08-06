const Realm = require("realm");

import {DaySchema, TaskSchema, NoteSchema, LoginSchema} from "./../schemas/schemas";

import theWeek from "./../utilities/theWeek";

export const createInitialDays = () => {
    return new Promise((resolve, reject) => {
        Realm.open({schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema]})
        .then(realm => {
            if (realm.objects('Day')[0]) {
                resolve(null);
            } else {
                realm.write(() => {
                    for (let i = 0; i < theWeek.length; i++) {
                        realm.create('Day', {
                            id: theWeek[i],
                            tasks: [{id: i, day: theWeek[i], text: "Create tasks for the day here.", isChecked: false}],
                            note: {id: i, text: "Create a note for the day here."}
                        });
                    }
                    resolve();
                });
            }
        })
        .catch(error => {
            reject(error);
        });
    })
}