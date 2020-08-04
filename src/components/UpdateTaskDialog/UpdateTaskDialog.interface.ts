import { TextInput } from "react-native";

export interface AppProps {
  updateTaskDialogVisible: boolean;
  dismissTaskDialog: () => void;
  updateTaskText: () => Promise<void>;
  updateTaskTextState: {
    text: string;
    taskID: number;
  };
  updatingUpdateTaskTextState: (text: string, taskID: number) => void;
  updateTaskTextError: boolean;
  updateTaskTextErrorText: string;
  keyboardHeight: number;
  keyboardOpen: boolean;
  updateTaskTextRef: React.RefObject<TextInput>;
  reminder: boolean;
  reminderTime: string;
  changeReminderTime: (reminderTime: string) => void;
  theme: string;
}
