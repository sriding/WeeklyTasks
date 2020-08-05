import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from "react-navigation";

export interface DayObject {
  id: string;
  tasks: object[];
  note: object;
}

export interface AppProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

export interface AppState {
  taskInput: string;
  taskInputError: boolean;
  taskInputErrorText: string[];
  snackBarVisibility: boolean;
  snackBarIsError: boolean;
  snackBarText: string;
  sideBarToggle: boolean;
  dialogToggle: boolean;
  dialogListToggle: boolean;
  dayInformation: DayObject | null;
  dayOfTheWeek: string;
  amountOfTasksForTheDay: number;
  keyboardHeight: number;
  keyboardOpen: boolean;
  reminder: boolean;
  reminderTime: string;
  theme: string;
}
