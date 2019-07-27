const Realm = require("realm");
import {DaySchema, TaskSchema, NoteSchema} from "./../schemas/schemas";

export const getASingleDaysData = (dayID) => { 
    return new Promise((resolve, reject) => {
        Realm.open({schema: [DaySchema, TaskSchema, NoteSchema]})
        .then((realm) => {
            let dayData = realm.objects("Day").filtered(`id == "${dayID}"`);
            let taskData = [];
            for (let i = 0; i < dayData[0].tasks.length; i++) {
                taskData.push({
                    id: dayData[0].tasks[i].id, 
                    day: dayData[0].tasks[i].day,
                    text: dayData[0].tasks[i].text, 
                    isChecked: dayData[0].tasks[i].isChecked
                })
            }
            resolve({
                id: dayData[0].id,
                tasks: taskData,
                note: {
                    id: dayData[0].note.id,
                    text: dayData[0].note.text
                }
            });
        })
        .catch((err) => {
            reject(err);
        })
    })
}