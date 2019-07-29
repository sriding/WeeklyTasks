import Realm from "realm";
import { DaySchema, TaskSchema, NoteSchema } from "../schemas/schemas";

export const deleteEverything = () => {
    Realm.open({ schema: [DaySchema, TaskSchema, NoteSchema]})
    .then((realm) => {
        realm.write(() => {
            realm.deleteAll();
        })
    })

}

export default deleteEverything;
