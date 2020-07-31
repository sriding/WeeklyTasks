export interface AppProps {
  reminder: boolean;
  reminderTime: string;
  changeReminderTime: (reminderTime: string) => void;
  text: string;
}

export interface AppState {
  menuVisibility: boolean;
}
