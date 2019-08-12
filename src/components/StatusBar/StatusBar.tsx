import React from 'react'

import { StatusBar as ReactNativeStatusBar, View, Platform } from "react-native"

export default function StatusBar() {

    return (
        <View>
            <ReactNativeStatusBar backgroundColor="#EDF0FF" barStyle="dark-content" />
        </View>
    )
}
