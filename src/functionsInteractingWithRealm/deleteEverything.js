import Realm from "realm";
import { DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema } from "../schemas/schemas";

import { pushNotifications } from "./../services/Index";

export const deleteEverything = () => {
    return new Promise((resolve, reject) => {
        Realm.open({ schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema, SettingsSchema], schemaVersion: 5})
        .then((realm) => {
            realm.write(() => {
                realm.deleteAll();
            })
        })
        .then(() => {
            pushNotifications.sendLocalNotification();
            resolve();
        })
        .catch((error) => {
            reject(error.toString());
        }) 
    })
}

export default deleteEverything;
