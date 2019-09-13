import React from 'react'
import { Appbar } from "react-native-paper";

import {
    NavigationParams,
    NavigationScreenProp,
    NavigationState,
  } from 'react-navigation';

interface AppProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>,
    sideBarIconClicked?: () => void,
    title: string,
    date: string
}

export default function Header(props: AppProps) {
    return (
         <Appbar.Header style={{height: 60}}>
            {props.navigation ? 
            <Appbar.BackAction 
                onPress={() => props.navigation.goBack()}
            /> : 
            <Appbar.Action 
                icon="view-headline"
                size={27}
                onPress={(() => props.sideBarIconClicked ? props.sideBarIconClicked() : null)}
            /> }
            <Appbar.Content
                title={props.title}
                titleStyle={{fontSize: 19}}
                subtitle={props.date}
            />
        </Appbar.Header>
        );
}

