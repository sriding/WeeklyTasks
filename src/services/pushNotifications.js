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

 const testLocalNotifications = () => {
  PushNotification.localNotification({
    title: "Title Test",
    message: "Message Test" // (required)
  })
 }

 const sendLocalNotification = () => {
  PushNotification.cancelAllLocalNotifications();

  let currentTime = moment().format("h:mm A");
  let currentDate = moment().format('dddd');
  let currentIndex = theWeek.indexOf(currentDate);

  //arrayStartingFromToday.forEach((day, index) => {
    for (let i = currentIndex; i < theWeek.length; i++) {
    getAmountOfTasksForTheDay(theWeek[i]).then((tasks) => {
      if (currentDate === theWeek[i]) {
        if (moment(currentTime, "h:mm A").isBefore(moment("10:00 AM", "h:mm A"))) {
          PushNotification.localNotificationSchedule({
            //... You can use all the options from localNotifications
            title: tasks.amount === 1 ? `You have 1 task remaining for today!` : `You have ${tasks.amount} tasks remaining for today!`,
            message: tasks.amount === 0 ? `No tasks to worry about!` : `Only ${tasks.amount} to go.`, // (required)
            date: new Date(moment().startOf('isoweek').add(i, 'days').add(10 , "hours").format()),
            repeatType: "week"
          });
        } else {
          //Do Nothing
        }

        for (task of tasks.taskObjects) {
          if (task.reminder === true && moment(currentTime, "h:mm A").isBefore(moment(task.reminderTime, "h:mm A"))) {
            PushNotification.localNotificationSchedule({
              //... You can use all the options from localNotifications
              title: "Reminder",
              message: task.text, // (required)
              date: new Date(moment().startOf('isoweek').add(i, 'days')
              .add(timeValues[task.reminderTime], "hours").format()),
              repeatType: "week"
            })
          } else {
            //Do nothing
          }
        }
      } else {
        PushNotification.localNotificationSchedule({
          //... You can use all the options from localNotifications
          title: tasks.amount === 1 ? `You have 1 task remaining for today!` : `You have ${tasks.amount} tasks remaining for today!`,
          message: tasks.amount === 0 ? `No tasks to worry about!` : `Only ${tasks.amount} to go.`, // (required)
          date: new Date(moment().startOf('isoweek').add(i, 'days').add(10 , "hours").format()), // in 60 secs
          repeatType: "week"
        });

        for (task of tasks.taskObjects) {
          if (task.reminder === true) {
            PushNotification.localNotificationSchedule({
              //... You can use all the options from localNotifications
              title: "Reminder",
              message: task.text, // (required)
              date: new Date(moment().startOf('isoweek').add(i, 'days')
              .add(timeValues[task.reminderTime], "hours").format()),
              largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
              smallIcon: "ic_launcher", // in 60 secs // in 60 secs
              repeatType: "week"
            })
          } else {
            //Do nothing
          }
        }
      }
    })
  }
   //PushNotification.cancelAllLocalNotifications();
   //arrayFromStartOfWeekToToday.forEach((day, index) => {
    for (let j = 0; j < currentIndex; j++) {
    getAmountOfTasksForTheDay(theWeek[j]).then((tasks) => {
      PushNotification.localNotificationSchedule({
        //... You can use all the options from localNotifications
        title: tasks.amount === 1 ? `You have 1 task remaining for today!` : `You have ${tasks.amount} tasks remaining for today!`,
        message: tasks.amount === 0 ? `No tasks to worry about!` : `Only ${tasks.amount} to go.`, // (required)
        date: new Date(moment().startOf('isoweek').add(7, "days").add(j, 'days').add(10, "hours").format()),
        repeatType: "week"
      });

      for (task of tasks.taskObjects) {
        if (task.reminder === true) {
          PushNotification.localNotificationSchedule({
            //... You can use all the options from localNotifications
            title: "Reminder",
            message: task.text, // (required)
            date: new Date(moment().startOf('isoweek').add(7, "days").add(j, 'days')
            .add(timeValues[task.reminderTime], "hours").format()),
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
   }
 }
 
 export {
  configure,
  testLocalNotifications,
  sendLocalNotification
 };