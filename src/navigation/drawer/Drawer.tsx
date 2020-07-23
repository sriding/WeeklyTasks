import React from "react";
import HomeScreen from "../../components/HomeScreen/HomeScreen";
import DayScreen from "../../components/DayScreen/DayScreen";
import SettingsScreen from "../../components/SettingsScreen/SettingsScreen";
import SideBar from "../../components/SideBar/SideBar";

import { createDrawerNavigator } from "@react-navigation/drawer";

const DrawerNavigator = createDrawerNavigator();

const Drawer = () => {
  return (
    <DrawerNavigator.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <SideBar navigation={props.navigation} />}
    >
      <DrawerNavigator.Screen name="Home" component={HomeScreen} />
      <DrawerNavigator.Screen name="Day" component={DayScreen} />
      <DrawerNavigator.Screen name="Settings" component={SettingsScreen} />
    </DrawerNavigator.Navigator>
  );
};

export default Drawer;
