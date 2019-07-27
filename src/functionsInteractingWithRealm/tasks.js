const Realm = require("realm");
import {DaySchema, TaskSchema, NoteSchema} from "./../schemas/schemas";

export const addTask = (text, dayID, day) => {
    Realm.open({schema: [DaySchema, TaskSchema, NoteSchema]})
    .then((realm) => {
        const arrayOfIds = [];
        realm.objects('Task').forEach((task) => {
            arrayOfIds.push(task.id);
        })
        realm.write(() => {
            const newTask = realm.create("Task", {
                id: Math.max(...arrayOfIds) + 1,
                day,
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