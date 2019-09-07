import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, Text } from "react-native"

import { Snackbar } from "react-native-paper";

interface AppProps {
    snackBarIsError: boolean,
    visibility: boolean,
    toggleSnackBarVisibility: () => void,
    snackBarText: string,
}

interface AppState {

}

export default class SnackBarPopup extends Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = {
            leftOffset: (Dimensions.get("window").width - 200) / 2,
            rightOffset: (Dimensions.get("window").width - 200) / 2,
        }
    }

    componentDidUpdate = (prevProps: AppProps, prevState: AppState) => {
        if (prevProps.visibility !== this.props.visibility && prevProps.visibility === false) {
            this.setState({
                leftOffset: (Dimensions.get("window").width - 200) / 2,
                rightOffset: (Dimensions.get("window").width - 200) / 2,
            })
        }
    }

    render() {
        return (
            <View style={{...styles.container, left: this.state.leftOffset, right: this.state.rightOffset}}>
                {this.props.snackBarIsError ? 
                <Snackbar
                    visible={this.props.visibility}
                    onDismiss={() => {this.props.toggleSnackBarVisibility()}}
                    duration={2500}
                    style={{backgroundColor: "#C00000"}}
                    action={{
                        label: 'FAIL',
                        onPress: () => {
                          // Do something
                        },
                      }}>
                    <Text>{this.props.snackBarText}</Text>
                </Snackbar>
                :                 
                <Snackbar
                    visible={this.props.visibility}
                    onDismiss={() => {this.props.toggleSnackBarVisibility()}}
                    duration={2500}
                    style={{backgroundColor: "#6200ee"}}
                    action={{
                        label: 'PASS',
                        onPress: () => {
                          // Do something
                        },
                      }}>
                    <Text>{this.props.snackBarText}</Text>
                </Snackbar>
                }
          </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 150,
        width: 200
    },
});