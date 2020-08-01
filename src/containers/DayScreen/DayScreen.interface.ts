import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from "react-navigation";
import { RouteProp } from "@react-navigation/native";

export interface DayObject {
  id: string;
  tasks: object[];
  note: object;
}
export interface AppProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  route: RouteProp<any, "profile">;
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
