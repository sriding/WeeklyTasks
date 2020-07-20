import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";

import HomeScreen from "../components/HomeScreen/HomeScreen";
import DayScreen from "../components/DayScreen/DayScreen";
import SettingsScreen from "./../components/SettingsScreen/SettingsScreen";
import SideBar from "./../components/SideBar/SideBar";

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Day" component={DayScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

export default MyDrawer;
