import { TextInput as NativeTextInput, ScrollView } from "react-native";

export interface DayObject {
  id: string;
  tasks: object[];
  note: object;
}

export interface AppProps {
  Day: DayObject | null;
  checkTask: (taskID: number, isChecked: boolean) => Promise<void>;
  deleteTask: (taskID: number) => Promise<void>;
  deleteNote: (noteID: number) => Promise<void>;
  submitTaskText: (
    useSnackBar: boolean,
    snackBarText?: string
  ) => Promise<void>;
  id: string;
  newTaskTextRef: React.RefObject<NativeTextInput>;
  newNoteTextRef: React.RefObject<NativeTextInput>;
  firstScrollView: React.RefObject<ScrollView>;
  keyboardHeight: number;
  keyboardOpen: boolean;
  theme: string;
}

export interface AppState {
  newTaskText: string;
  newNoteText: string;
  newTaskTextError: boolean;
  newNoteTextError: boolean;
  newTaskTextErrorText: string[];
  newNoteTextErrorText: string[];
  showTaskButtons: boolean;
  showNoteButtons: boolean;
  updateTaskTextError: boolean;
  updateNoteTextError: boolean;
  updateTaskTextErrorText: string[];
  updateNoteTextErrorText: string[];
  updateTaskTextState: {
    text: string;
    taskID: number;
  };
  updateNoteTextState: {
    text: string;
    noteID: number;
  };
  updateTaskDialogVisible: boolean;
  updateNoteDialogVisible: boolean;
  paddingBottom: number;
  menuVisibility: boolean;
  reminder: boolean;
  reminderTime: string;
}
