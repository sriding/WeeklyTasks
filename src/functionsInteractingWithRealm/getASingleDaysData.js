const Realm = require("realm");
import {DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema} from "./../schemas/schemas";

import { getSortTasksBy } from "./../functionsInteractingWithRealm/settings";

export const getASingleDaysData = (dayID) => { 
    return new Promise((resolve, reject) => {
        Realm.open({schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema], schemaVersion: 5})
        .then((realm) => {
            let dayData = realm.objects("Day").filtered(`id == "${dayID}"`);
            let taskData = [];
            let leftOverTaskData = [];
            let sortedTaskData = [];
            let sortedTaskDataChecked = [];

            getSortTasksBy().then((mark) => {
                if (mark === "Reminder Time") {
                    let realmTaskData = realm.objects("Task").filtered(`day == "${dayID}"`).sorted('reminderTimeValue');

                    for (realmTask of realmTaskData) {
                        if (realmTask.isChecked === false) {
                            sortedTaskData.push({
                                id: realmTask.id,
                                day: realmTask.day,
                                text: realmTask.text,
                                isChecked: realmTask.isChecked,
                                reminder: realmTask.reminder,
                                reminderTime: realmTask.reminderTime
                            })
                        } else {
                            sortedTaskDataChecked.push({
                                id: realmTask.id,
                                day: realmTask.day,
                                text: realmTask.text,
                                isChecked: realmTask.isChecked,
                                reminder: realmTask.reminder,
                                reminderTime: realmTask.reminderTime
                            })
                        }
                    }

                    sortedTaskData.push(...sortedTaskDataChecked);
        
                    resolve({
                        id: dayData[0].id,
                        tasks: sortedTaskData,
                        note: {
                            id: dayData[0].note.id,
                            text: dayData[0].note.text
                        }
                    });
                } else if (mark === "Recently Added") {
                    for (let i = dayData[0].tasks.length - 1; i >= 0; i--) {
                        if (dayData[0].tasks[i].isChecked === true) {
                            leftOverTaskData.push({
                                id: dayData[0].tasks[i].id, 
                                day: dayData[0].tasks[i].day,
                                text: dayData[0].tasks[i].text, 
                                isChecked: dayData[0].tasks[i].isChecked,
                                reminder: dayData[0].tasks[i].reminder,
                                reminderTime: dayData[0].tasks[i].reminderTime
                            })
                        } else {
                            taskData.push({
                                id: dayData[0].tasks[i].id, 
                                day: dayData[0].tasks[i].day,
                                text: dayData[0].tasks[i].text, 
                                isChecked: dayData[0].tasks[i].isChecked,
                                reminder: dayData[0].tasks[i].reminder,
                                reminderTime: dayData[0].tasks[i].reminderTime
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
                }
            })
        })
        .catch((err) => {
            reject(err.toString());
        })
    })
}