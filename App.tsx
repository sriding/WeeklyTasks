import React from 'react';

import { Provider as PaperProvider } from "react-native-paper"
//Components
import DrawerNavigator from "./src/navigation/navigator";

const App = () => {
  return (
    <PaperProvider>
      <DrawerNavigator />
    </PaperProvider>
  )
};

export default App;