export const SettingsModel = {
  name: "Settings",
  primaryKey: "id",
  properties: {
    id: "int",
    dailyUpdate: "bool",
    dailyUpdatePersistance: "bool",
    dailyUpdateTime: "string",
    taskReminders: "bool",
    sortTasksBy: "string",
    theme: "string",
  },
};
