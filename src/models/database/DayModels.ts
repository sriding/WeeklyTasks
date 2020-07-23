export const DayModel = {
  name: "Day",
  primaryKey: "id",
  properties: {
    id: "string",
    tasks: "Task[]",
    note: "Note",
  },
};
