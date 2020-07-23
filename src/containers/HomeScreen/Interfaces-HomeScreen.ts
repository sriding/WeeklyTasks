import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from "react-navigation";

export interface DayObject {
  id: string;
  tasks: {
    id: number;
    day: string;
    text: string;
    isChecked: boolean;
  }[];
  note: {
    id: number;
    text: string;
  };
}
export interface AppProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

export interface AppState {
  taskInput: string;
  taskInputError: boolean;
  taskInputErrorText: string;
  snackBarVisibility: boolean;
  snackBarIsError: boolean;
  snackBarText: string;
  sideBarToggle: boolean;
  dialogToggle: boolean;
  dialogListToggle: boolean;
  dayInformation: any;
  dayOfTheWeek: string;
  amountOfTasksForTheDay: number;
  keyboardHeight: number;
  keyboardOpen: boolean;
  date: string;
  reminder: boolean;
  reminderTime: string;
  theme: string;
}
