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
