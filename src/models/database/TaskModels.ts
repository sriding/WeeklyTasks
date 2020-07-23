export const TaskModel = {
  name: "Task",
  primaryKey: "id",
  properties: {
    id: "int",
    day: "string",
    text: "string",
    isChecked: "bool",
    reminder: "bool",
    reminderTime: "string",
    reminderTimeValue: "double",
  },
};
