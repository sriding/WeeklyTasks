import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from "@react-native-community/push-notification-ios";

import moment from "moment";

import { getAmountOfTasksForTheDay } from "./../functionsInteractingWithRealm/tasks";
import theWeek from "./../utilities/theWeek";

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
    getAmountOfTasksForTheDay(day).then((amount) => {
      PushNotification.localNotificationSchedule({
        //... You can use all the options from localNotifications
        id: day + "-" + index,
        title: amount === 1 ? `You have 1 task remaining for today!` : `You have ${amount} tasks remaining for today!`,
        message: amount === 0 ? `No tasks to worry about!` : `Only ${amount} to go.`, // (required)
        date: new Date(moment().startOf('isoweek').add(index, 'days').add(16 , "hours").format()), // in 60 secs
        repeatType: "week"
      });
    })
   })
 }
 
 export {
  configure,
  localNotification
 };