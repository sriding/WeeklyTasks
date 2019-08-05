import Realm from "realm";
import { DaySchema, TaskSchema, NoteSchema, LoginSchema } from "../schemas/schemas";

export const deleteEverything = () => {
    return new Promise((resolve, reject) => {
        Realm.open({ schema: [DaySchema, TaskSchema, NoteSchema, LoginSchema]})
        .then((realm) => {
            realm.write(() => {
                resolve(realm.deleteAll());
            })
        })
        .catch((error) => {
            reject(error);
        }) 
    })
}

export default deleteEverything;
