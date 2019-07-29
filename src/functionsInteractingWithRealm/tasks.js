const Realm = require("realm");
import {DaySchema, TaskSchema, NoteSchema} from "./../schemas/schemas";
import { getAllDaysData } from "./getAllDaysData";

export const addTask = (text, dayID) => { 
    return new Promise((resolve, reject) => {
        if (text.length === 0 || text.length > 250) {
            return reject(null);
        }
        Realm.open({schema: [DaySchema, TaskSchema, NoteSchema]})
        .then((realm) => {
            if (realm.objects("Day").filtered(`id = "${dayID}"`).length > 15) {
                return reject(null);
            }
            const arrayOfIds = [];
            realm.objects('Task').forEach((task) => {
                arrayOfIds.push(task.id);
            })
            realm.write(() => {
                let newTask = realm.create("Task", {
                    id: Math.max(...arrayOfIds) + 1,
                    day: dayID,
                    text,
                    isChecked: false
                })
                let dayToUpdate = realm.create("Day", {
                    id: dayID,
                }, true);
                console.log("This should finish first.");
                resolve(dayToUpdate.tasks.push(newTask));
            })
        })
    })
}

export const updateTask = (text, taskID) => {
    Realm.open({ schema: TaskSchema})
    .then((realm) => {
        realm.write(() => {
            realm.create("Task", {id: taskID, text}, true);
        })
    })
    .catch((err) => {
        console.log(err);
    })
}

export const checkTask = (taskID, isChecked) => {
    Realm.open({ schema: TaskSchema})
    .then((realm) => {
        realm.write(() => {
            realm.create("Task", {id: taskID, isChecked: !isChecked}, true);
        })
    })
    .catch((err) => {
        console.log(err);
    })
}

export const deleteTask = (taskID) => {
    Realm.open({ schema: TaskSchema})
    .then((realm) => {
        realm.write(() => {
            realm.delete(realm.objects("Task", {id: taskID}));
        })
    })
    .catch((err) => {
        console.log(err);
    })
}

export const checkAllTasks = (day) => {
    Realm.open({ schema: TaskSchema })
    .then((realm) => {
        realm.write(() => {
            let tasksToCheck = realm.objects("Task").filtered(`day == "${day}"`);
            for (let i = 0; i < tasksToCheck.length; i++) {
                tasksToCheck[i].isChecked = !tasksToCheck[i].isChecked;
            }
        })
    .catch((err) => {
        console.log(err);
    })
  })
};

export const deleteAllTasks = (day) => {
    Realm.open({ schema: TaskSchema})
    .then((realm) => {
        realm.write(() => {
            realm.delete(realm.objects("Task").filtered(`day == "${day}"`));
        })
    })
    .catch((err) => {
        console.log(err);
    })
}