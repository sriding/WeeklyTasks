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
  id: string;
  Day: DayObject | null;
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
