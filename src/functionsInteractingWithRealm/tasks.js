const Realm = require("realm");
import {DaySchema, TaskSchema, NoteSchema} from "./../schemas/schemas";

export const addTask = (text, dayID) => {
    Realm.open({schema: [DaySchema, TaskSchema, NoteSchema]})
    .then((realm) => {
        const arrayOfIds = [];
        realm.objects('Task').forEach((day) => {
            arrayOfIds.push(day.id);
        })
        realm.write(() => {
            const newTask = realm.create("Task", {
                id: Math.max(...arrayOfIds) + 1,
                text,
                isChecked: false
            })
            let dayToUpdate = realm.create("Day", {
                id: dayID,
            }, true)
            dayToUpdate.tasks.push(newTask);
        })
    })
};

export const updateTask = () => {

}

export const checkTask = () => {

}

export const deleteTask = () => {

}

export const checkAllTasks = () => {
    
};

export const deleteAllTasks = () => {

}