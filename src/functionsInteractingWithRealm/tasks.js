const Realm = require("realm");
import {DaySchema, TaskSchema, NoteSchema, LoginSchema} from "./../schemas/schemas";

import { pushNotifications } from "./../services/Index";

export const addTask = (text, dayID, reminder = false, reminderTime = "12:00 PM") => { 
    return new Promise((resolve, reject) => {
        let trimmedText = text.trim();
        if (trimmedText.length === 0) {
            return reject("No text!");
        } else if (trimmedText.length > 350) {
            return reject("Cannot exceed 350 characters.")
        }

        Realm.open({schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema], schemaVersion: 3})
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
                        text: trimmedText,
                        isChecked: false,
                        reminder,
                        reminderTime
                    })
                    let dayToUpdate = realm.create("Day", {
                        id: dayID,
                    }, true);
                    return dayToUpdate.tasks.push(newTask);
                })
            })
            .then(() => {
                pushNotifications.localNotification();
                resolve();
            })
            .catch((error) => {
                reject(error.toString());
            })
    })
}

export const updateTask = (text, taskID, reminder = false, reminderTime = "12:00 PM") => {
    return new Promise((resolve, reject) => {
        let trimmedText = text.trim();
        if (trimmedText.length === 0) {
            return reject("No text!");
        } else if (trimmedText.length > 350) {
            return reject("Cannot exceed 350 characters.")
        }
        Realm.open({ schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema], schemaVersion: 3})
            .then((realm) => {
                realm.write(() => {
                    realm.create("Task", {
                        id: taskID, 
                        text: trimmedText,
                        reminder,
                        reminderTime
                    }, true);
                })
            })
            .then(() => {
                pushNotifications.localNotification();
                resolve();
            })
            .catch((err) => {
                reject(err.toString());
            })
        })
    }

export const checkTask = (taskID, isChecked) => {
    return new Promise((resolve, reject) => {
        Realm.open({ schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema], schemaVersion: 3})
        .then((realm) => {
            realm.write(() => {
                realm.create("Task", {id: taskID, isChecked: !isChecked}, true);
            })
        })
        .then(() => {
            pushNotifications.localNotification();
            resolve();
        })
        .catch((err) => {
            reject(err.toString());
        })
    })
}

export const deleteTask = (taskID) => {
    return new Promise((resolve, reject) => {
        Realm.open({ schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema], schemaVersion: 3})
        .then((realm) => {
            realm.write(() => {
                let taskToDelete = realm.create("Task", {id: taskID}, true);
                realm.delete(taskToDelete);
            })
        })
        .then(() => {
            pushNotifications.localNotification();
            resolve();
        })
        .catch((err) => {
            reject(err.toString());
        })
    })
}

export const checkAllTasks = (day) => {
    return new Promise((resolve, reject) => {
        Realm.open({ schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema], schemaVersion: 3 })
        .then((realm) => {
            realm.write(() => {
                let tasksToCheck = realm.objects("Task").filtered(`day == "${day}" AND isChecked == ${false}`);
                if (tasksToCheck.length !== 0) {
                    for (let task of tasksToCheck) {
                        task.isChecked = true;
                    }
                } else {
                    let tasksToUncheck = realm.objects("Task").filtered(`day == "${day}"`);
                    for (let task of tasksToUncheck) {
                        task.isChecked = false;
                    }
                }
                return;
            })
        })
        .then(() => {
            pushNotifications.localNotification();
            resolve();
        })
      .catch((error) => {
        reject(error.toString());
      })
    })
};

export const deleteAllTasks = (day) => {
    return new Promise((resolve, reject) => {
        Realm.open({ schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema], schemaVersion: 3})
        .then((realm) => {
            realm.write(() => {
                realm.delete(realm.objects("Task").filtered(`day == "${day}"`));
            })
        })
        .then(() => {
            pushNotifications.localNotification();
            resolve();
        })
        .catch((err) => {
            reject(err.toString());
        })
    })
}

export const unCheckEveryTaskInTheDatabase = () => {
    return new Promise((resolve, reject) => {
        Realm.open({ schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema], schemaVersion: 3})
        .then((realm) => {
            realm.write(() => {
                let amountOfTasks = realm.objects("Task");
                for (task of amountOfTasks) {
                    task.isChecked = false
                };
                return;
            })
        })
        .then(() => {
            pushNotifications.localNotification();
            resolve();
        })
        .catch((error) => {
            reject(error.toString());
        })
    })
}

export const getAmountOfTasksForTheDay = (day = "Monday") => {
    return new Promise((resolve, reject) => {
        Realm.open({ schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema], schemaVersion: 3})
            .then((realm) => {
                let taskObjects = realm.objects("Task").filtered(`day == "${day}" AND isChecked == ${false}`)
                resolve({
                    amount: taskObjects.length,
                    taskObjects
                })
            })
            .catch((error) => {
                reject(error.toString())
            })
    })
}