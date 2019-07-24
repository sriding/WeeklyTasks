import React, {Fragment} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  FlatList,
  Button,
} from 'react-native';

//React Native Paper, Material Design
import { Provider as PaperProvider } from "react-native-paper";

//Components
import DayCard from "./../DayCard";

const HomeScreen = (props) => {
  return (
    <PaperProvider>
      <SafeAreaView>
        <View style={styles.mainContainer}>
          <ScrollView style={styles.leftPaneContainer}>
            <FlatList
            data={[{text: "Mon", day: Date.now(), key: "One"}, {text: "Tue", day: Date.now(), key: "Two"}, {text: "Wed", day: Date.now(), key: "Three"}, {text: "Thur", day: Date.now(), key: "Four"}, {text: "Fri", day: Date.now(), key: "Five"}, {text: "Sat", day: Date.now(), key: "Six"}, {text: "Sun", day: Date.now(), key: "Seven"}]}
            renderItem={({item}) => {
              return <Text style={styles.leftPaneText}>{item.text}</Text>
            }}
            >
            </FlatList>
          </ScrollView>
          <ScrollView style={styles.middlePaneContainer}>
            <DayCard navigation={props.navigation}/>
            <DayCard navigation={props.navigation}/>
            <DayCard navigation={props.navigation}/>
            <DayCard navigation={props.navigation}/>
            <DayCard navigation={props.navigation}/>
            <DayCard navigation={props.navigation}/>
            <DayCard navigation={props.navigation}/>
          </ScrollView>
          <ScrollView style={styles.rightPaneContainer} />
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flexDirection: "row",
    backgroundColor: "#EDF0FF",
    color: "#3A4890"
  },
  leftPaneContainer: {
    flexGrow: 0.3,
    borderStyle: "solid",
    borderRightWidth: 1,
    marginRight: 20,
    minWidth: 100,
    backgroundColor: "#fff"
  },
  leftPaneText: {
    textAlign: "center",
    fontSize: 22,
    padding: 20
  },
  middlePaneContainer: {
    flexGrow: 1.4
  },
  rightPaneContainer: {
    flexGrow: 0.3,
    minWidth: 18
  }
});

export default HomeScreen;