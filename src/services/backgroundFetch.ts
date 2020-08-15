import BackgroundFetch from "react-native-background-fetch";

export const configure = async () => {};

const headlessFunction = async (event: any) => {
  // Get task id from event {}:
  let taskId = event.taskId;
  console.log("[BackgroundFetch HeadlessTask] start: ", taskId);
  BackgroundFetch.finish(taskId);
};

export const registerHeadlessFunction = () => {
  BackgroundFetch.registerHeadlessTask(headlessFunction);
};

export const scheduleTaskInitialNotification = () => {
  BackgroundFetch.scheduleTask({
    taskId: "com.foo.customtask",
    forceAlarmManager: false,
    enableHeadless: true,
    stopOnTerminate: false,
    startOnBoot: true,
    periodic: true,
    delay: 50000, // <-- milliseconds
  });
};

export const scheduleTaskOngoingNotification = () => {
  console.log("ongoing notification.");
  BackgroundFetch.scheduleTask({
    taskId: "bonkers",
    forceAlarmManager: false,
    enableHeadless: true,
    startOnBoot: true,
    stopOnTerminate: false,
    periodic: true,
    delay: 60000, // <-- milliseconds
  });
};
