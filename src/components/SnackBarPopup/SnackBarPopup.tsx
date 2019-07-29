import React from 'react'
import { View, StyleSheet, Dimensions, Text } from "react-native"

import { Snackbar } from "react-native-paper";

export default function SnackBarPopup(props) {
        return (
            <View style={styles.container}>
                {props.snackBarIsError ? 
                <Snackbar
                    visible={props.visibility}
                    onDismiss={() => {props.toggleSnackBarVisibility()}}
                    duration={3000}
                    style={{backgroundColor: "#C00000"}}>
                    {props.snackBarText}
                </Snackbar>
                :                 
                <Snackbar
                    visible={props.visibility}
                    onDismiss={() => {props.toggleSnackBarVisibility()}}
                    duration={3000}
                    style={{backgroundColor: "#4d4dff"}}>
                    {props.snackBarText}
                </Snackbar>
                }
          </View>
        )
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 200,
        left: (Dimensions.get("window").width - 200) / 2,
        right: (Dimensions.get("window").width - 200) / 2,
        width: 200
    },
});