import { TextInput as NativeTextInput, ScrollView } from "react-native";

export interface DayObject {
  id: string;
  tasks: { id: number; day: string; text: string; isChecked: boolean }[];
  note: {
    id: number;
    text: string;
  };
}

export interface AppProps {
  Day: DayObject;
  checkTask: (taskID: number, isChecked: boolean) => void;
  deleteTask: (taskID: number) => void;
  deleteNote: (noteID: number) => void;
  submitTaskText: (useSnackBar: boolean, snackBarText?: string) => void;
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
  newTaskTextErrorText: string;
  newNoteTextErrorText: string;
  updateTaskTextError: boolean;
  updateNoteTextError: boolean;
  updateTaskTextErrorText: string;
  updateNoteTextErrorText: string;
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
