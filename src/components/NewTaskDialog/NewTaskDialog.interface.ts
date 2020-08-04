import { TextInput } from "react-native";

export interface AppProps {
  dialogToggle: boolean;
  dialogListToggle: boolean;
  dismissDialogToggle: () => void;
  dismissDialogList: () => void;
  taskInputChange: (text: string) => void;
  taskInput: string;
  textInputRef: React.RefObject<TextInput>;
  toggleDialogList: () => void;
  creatingTask: () => Promise<void>;
  setDayOfTheWeek: (day: string) => void;
  dayOfTheWeek: string;
  taskInputError: boolean;
  taskInputErrorText: string;
  keyboardHeight: number;
  keyboardOpen: boolean;
  reminder: boolean;
  reminderTime: string;
  changeReminderTime: (reminderTime: string) => void;
  theme: string;
}
