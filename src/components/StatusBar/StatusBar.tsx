import React from 'react'

import { StatusBar as ReactNativeStatusBar, View, Platform } from "react-native"

export default function StatusBar() {

    return (
        <View>
            <ReactNativeStatusBar backgroundColor="#6200ee" barStyle={Platform.OS == "ios" ? "dark-content" : "light-content"} />
        </View>
    )
}
