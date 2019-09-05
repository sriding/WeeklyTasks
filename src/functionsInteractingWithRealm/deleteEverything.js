import Realm from "realm";
import { DaySchema, TaskSchema, NoteSchema, LoginSchema } from "../schemas/schemas";

import { pushNotifications } from "./../services/Index";

export const deleteEverything = () => {
    return new Promise((resolve, reject) => {
        Realm.open({ schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema], schemaVersion: 3})
        .then((realm) => {
            realm.write(() => {
                realm.deleteAll();
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

export default deleteEverything;
