import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Caption } from "react-native-paper";
import { AppProps } from "./ResetApplicationButton.interface";

export default function ResetApplicationButton(props: AppProps) {
  return (
    <View style={styles.containerStyle}>
      <Button
        icon="alert-circle"
        mode="contained"
        onPress={() => props.toggleTextDialog()}
        uppercase={true}
        color="red"
        labelStyle={styles.buttonStyleText}
        style={styles.buttonStyle}
      >
        RESET APPLICATION
      </Button>
      <Caption>App will be reset to default.</Caption>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    alignItems: "center",
  },
  buttonStyle: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 15,
    width: "90%",
  },
  buttonStyleText: {
    fontSize: 20,
  },
});
