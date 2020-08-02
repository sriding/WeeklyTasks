import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from "react-navigation";

export interface AppProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  sideBarIconClicked?: () => void;
  title: string;
  back: boolean;
  screen: string;
}
