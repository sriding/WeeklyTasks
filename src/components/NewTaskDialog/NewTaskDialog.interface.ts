import { TextInput } from "react-native";

export interface AppProps {
  dialogToggle: boolean;
  dialogListToggle: boolean;
  dismissDialogToggle: () => void;
  dismissDialogList: () => void;
  toggleDialogList: () => void;
  setDayOfTheWeek: (day: string) => void;
  dayOfTheWeek: string;
  keyboardHeight: number;
  keyboardOpen: boolean;
  reminder: boolean;
  reminderTime: string;
  changeReminderTime: (reminderTime: string) => void;
  taskSubmitted: () => Promise<void>;
  theme: string;
}
