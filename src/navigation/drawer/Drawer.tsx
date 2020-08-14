//React Native modules
import React from "react";

//Components
import HomeScreen from "../../containers/HomeScreen/HomeScreen";
import DayScreen from "../../containers/DayScreen/DayScreen";
import SettingsScreen from "../../containers/SettingsScreen/SettingsScreen";
import SideBar from "../../components/SideBar/SideBar";

//React Native Navigation
import { createDrawerNavigator } from "@react-navigation/drawer";

const DrawerNavigator: any = createDrawerNavigator();

const Drawer = () => {
  return (
    <DrawerNavigator.Navigator
      initialRouteName="Home"
      drawerContent={(props: any) => <SideBar navigation={props.navigation} />}
    >
      <DrawerNavigator.Screen name="Home" component={HomeScreen} />
      <DrawerNavigator.Screen name="Day" component={DayScreen} />
      <DrawerNavigator.Screen name="Settings" component={SettingsScreen} />
    </DrawerNavigator.Navigator>
  );
};

export default Drawer;
