const Realm = require("realm");

// Define your models and their properties
export const DaySchema = {
    name: "Day",
    properties: {
        day: 'string',
        tasks: 'Task[]',
        note: "Note"
    }
}

export const TaskSchema = {
    name: 'Task',
    properties: {
      text:  'string',
      isChecked: "bool",
    }
};
  
export const NoteSchema = {
    name: 'Note',
    properties: {
      text: 'string',
    }
}
  
export function createInitialDays(DaySchema, TaskSchema, NoteSchema) {
    console.log(Realm.defaultPath);
    Realm.open({schema: [DaySchema, TaskSchema, NoteSchema]})
        .then(realm => {
            if (realm.objects('Day')[0]) {
                return null;
            } else {
                const daysOfTheWeek = ["Monday", "Tuesday", "Wednesday", 
                "Thursday", "Friday", "Saturday", "Sunday"];

                realm.write(() => {
                    for (let i = 0; i < daysOfTheWeek.length; i++) {
                        realm.create('Day', {
                            day: daysOfTheWeek[i],
                            tasks: [{text: "Create tasks for the day here.", isChecked: false}],
                            note: {text: "Create a note for the day here."}
                        });
                    }
                });
            }
        // Create Realm objects and write to local storage
        })
        .catch(error => {
            console.log(error);
        });
    }