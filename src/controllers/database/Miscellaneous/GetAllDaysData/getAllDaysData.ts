//Functions
import { getSortTasksBy } from "../../Settings/settings";
import { tasksForADayOrdered } from "../../Tasks/tasks";

export const getAllDaysData = async (): Promise<any> => {
  //console.log(Realm.defaultPath);
  try {
    let daysContainer = global.realmContainer.objects("Day");
    let customObjectToReturn: {
      [key: string]: { id: string; tasks: string; note: string };
    } = {};

    const mark = await getSortTasksBy();

    await daysContainer.forEach(async (day: any) => {
      customObjectToReturn[day.id] = {
        id: day.id,
        tasks: await tasksForADayOrdered(day.id, mark),
        note: day.note,
      };
    });

    daysContainer = null;

    return customObjectToReturn;
  } catch (err) {
    return JSON.stringify(err);
  }
};
