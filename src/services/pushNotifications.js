import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from "@react-native-community/push-notification-ios";

import moment from "moment";

import { getAmountOfTasksForTheDay } from "./../functionsInteractingWithRealm/tasks";
import theWeek from "./../utilities/theWeek";
import timeValues from "./../utilities/timeValues";

const configure = () => {
 PushNotification.configure({

   onRegister: function(token) {
     //process token
   },

   onNotification: function(notification) {
    console.log("NOTIFICATION:", notification);
     // process the notification
     // required on iOS only
     notification.finish(PushNotificationIOS.FetchResult.NoData);
   },

   permissions: {
     alert: true,
     badge: true,
     sound: true
   },

   popInitialNotification: true,
   requestPermissions: true,

 });
};

 const localNotification = () => {
   PushNotification.cancelAllLocalNotifications()
   theWeek.forEach((day, index) => {
    getAmountOfTasksForTheDay(day).then((tasks) => {
      PushNotification.localNotificationSchedule({
        //... You can use all the options from localNotifications
        id: day + "-" + index,
        title: tasks.amount === 1 ? `You have 1 task remaining for today!` : `You have ${tasks.amount} tasks remaining for today!`,
        message: tasks.amount === 0 ? `No tasks to worry about!` : `Only ${tasks.amount} to go.`, // (required)
        date: new Date(moment().startOf('isoweek').add(index, 'days').add(16 , "hours").format()), // in 60 secs
        repeatType: "week"
      });

      for (task of tasks.taskObjects) {
        if (task.reminder === true) {
          PushNotification.localNotificationSchedule({
            //... You can use all the options from localNotifications
            id: day + "-" + task.id + "-" + index,
            title: "Reminder",
            message: task.text, // (required)
            date: new Date(moment().startOf('isoweek').add(index, 'days')
            .add(timeValues[task.reminderTime], "hours").format()), // in 60 secs
            repeatType: "week"
          })
        } else {
          //Do nothing
        }
      }
    })
    .catch((error) => {
      console.log(`Pushnotification catch error: ${error}`);
    })
   })
 }
 
 export {
  configure,
  localNotification
 };