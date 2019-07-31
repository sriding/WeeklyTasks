const Realm = require("realm");
import {DaySchema, TaskSchema, NoteSchema} from "./../schemas/schemas";

export const addTask = (text, dayID) => { 
    return new Promise((resolve, reject) => {
        if (text.length === 0) {
            return reject("No text!");
        } else if (text.length > 250) {
            return reject("Cannot exceed 250 characters.")
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
        .catch((error) => {
            reject(error);
        })
    })
}

export const updateTask = (text, taskID) => {
    return new Promise((resolve, reject) => {
        Realm.open({ schema: [DaySchema, TaskSchema, NoteSchema]})
        .then((realm) => {
            realm.write(() => {
                resolve(realm.create("Task", {id: taskID, text}, true));
            })
        })
        .catch((err) => {
            reject(err);
        })
    })
}

export const checkTask = (taskID, isChecked) => {
    return new Promise((resolve, reject) => {
        Realm.open({ schema: [DaySchema, TaskSchema, NoteSchema]})
        .then((realm) => {
            realm.write(() => {
                resolve(realm.create("Task", {id: taskID, isChecked: !isChecked}, true));
            })
        })
        .catch((err) => {
            reject(err);
        })
    })
}

export const deleteTask = (taskID) => {
    return new Promise((resolve, reject) => {
        Realm.open({ schema: [DaySchema, TaskSchema, NoteSchema]})
        .then((realm) => {
            realm.write(() => {
                let taskToDelete = realm.create("Task", {id: taskID}, true);
                resolve(realm.delete(taskToDelete));
            })
        })
        .catch((err) => {
            reject(err);
        })
    })
}

export const checkAllTasks = (day) => {
    return new Promise((resolve, reject) => {
        Realm.open({ schema: [DaySchema, TaskSchema, NoteSchema] })
        .then((realm) => {
            realm.write(() => {
                let tasksToCheck = realm.objects("Task").filtered(`day == "${day}" AND isChecked == ${false}`);
                if (tasksToCheck.length !== 0) {
                    for (let task of tasksToCheck) {
                        task.isChecked = true;
                    }
                } else {
                    console.log("Running the UNcheck all portion");
                    let tasksToUncheck = realm.objects("Task").filtered(`day == "${day}"`);
                    for (let task of tasksToUncheck) {
                        task.isChecked = false;
                    }
                }
                resolve();
            })
        })
      .catch((error) => {
        reject(error);
      })
    })
};

export const deleteAllTasks = (day) => {
    return new Promise((resolve, reject) => {
        Realm.open({ schema: [DaySchema, TaskSchema, NoteSchema]})
        .then((realm) => {
            realm.write(() => {
                resolve(realm.delete(realm.objects("Task").filtered(`day == "${day}"`)));
            })
        })
        .catch((err) => {
            reject(err);
        })
    })
}