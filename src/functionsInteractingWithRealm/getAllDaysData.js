const Realm = require("realm");
import {DaySchema, TaskSchema, NoteSchema, LoginSchema} from "./../schemas/schemas";

export const getAllDaysData = () => { 
    console.log(Realm.defaultPath);
    return new Promise((resolve, reject) => {
        Realm.open({schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema]})
            .then((realm) => {
                let dayObjects = [];
                let dayObject = realm.objects("Day");
                let taskObjects = [];
                let leftOverTaskObjects = [];
                for (let i = 0; i < 7; i++) {
                    for (let j = dayObject[i].tasks.length - 1; j >= 0; j--) {
                        if (dayObject[i].tasks[j].isChecked === true) {
                            leftOverTaskObjects.push({
                                id: dayObject[i].tasks[j].id, 
                                day: dayObject[i].tasks[j].day,
                                text: dayObject[i].tasks[j].text, 
                                isChecked: dayObject[i].tasks[j].isChecked
                            })
                        } else {
                            taskObjects.push({
                                id: dayObject[i].tasks[j].id, 
                                day: dayObject[i].tasks[j].day,
                                text: dayObject[i].tasks[j].text, 
                                isChecked: dayObject[i].tasks[j].isChecked
                            });
                        }
                    }

                    leftOverTaskObjects.forEach((taskObject) => {
                        taskObjects.push(taskObject);
                    })

                    if (dayObject[i].note !== null) {
                        dayObjects.push({
                            id: dayObject[i].id,
                            tasks: taskObjects,
                            note: {
                                id: dayObject[i].note.id, 
                                text: dayObject[i].note.text
                            }
                        })
                    } else {
                        dayObjects.push({
                            id: dayObject[i].id,
                            tasks: taskObjects,
                            note: {
                                id: dayObject[i].id, 
                                text: ""
                            }
                        })
                    }
                    taskObjects = [];
                    leftOverTaskObjects = [];
                }
                resolve(dayObjects);
            })
            .catch((err) => {
                reject(err.toString());
            })
})}