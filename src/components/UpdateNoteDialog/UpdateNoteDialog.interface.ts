import { TextInput } from "react-native";

export interface AppProps {
  updateNoteDialogVisible: boolean;
  dismissNoteDialog: () => void;
  updateNoteText: () => Promise<void>;
  updateNoteTextState: {
    text: string;
    noteID: number;
  };
  updatingUpdateNoteTextState: () => void;
  updateNoteTextError: boolean;
  updateNoteTextErrorText: string[];
  keyboardHeight: number;
  keyboardOpen: boolean;
  theme: string;
}
