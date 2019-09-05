export const DaySchema = {
    name: "Day",
    primaryKey: 'id',
    properties: {
        id: 'string',
        tasks: 'Task[]',
        note: "Note"
    }
}

export const TaskSchema = {
    name: 'Task',
    primaryKey: 'id',
    properties: {
      id: 'int',
      day: 'string',
      text:  'string',
      isChecked: "bool",
      reminder: 'bool',
      reminderTime: 'string'
    }
};
  
export const NoteSchema = {
    name: 'Note',
    primaryKey: 'id',
    properties: {
      id: 'int',
      text: 'string',
    }
}

export const LoginSchema = {
  name: "Login",
  primaryKey: 'id',
  properties: {
    id: 'int',
    date: 'string',
    alreadyLoggedInToday: 'bool'
  }
}