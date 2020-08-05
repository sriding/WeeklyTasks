import React, { Fragment } from "react";

import {
  ScrollView,
  Dimensions,
  Platform,
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

export default function NewTaskDialog(props: AppProps) {
  return (
    <Portal>
      <Dialog
        visible={props.dialogToggle}
        onDismiss={props.dismissDialogToggle}
        style={{
          ...styles.mainDialogContainer,
          maxHeight: !props.keyboardOpen
            ? Dimensions.get("window").height
            : Dimensions.get("window").height - props.keyboardHeight - 50,
          marginBottom: !props.keyboardOpen ? 0 : props.keyboardHeight,
          borderColor: "white",
          backgroundColor: props.theme === "light" ? "white" : "#181818",
        }}
      >
        <Pressable
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          {props.keyboardHeight > 0 ? null : (
            <Fragment>
              <Dialog.Title style={{ marginBottom: 0 }}>Task</Dialog.Title>
              <Divider
                style={{
                  marginTop: 5,
                  marginBottom: 20,
                  backgroundColor: props.theme === "light" ? "silver" : "white",
                }}
              />
            </Fragment>
          )}
          <SetReminder
            reminder={props.reminder}
            reminderTime={props.reminderTime}
            changeReminderTime={props.changeReminderTime}
            theme={props.theme}
            text="Set Reminder Time: "
          />
          <Dialog.Content style={{ marginTop: 3 }}>
            <TextInput
              mode="outlined"
              multiline={true}
              numberOfLines={3}
              placeholder="Input"
              placeholderTextColor="gray"
              error={props.taskInputError}
              style={{
                minHeight: 80,
                maxHeight: 125,
              }}
              onChangeText={props.taskInputChange}
              value={props.taskInput}
              selectionColor={props.theme === "light" ? "black" : "white"}
              ref={props.textInputRef}
            />
            {props.taskInputError
              ? props.taskInputErrorText.map((errors, index) => {
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
                })
              : null}
          </Dialog.Content>
          {Platform.OS == "ios" &&
          Dimensions.get("window").width > Dimensions.get("window").height &&
          props.keyboardHeight > 0 ? null : (
            <Dialog.Content>
              <List.Accordion
                title={props.dayOfTheWeek}
                expanded={props.dialogListToggle}
                onPress={() => {
                  props.toggleDialogList();
                  props.textInputRef.current!.blur();
                }}
                style={{
                  width: "80%",
                  alignSelf: "center",
                }}
                theme={
                  props.theme === "light"
                    ? {}
                    : { colors: { text: "white", primary: "white" } }
                }
              >
                <Dialog.ScrollArea
                  style={{
                    marginBottom: 0,
                  }}
                >
                  <ScrollView
                    style={{
                      maxHeight: Dimensions.get("window").height / 5,
                      marginBottom: 0,
                    }}
                  >
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
          {Platform.OS === "ios" &&
          Dimensions.get("window").width > Dimensions.get("window").height &&
          props.keyboardHeight > 0 ? null : (
            <Dialog.Actions style={{ marginTop: 0 }}>
              <Button
                onPress={props.dismissDialogToggle}
                color={props.theme === "light" ? "#6200ee" : "white"}
              >
                Cancel
              </Button>
              <Button
                onPress={async () => await props.creatingTask()}
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
    elevation: 10,
    borderWidth: 1,
  },
});
