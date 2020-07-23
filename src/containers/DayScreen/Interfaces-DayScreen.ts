import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from "react-navigation";

export interface DayObject {
  id: string;
  tasks: { id: number; day: string; text: string; isChecked: boolean }[];
  note: {
    id: number;
    text: string;
  };
}
export interface AppProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

export interface AppState {
  id: string;
  Day: DayObject;
  fabButtonClicked: boolean;
  snackBarVisibility: boolean;
  snackBarIsError: boolean;
  snackBarText: string;
  keyboardHeight: number;
  keyboardOpen: boolean;
  date: string;
  topOffset: number;
  theme: string;
}
