//Utilities
import theWeek from "../../../../utilities/theWeek";

//Services
import { pushNotifications } from "../../../../services/Index";

export const createInitialDays = async (): Promise<void> => {
  try {
    if (!global.realmContainer.objects("Settings")[0]) {
      global.realmContainer.write(() => {
        global.realmContainer.create("Settings", {
          id: 0,
          appFunctionality: "standard",
          dailyUpdate: true,
          dailyUpdatePersistance: false,
          dailyUpdateTime: "9:00 AM",
          noteFunctionality: "standard",
          taskReminders: true,
          sortTasksBy: "Reminder Time",
          theme: "light",
        });
      });
    }

    if (!global.realmContainer.objects("Day")[0]) {
      global.realmContainer.write(() => {
        for (let i = 0; i < theWeek.length; i++) {
          global.realmContainer.create("Day", {
            id: theWeek[i],
            tasks: [
              {
                id: i,
                day: theWeek[i],
                text: "Create tasks for the day here.",
                isChecked: false,
                reminder: false,
                reminderTime: "N/A",
                reminderTimeValue: 0,
              },
            ],
            note: { id: i, text: "Create a note for the day here." },
          });
        }
      });
    }

    await pushNotifications.createDailyRepeatingNotification("9:00 AM");
  } catch (err) {
    return JSON.stringify(err);
  }
};
