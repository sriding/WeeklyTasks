import { TextInput } from "react-native";

export interface AppProps {
  updateNoteDialogVisible: boolean;
  dismissNoteDialog: () => void;
  updateNoteText: () => void;
  updateNoteTextState: {
    text: string;
    noteID: number;
  };
  updatingUpdateNoteTextState: (text: string, nodeID: number) => void;
  updateNoteTextError: boolean;
  updateNoteTextErrorText: string;
  keyboardHeight: number;
  keyboardOpen: boolean;
  updateNoteTextRef: React.RefObject<TextInput>;
  theme: string;
}
