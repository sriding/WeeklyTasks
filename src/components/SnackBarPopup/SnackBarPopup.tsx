import React from 'react'
import { View, StyleSheet, Dimensions, Text } from "react-native"

import { Snackbar } from "react-native-paper";

interface AppProps {
    snackBarIsError: boolean,
    visibility: boolean,
    toggleSnackBarVisibility: () => void,
    snackBarText: string,

}

export default function SnackBarPopup(props: AppProps) {
        return (
            <View style={styles.container}>
                {props.snackBarIsError ? 
                <Snackbar
                    visible={props.visibility}
                    onDismiss={() => {props.toggleSnackBarVisibility()}}
                    duration={2500}
                    style={{backgroundColor: "#C00000"}}>
                    <Text style={{textAlign: "center"}}>{props.snackBarText}</Text>
                </Snackbar>
                :                 
                <Snackbar
                    visible={props.visibility}
                    onDismiss={() => {props.toggleSnackBarVisibility()}}
                    duration={2500}
                    style={{backgroundColor: "#4d4dff"}}>
                    <Text style={{textAlign: "center"}}>{props.snackBarText}</Text>
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