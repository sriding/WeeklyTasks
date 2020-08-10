//Services
import { pushNotifications } from "../../../../services/Index";

export const deleteEverythingInDB = async (
  path: null | string = null
): Promise<void> => {
  try {
    global.realmContainer.write(() => {
      global.realmContainer.deleteAll();
    });

    await pushNotifications.removeAllLocalNotifications();
  } catch (err) {
    return JSON.stringify(err);
  }
};

export default deleteEverythingInDB;
