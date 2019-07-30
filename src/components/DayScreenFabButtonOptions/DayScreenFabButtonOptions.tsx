import React from 'react'
import { StyleSheet, View, Dimensions} from 'react-native'
import { Chip } from "react-native-paper"

const DayScreenFabButtonOptions = (props) => {
    return (
        <View style={styles.chipStyles}>
            <Chip textStyle={{color: "white", fontSize: 15}} 
                style={styles.chipStyleAdd} 
                onPress={() => {
                    props.firstScrollView.current.scrollTo({x: 0,y: 0});
                    props.newTaskTextRef.current.focus();
                    props.toggleFabButtonOptions();
                }}>
                Add Task
            </Chip>
            <Chip textStyle={{color: "white", fontSize: 15}} 
                style={styles.chipStyleCheck} 
                onPress={() => {
                    props.checkAllTasks(props.Day.tasks)
                }}>
                Check All
            </Chip>
            <Chip textStyle={{color: "white", fontSize: 15}} 
                style={styles.chipStyleDelete} 
                onPress={() => {
                props.deleteAllTasks(props.Day.tasks)
            }}>Delete All</Chip>
        </View>
    )
}

const styles = StyleSheet.create({
    chipStyles: {
        position: "absolute",
        top: Dimensions.get("window").height - 230,
        right: 70,
        zIndex: 2
    },
    chipStyleAdd: {
        marginBottom: 15,
        backgroundColor: "#000",
        paddingLeft: 6,
        paddingRight: 6,
    },
    chipStyleCheck: {
        marginBottom: 15,
        backgroundColor: "#4d4dff",
        paddingLeft: 6,
        paddingRight: 6,
    },
    chipStyleDelete: {
        marginBottom: 15,
        backgroundColor: "#C00000",
        paddingLeft: 6,
        paddingRight: 6,
    },
})

export default DayScreenFabButtonOptions
