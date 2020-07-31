import { ScrollView, TextInput } from "react-native";

export interface AppProps {
  firstScrollView: React.RefObject<ScrollView>;
  newTaskTextRef: React.RefObject<TextInput>;
  toggleFabButtonOptions: () => void;
  checkAllTasks: () => void;
  deleteAllTasks: () => void;
  topOffset: number;
  theme: string;
}
