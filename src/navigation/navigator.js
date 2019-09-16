import { createDrawerNavigator, createAppContainer } from "react-navigation"

import HomeScreen from '../components/HomeScreen/HomeScreen';
import DayScreen from "../components/DayScreen/DayScreen";
import SettingsScreen from "./../components/SettingsScreen/SettingsScreen";
import SideBar from "./../components/SideBar/SideBar";

const DrawerNavigator = createDrawerNavigator({
    Home: {
        screen: HomeScreen
    },
    Day: {
        screen: DayScreen
    },
    Settings: {
        screen: SettingsScreen
    }},
    {
    initialRouteName: "Home",
    contentComponent: SideBar,
    })

export default createAppContainer(DrawerNavigator);