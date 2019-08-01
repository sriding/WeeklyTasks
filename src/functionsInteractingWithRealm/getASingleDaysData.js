const Realm = require("realm");
import {DaySchema, TaskSchema, NoteSchema} from "./../schemas/schemas";

export const getASingleDaysData = (dayID) => { 
    return new Promise((resolve, reject) => {
        Realm.open({schema: [DaySchema, TaskSchema, NoteSchema]})
        .then((realm) => {
            let dayData = realm.objects("Day").filtered(`id == "${dayID}"`);
            let taskData = [];
            let leftOverTaskData = [];
            for (let i = dayData[0].tasks.length - 1; i >= 0; i--) {
                if (dayData[0].tasks[i].isChecked === true) {
                    leftOverTaskData.push({
                        id: dayData[0].tasks[i].id, 
                        day: dayData[0].tasks[i].day,
                        text: dayData[0].tasks[i].text, 
                        isChecked: dayData[0].tasks[i].isChecked
                    })
                } else {
                    taskData.push({
                        id: dayData[0].tasks[i].id, 
                        day: dayData[0].tasks[i].day,
                        text: dayData[0].tasks[i].text, 
                        isChecked: dayData[0].tasks[i].isChecked
                    })
            }}

            leftOverTaskData.forEach((taskDataObject) => {
                taskData.push(taskDataObject);
            })
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