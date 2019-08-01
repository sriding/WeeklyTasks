const Realm = require("realm");
import {DaySchema, TaskSchema, NoteSchema} from "./../schemas/schemas";

export const addNote = (text, noteID) => {
    return new Promise((resolve, reject) => {
        let trimmedText = text.trim();
        if (trimmedText.length === 0) {
            return reject("No text!");
        } else if (trimmedText.length > 350) {
            return reject("Cannot exceed 350 characters.")
        }
        Realm.open({ schema: [DaySchema, TaskSchema, NoteSchema]})
        .then((realm) => {
            realm.write(() => {
                realm.create("Note", {
                    id: noteID,
                    text: trimmedText
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
        let trimmedText = text.trim();
        if (trimmedText.length === 0) {
            return reject("No text!");
        } else if (trimmedText.length > 350) {
            return reject("Cannot exceed 350 characters.")
        }
        Realm.open({ schema: [DaySchema, TaskSchema, NoteSchema]})
        .then((realm) => {
            realm.write(() => {
                realm.create("Note", {
                    id: noteID,
                    text: trimmedText
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