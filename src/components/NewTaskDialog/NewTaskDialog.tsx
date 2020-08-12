import React, { Fragment } from "react";

import {
  ScrollView,
  Dimensions,
  StyleSheet,
  Pressable,
  Keyboard,
} from "react-native";
import {
  Portal,
  Dialog,
  TextInput,
  List,
  Button,
  Paragraph,
  Divider,
} from "react-native-paper";

import theWeek from "../../utilities/theWeek";

import SetReminder from "./../SetReminder/SetReminder";
import { AppProps } from "./NewTaskDialog.interface";
import { addTask } from "../../controllers/database/Tasks/tasks";

export default function NewTaskDialog(props: AppProps) {
  const [textInput, changeTextInput] = React.useState<string>("");
  const [inputErrorExists, changeInputErrorExists] = React.useState<boolean>(
    false
  );
  const [inputErrorTextArray, changeInputErrorTextArray] = React.useState<
    string[]
  >([]);
  const [containerMargins, setContainerMargins] = React.useState({
    marginLeft: 0,
    marginRight: 0,
  });
  const [keyboardOpen, setKeyboardOpen] = React.useState<boolean>(false);
  const [containerTopProperty, setContainerTopProperty] = React.useState<
    number
  >(0);
  const [isLandscape, setIsLandscape] = React.useState<boolean>(false);

  React.useEffect(() => {
    setMarginsBasedOnDeviceWidth();
    Dimensions.addEventListener("change", setMarginsBasedOnDeviceWidth);
    Keyboard.addListener("keyboardDidShow", (e) => keyboardDidShowFunction(e));
    Keyboard.addListener("keyboardDidHide", (e) => keyboardDidHideFunction(e));

    return function cleanup() {
      Dimensions.removeEventListener("change", setMarginsBasedOnDeviceWidth);
      Keyboard.removeListener("keyboardDidShow", (e) =>
        keyboardDidShowFunction(e)
      );
      Keyboard.removeListener("keyboardDidHide", (e) =>
        keyboardDidHideFunction(e)
      );
    };
  }, []);

  const keyboardDidShowFunction = (e) => {
    setKeyboardOpen(true);
    if (Dimensions.get("window").height < Dimensions.get("window").width) {
      setContainerTopProperty(
        Math.abs(
          (Dimensions.get("window").height - e.endCoordinates.height - 100) / 2
        )
      );
      setIsLandscape(true);
    } else {
      setContainerTopProperty(
        Math.abs(
          (Dimensions.get("window").height - e.endCoordinates.height - 300) / 2
        )
      );
      setIsLandscape(false);
    }
  };

  const keyboardDidHideFunction = (e) => {
    setKeyboardOpen(false);
    setContainerTopProperty(0);
  };

  const setMarginsBasedOnDeviceWidth = () => {
    let currentScreenWidth = Dimensions.get("window").width;

    if (currentScreenWidth > 700) {
      setContainerMargins({
        marginLeft: (currentScreenWidth - 700) / 2,
        marginRight: (currentScreenWidth - 700) / 2,
      });
    }
  };

  const submitTask = async () => {
    try {
      let expectVoid = await addTask(
        textInput,
        props.dayOfTheWeek,
        props.reminder,
        props.reminderTime
      );

      if (expectVoid !== null && expectVoid !== undefined) {
        throw expectVoid;
      }

      clearTextInputAndErrors();
      props.dismissDialogToggle();
      await props.taskSubmitted();
    } catch (err) {
      changeInputErrorExists(true);
      changeInputErrorTextArray(Object.values(JSON.parse(err)));
    }
  };

  const cancelTask = () => {
    clearTextInputAndErrors();
    props.dismissDialogToggle();
  };

  const clearTextInputAndErrors = () => {
    changeTextInput("");
    changeInputErrorExists(false);
    changeInputErrorTextArray([]);
  };

  return (
    <Portal>
      <Dialog
        visible={props.dialogToggle}
        onDismiss={props.dismissDialogToggle}
        style={{
          ...styles.mainDialogContainer,
          width: Dimensions.get("window").width >= 700 ? 700 : "90%",
          position: keyboardOpen ? "absolute" : "relative",
          top: containerTopProperty,
          marginLeft: containerMargins.marginLeft,
          marginRight: containerMargins.marginRight,
          backgroundColor: props.theme === "light" ? "white" : "#181818",
        }}
      >
        <Pressable
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          {keyboardOpen && isLandscape ? null : (
            <Fragment>
              <Dialog.Title style={{ marginBottom: 0 }}>Task</Dialog.Title>
              <Divider
                style={{
                  ...styles.dividerStyle,
                  backgroundColor: props.theme === "light" ? "silver" : "white",
                }}
              />
            </Fragment>
          )}
          {keyboardOpen && isLandscape ? null : (
            <SetReminder
              reminder={props.reminder}
              reminderTime={props.reminderTime}
              changeReminderTime={props.changeReminderTime}
              theme={props.theme}
              text="Set Reminder Time: "
            />
          )}
          <Dialog.Content style={{ marginTop: 3 }}>
            <TextInput
              mode="outlined"
              multiline={true}
              numberOfLines={3}
              placeholder="Input"
              placeholderTextColor="gray"
              error={inputErrorExists}
              style={styles.textInputStyle}
              onChangeText={(text) => changeTextInput(text)}
              value={textInput}
              selectionColor={props.theme === "light" ? "black" : "white"}
            />
            {inputErrorTextArray.map((errors, index) => {
              return (
                <Paragraph
                  key={index}
                  style={{
                    color: props.theme === "light" ? "#C00000" : "#ff8080",
                  }}
                >
                  {errors}
                </Paragraph>
              );
            })}
          </Dialog.Content>
          {keyboardOpen && isLandscape ? null : (
            <Dialog.Content>
              <List.Accordion
                title={props.dayOfTheWeek}
                expanded={props.dialogListToggle}
                onPress={() => {
                  props.toggleDialogList();
                  Keyboard.dismiss();
                }}
                style={styles.dropdownDayListContainer}
              >
                <Dialog.ScrollArea
                  style={{
                    marginBottom: 0,
                  }}
                >
                  <ScrollView style={styles.dropdownScrollView}>
                    {theWeek.map((day, index) => {
                      return (
                        <List.Item
                          key={index}
                          onPress={() => {
                            props.dismissDialogList();
                            props.setDayOfTheWeek(day);
                          }}
                          title={day}
                          style={{ flexGrow: 1 }}
                        />
                      );
                    })}
                  </ScrollView>
                </Dialog.ScrollArea>
              </List.Accordion>
            </Dialog.Content>
          )}
          {keyboardOpen && isLandscape ? null : (
            <Dialog.Actions style={{ marginTop: 0 }}>
              <Button
                onPress={cancelTask}
                color={props.theme === "light" ? "#6200ee" : "white"}
              >
                Cancel
              </Button>
              <Button
                onPress={async () => await submitTask()}
                color={props.theme === "light" ? "#6200ee" : "white"}
              >
                Create
              </Button>
            </Dialog.Actions>
          )}
        </Pressable>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  mainDialogContainer: {
    maxWidth: 700,
    elevation: 10,
    borderWidth: 1,
    borderColor: "white",
    alignSelf: "center",
    minHeight: 100,
  },
  dividerStyle: {
    marginTop: 5,
    marginBottom: 20,
  },
  textInputStyle: {
    minHeight: 80,
    maxHeight: 125,
  },
  dropdownDayListContainer: {
    width: "80%",
    alignSelf: "center",
  },
  dropdownScrollView: {
    maxHeight: Dimensions.get("window").height / 5,
    marginBottom: 0,
  },
});
