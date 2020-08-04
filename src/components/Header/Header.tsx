//Core React and React Native modules
import React from "react";
import { StyleSheet, View, Keyboard } from "react-native";

//React Native Paper modules
import { Appbar } from "react-native-paper";

//Interfaces
import { AppProps } from "./Header.interface";

export default function Header(props: AppProps) {
  return (
    <Appbar.Header style={styles.AppBarHeader}>
      <View style={styles.NavigationIconsContainer}>
        {props.screen !== "Home" ? (
          <Appbar.BackAction
            onPress={() => {
              Keyboard.dismiss();
              props.navigation.goBack();
            }}
            color="white"
          />
        ) : null}
        <Appbar.Action
          icon="view-headline"
          size={27}
          color="white"
          onPress={() => {
            Keyboard.dismiss();
            props.navigation.openDrawer();
          }}
        />
      </View>
      {props.date ? (
        <Appbar.Content
          title={props.title}
          titleStyle={styles.AppBarContentTitle}
          style={styles.AppBarContentStyle}
        />
      ) : (
        <Appbar.Content
          title={props.title}
          titleStyle={styles.AppBarContentTitle}
          style={styles.AppBarContentStyle}
        />
      )}
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  AppBarHeader: {
    elevation: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  NavigationIconsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  AppBackAction: {
    marginRight: 0,
  },
  AppBarContentTitle: {
    fontSize: 22,
  },
  AppBarContentStyle: {
    marginLeft: 0,
    paddingLeft: 0,
  },
});
