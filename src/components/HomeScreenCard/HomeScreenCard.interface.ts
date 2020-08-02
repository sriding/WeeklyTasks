import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from "react-navigation";

export interface DayInformationObject {
  id: string;
  tasks: {
    id: number;
    day: string;
    text: string;
    isChecked: boolean;
    reminder: boolean;
    reminderTime: string;
    reminderTimeValue: string;
  }[];
  note: {
    id: number;
    text: string;
  };
}

export interface AppProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  dayInformation: DayInformationObject;
  theme: string;
}
