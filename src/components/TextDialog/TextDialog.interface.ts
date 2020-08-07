export interface AppProps {
  showTextDialog: boolean;
  toggleTextDialog: () => void;
  functionToRun: () => void;
  text: string;
}
