const Realm = require("realm");

export const addNote = (text, dayID) => {
    Realm.open({ schema: [DaySchema, TaskSchema, NoteSchema]})
    .then((realm) => {
        const arrayOfIds = [];
        realm.objects('Note').forEach((note) => {
            arrayOfIds.push(note.id);
        })
        realm.write(() => {
            let newNote = realm.create("Note", {
                id: Math.max(...arrayOfIds) + 1,
                text
            });

            realm.create("Day", {
                id: dayID,
                note: newNote
            }, true)
        })
    })
    .catch((err) => {
        console.log(err);
    })
};

export const updateNote = (text, noteID) => {
    Realm.open({ schema: NoteSchema})
    .then((realm) => {
        realm.write(() => {
            realm.create("Note", {
                id: noteID,
                text
            }, true)
        })
    })
    .catch((err) => {
        console.log(err);
    })
};

export const deleteNote = (noteID) => {
    Realm.open({ schema: NoteSchema })
    .then((realm) => {
        realm.write(() => {
            realm.delete(realm.objects("Note").filtered(`id == "${noteID}"`))
        })
    })
    .catch(() => {
        console.log(err);
    })
};