import React from 'react'

import { StatusBar as ReactNativeStatusBar, View, Platform } from "react-native"

interface AppProps {
    theme: string
}

export default function StatusBar(props: AppProps) {
    return (
        <View>
            {props.theme === "light" ? 
            <ReactNativeStatusBar backgroundColor="#6200ee" barStyle={Platform.OS == "ios" ? "dark-content" : "light-content"} />
            : <ReactNativeStatusBar backgroundColor="#171617" barStyle="light-content" />
            }
        </View>
    )
}
