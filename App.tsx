import React from 'react';

import { Provider as PaperProvider } from "react-native-paper"
import { pushNotifications } from "./src/services/Index";
//Components
import DrawerNavigator from "./src/navigation/navigator";

pushNotifications.configure();

const App = () => {
  return (
    <PaperProvider>
      <DrawerNavigator />
    </PaperProvider>
  )
};

export default App;