import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from "@react-native-community/push-notification-ios";

import moment from "moment";

import { getAmountOfTasksForTheDay } from "./../functionsInteractingWithRealm/tasks";
import { getDailyUpdate, getDailyUpdatePersistance, getDailyUpdateTime, getTaskReminders } from "./../functionsInteractingWithRealm/settings";
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

  
  getDailyUpdateTime().then((dailyUpdateTime) => {
  //Notifications for the remainder of this week
    for (let i = currentIndex; i < theWeek.length; i++) {
      getAmountOfTasksForTheDay(theWeek[i]).then((tasks) => {
        if (currentDate === theWeek[i]) {
          if (moment(currentTime, "h:mm A").isBefore(moment(dailyUpdateTime, "h:mm A"))) {
            getDailyUpdate().then((mark) => {
              if (mark === true) {
                getDailyUpdatePersistance().then((persist) => {
                  //if (persist === false) {
                  PushNotification.localNotificationSchedule({
                    title: "Daily Update",
                    message: tasks.amount === 1 ? `You have 1 task remaining for today.` : `You have ${tasks.amount} tasks remaining for today.`, // (required)
                    date: new Date(moment().startOf('isoweek').add(i, 'days').add(timeValues[dailyUpdateTime] , "hours").format()),
                    repeatType: "week",
                    largeIcon: "ic_launcher", 
                    smallIcon: "ic_notification",
                  })
                /*} else {
                  PushNotification.localNotificationSchedule({
                    title: "Daily Update",
                    message: tasks.amount === 1 ? `You have 1 task remaining for today.` : `You have ${tasks.amount} tasks remaining for today.`, // (required)
                    date: theWeek[i] === currentDate ? new Date(Date.now() + 2 * 1000) : new Date(moment().startOf('isoweek').add(i, 'days').format()),
                    largeIcon: "ic_launcher", 
                    smallIcon: "ic_notification",
                    ongoing: true,
                    playSound: false,
                    autoCancel: false,
                    visibility: "secret",
                    importance: "unspecified",
                    priority: "min"
                  })
                }*/
                })
              } else {
                //Do Nothing
              }
            })
          } else {
            /*getDailyUpdate().then((mark) => {
              if (mark === true) {
                getDailyUpdatePersistance().then((persist) => {
                  if (persist === true) {
                    PushNotification.localNotificationSchedule({
                      title: "Daily Update",
                      message: tasks.amount === 1 ? `You have 1 task remaining for today.` : `You have ${tasks.amount} tasks remaining for today.`, // (required)
                      date: new Date(Date.now() + 2 * 1000),
                      largeIcon: "ic_launcher", 
                      smallIcon: "ic_notification",
                      ongoing: true,
                      playSound: false,
                      autoCancel: false,
                      visibility: "secret",
                      importance: "unspecified",
                      priority: "min"
                    })
                  }
                })
              }})*/
          }

          getTaskReminders().then((mark) => {
            if (mark === true) {
              for (task of tasks.taskObjects) {
                if (task.reminder === true && moment(currentTime, "h:mm A").isBefore(moment(task.reminderTime, "h:mm A"))) {
                  PushNotification.localNotificationSchedule({
                    title: "Reminder",
                    message: task.text, // (required)
                    date: new Date(moment().startOf('isoweek').add(i, 'days')
                    .add(timeValues[task.reminderTime], "hours").format()),
                    repeatType: "week",
                    largeIcon: "ic_launcher", 
                    smallIcon: "ic_notification",
                  })
                } else {
                  //Do nothing
                }
              }
            } else {
              //Do nothing
            }
          })
        } 
        else {
          getDailyUpdate().then((mark) => {
            if (mark === true) {
              getDailyUpdatePersistance().then((persist) => {
                //if (persist === false) {
                PushNotification.localNotificationSchedule({
                  title: "Daily Update",
                  message: tasks.amount === 1 ? `You have 1 task remaining for today.` : `You have ${tasks.amount} tasks remaining for today.`, // (required)
                  date: new Date(moment().startOf('isoweek').add(i, 'days').add(timeValues[dailyUpdateTime] , "hours").format()), // in 60 secs
                  repeatType: "week",
                  largeIcon: "ic_launcher", 
                  smallIcon: "ic_notification",
                })
              /*} else {
                PushNotification.localNotificationSchedule({
                  title: "Daily Update",
                  message: tasks.amount === 1 ? `You have 1 task remaining for today.` : `You have ${tasks.amount} tasks remaining for today.`, // (required)
                  date: theWeek[i] === currentDate ? new Date(Date.now() + 2 * 1000) : new Date(moment().startOf('isoweek').add(i, 'days').format()), // in 60 secs
                  largeIcon: "ic_launcher", 
                  smallIcon: "ic_notification",
                  ongoing: true,
                  playSound: false,
                  autoCancel: false,
                  visibility: "secret",
                  importance: "unspecified",
                  priority: "min"
              })
            }*/
            })
          } else {
              //Do nothing
            }
          })

          getTaskReminders().then((mark) => {
            if (mark === true) {
              for (task of tasks.taskObjects) {
                if (task.reminder === true) {
                  PushNotification.localNotificationSchedule({
                    title: "Reminder",
                    message: task.text, // (required)
                    date: new Date(moment().startOf('isoweek').add(i, 'days')
                    .add(timeValues[task.reminderTime], "hours").format()),
                    largeIcon: "ic_launcher", 
                    smallIcon: "ic_notification",
                    repeatType: "week"
                  })
                } else {
                  //Do nothing
                }
              }
            }
          })
        }
      })
    }
  })

  getDailyUpdateTime().then((dailyUpdateTime) => {
  //Notifications for next week
    for (let j = 0; j < currentIndex; j++) {
          getAmountOfTasksForTheDay(theWeek[j]).then((tasks) => {
            getDailyUpdate().then((mark) => {
              if (mark === true) {
                getDailyUpdatePersistance().then((persist) => {
                  //if (persist === false) {
                  PushNotification.localNotificationSchedule({
                    title: "Daily Update",
                    message: tasks.amount === 1 ? `You have 1 task remaining for today.` : `You have ${tasks.amount} tasks remaining for today.`, // (required)
                    date: new Date(moment().startOf('isoweek').add(7, "days").add(j, 'days').add(timeValues[dailyUpdateTime], "hours").format()),
                    repeatType: "week",
                    largeIcon: "ic_launcher", 
                    smallIcon: "ic_notification",
                  })
                /*} else {
                  PushNotification.localNotificationSchedule({
                    title: "Daily Update",
                    message: tasks.amount === 1 ? `You have 1 task remaining for today.` : `You have ${tasks.amount} tasks remaining for today.`, // (required)
                    date: new Date(moment().startOf('isoweek').add(7, "days").add(j, 'days').format()),
                    largeIcon: "ic_launcher", 
                    smallIcon: "ic_notification",
                    ongoing: true,
                    playSound: false,
                    autoCancel: false,
                    visibility: "secret",
                    importance: "unspecified",
                    priority: "min"
                  })
                }*/
                })
              } else {
                //Do Nothing
              }
          })

      getTaskReminders().then((mark) => {
        if (mark === true) {
          for (task of tasks.taskObjects) {
            if (task.reminder === true) {
              PushNotification.localNotificationSchedule({
                title: "Reminder",
                message: task.text, // (required)
                date: new Date(moment().startOf('isoweek').add(7, "days").add(j, 'days')
                .add(timeValues[task.reminderTime], "hours").format()),
                repeatType: "week",
                largeIcon: "ic_launcher", 
                smallIcon: "ic_notification",
              })
            } else {
              //Do nothing
            }
          }
        }
      })
    })
   }
  })
 }
 
 export {
  configure,
  testLocalNotifications,
  sendLocalNotification
 };