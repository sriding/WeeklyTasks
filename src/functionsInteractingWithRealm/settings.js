const Realm = require("realm");
import {DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema} from "./../schemas/schemas";

import { pushNotifications } from "./../services/Index";

export const getDailyUpdate = () => {
    return new Promise((resolve, reject) => {
        Realm.open({ schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema], schemaVersion: 5})
        .then((realm) => {
            if (realm.objects("Settings")[0] == undefined) {
                resolve(true);
            } else {
                resolve(realm.objects("Settings")[0].dailyUpdate);
            }
        })
        .catch((error) => {
            reject(error);
        })
    })
}

export const getDailyUpdatePersistance = () => {
    return new Promise((resolve, reject) => {
        Realm.open({ schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema], schemaVersion: 5})
        .then((realm) => {
            resolve(realm.objects("Settings")[0].dailyUpdatePersistance);
        })
        .catch((error) => {
            reject(error);
        })
    })
}

export const getDailyUpdateTime = () => {
    return new Promise((resolve, reject) => {
        Realm.open({ schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema], schemaVersion: 5})
        .then((realm) => {
            if (realm.objects("Settings")[0] == undefined) {
                resolve("9:00 AM");
            } else {
                resolve(realm.objects("Settings")[0].dailyUpdateTime);
            }
        })
        .catch((error) => {
            reject(error);
        })
    })
}

export const getTaskReminders = () => {
    return new Promise((resolve, reject) => {
        Realm.open({ schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema], schemaVersion: 5})
        .then((realm) => {
            resolve(realm.objects("Settings")[0].taskReminders);
        })
        .catch((error) => {
            reject(error);
        })
    })
}

export const getSortTasksBy = () => {
    return new Promise((resolve, reject) => {
        Realm.open({ schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema], schemaVersion: 5})
        .then((realm) => {
            resolve(realm.objects("Settings")[0].sortTasksBy);
        })
        .catch((error) => {
            reject(error);
        })
    })
}

export const getTheme = () => {
    return new Promise((resolve, reject) => {
        Realm.open({ schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema], schemaVersion: 5})
        .then((realm) => {
            if (realm.objects("Settings")[0] == undefined) {
                resolve("light");
            } else {
                resolve(realm.objects("Settings")[0].theme);
            }
        })
        .catch((error) => {
            reject(error);
        })
    })
}

export const changeDailyUpdate = (bool = true) => {
    return new Promise((resolve, reject) => {
        Realm.open({ schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema], schemaVersion: 5})
        .then((realm) => {
            realm.write(() => {
                realm.create("Settings", {
                    id: 0,
                    dailyUpdate: bool
                }, true)
            })
        })
        .then(() => {
            pushNotifications.sendLocalNotification();
            resolve();
        })
        .catch((error) => {
            reject(error);
        })
    })
}

export const changeDailyUpdatePersistance = (bool = true) => {
    return new Promise((resolve, reject) => {
        Realm.open({ schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema], schemaVersion: 5})
        .then((realm) => {
            realm.write(() => {
                realm.create("Settings", {
                    id: 0,
                    dailyUpdatePersistance: bool
                }, true)
            })
        })
        .then(() => {
            pushNotifications.sendLocalNotification();
            resolve();
        })
        .catch((error) => {
            reject(error);
        })
    })
}

export const changeDailyUpdateTime= (string = "9:00 AM") => {
    return new Promise((resolve, reject) => {
        Realm.open({ schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema], schemaVersion: 5})
        .then((realm) => {
            realm.write(() => {
                realm.create("Settings", {
                    id: 0,
                    dailyUpdateTime: string
                }, true)
            })
        })
        .then(() => {
            pushNotifications.sendLocalNotification();
            resolve();
        })
        .catch((error) => {
            reject(error);
        })
    })
}

export const changeTaskReminders = (bool = true) => {
    return new Promise((resolve, reject) => {
        Realm.open({ schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema], schemaVersion: 5})
        .then((realm) => {
            realm.write(() => {
                realm.create("Settings", {
                    id: 0,
                    taskReminders: bool
                }, true)
            })
        })
        .then(() => {
            pushNotifications.sendLocalNotification();
            resolve();
        })
        .catch((error) => {
            reject(error);
        })
    })
}

export const changeSortTasksBy = (string = "Reminder Time") => {
    return new Promise((resolve, reject) => {
        Realm.open({ schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema], schemaVersion: 5})
        .then((realm) => {
            realm.write(() => {
                realm.create("Settings", {
                    id: 0,
                    sortTasksBy: string
                }, true)
                resolve();
            })
        })
        .catch((error) => {
            reject(error);
        })
    })
}

export const changeTheme = (string = "light") => {
    return new Promise((resolve, reject) => {
        Realm.open({ schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema], schemaVersion: 5})
        .then((realm) => {
            realm.write(() => {
                realm.create("Settings", {
                    id: 0,
                    theme: string
                }, true)
                resolve();
            })
        })
        .catch((error) => {
            reject(error);
        })
    })
}