import React from "react";
import { Appbar } from "react-native-paper";

import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
  NavigationActions,
} from "react-navigation";

interface AppProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  sideBarIconClicked?: () => void;
  title: string;
  date: string;
  back: boolean;
}

export default function Header(props: AppProps) {
  return (
    <Appbar.Header style={{ height: 60, elevation: 10 }}>
      {props.back ? (
        <Appbar.BackAction onPress={() => props.navigation.goBack()} />
      ) : (
        <Appbar.Action
          icon="view-headline"
          size={27}
          onPress={
            () => props.navigation.openDrawer()
            //props.sideBarIconClicked ? props.sideBarIconClicked() : null
          }
        />
      )}
      {props.date ? (
        <Appbar.Content
          title={props.title}
          titleStyle={{ fontSize: 19 }}
          subtitle={props.date}
        />
      ) : (
        <Appbar.Content title={props.title} titleStyle={{ fontSize: 19 }} />
      )}
    </Appbar.Header>
  );
}
