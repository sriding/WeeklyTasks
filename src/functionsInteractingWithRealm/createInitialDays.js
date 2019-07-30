const Realm = require("realm");
import {DaySchema, TaskSchema, NoteSchema} from "./../schemas/schemas";
import theWeek from "./../utilities/theWeek";

export default function createInitialDays() {
    console.log(Realm.defaultPath);
    Realm.open({schema: [DaySchema, TaskSchema, NoteSchema]})
        .then(realm => {
            if (realm.objects('Day')[0]) {
                return null;
            } else {
                realm.write(() => {
                    for (let i = 0; i < theWeek.length; i++) {
                        realm.create('Day', {
                            id: daysOfTheWeek[i],
                            tasks: [{id: i, day: daysOfTheWeek[i], text: "Create tasks for the day here.", isChecked: false}],
                            note: {id: i, text: "Create a note for the day here."}
                        });
                    }
                });
            }
        })
        .catch(error => {
            console.log(error);
        });
    }