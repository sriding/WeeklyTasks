const Realm = require("realm");
import {DaySchema, TaskSchema, NoteSchema} from "./../schemas/schemas";

export const addNote = (text, noteID) => {
    return new Promise((resolve, reject) => {
        Realm.open({ schema: [DaySchema, TaskSchema, NoteSchema]})
        .then((realm) => {
            realm.write(() => {
                realm.create("Note", {
                    id: noteID,
                    text
                }, true)
                resolve();
            })
        })
        .catch((error) => {
            reject(error);
        })
    })
};

export const updateNote = (text, noteID) => {
    return new Promise((resolve, reject) => {
        Realm.open({ schema: [DaySchema, TaskSchema, NoteSchema]})
        .then((realm) => {
            realm.write(() => {
                realm.create("Note", {
                    id: noteID,
                    text
                }, true)
                resolve();
            })
        })
        .catch((error) => {
            reject(error);
        })
    })
};

export const deleteNote = (noteID) => {
    return new Promise((resolve, reject) => {
        Realm.open({ schema: [DaySchema, TaskSchema, NoteSchema] })
        .then((realm) => {
            realm.write(() => {
                realm.create("Note", {
                    id: noteID,
                    text: ""
                }, true)
                resolve();
            })
        })
        .catch((error) => {
            reject(error);
        })
    })
};