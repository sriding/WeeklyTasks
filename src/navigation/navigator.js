import React, { Component } from 'react'
import { createDrawerNavigator, createAppContainer } from "react-navigation"

import HomeScreen from '../components/HomeScreen/HomeScreen';
import Day from "./../components/Day/Day";

const DrawerNavigator = createDrawerNavigator({
    Home: {
        screen: HomeScreen
    },
    DayScreen: {
        screen: Day
    }},
    {
    initialRouteName: "Home"
    })

export default createAppContainer(DrawerNavigator);