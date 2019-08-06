import { createDrawerNavigator, createAppContainer } from "react-navigation"

import HomeScreen from '../components/HomeScreen/HomeScreen';
import DayScreen from "../components/DayScreen/DayScreen";

const DrawerNavigator = createDrawerNavigator({
    Home: {
        screen: HomeScreen
    },
    Day: {
        screen: DayScreen
    }},
    {
    initialRouteName: "Home"
    })

export default createAppContainer(DrawerNavigator);