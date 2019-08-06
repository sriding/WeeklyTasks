import React from 'react'
import { StyleSheet, View, Dimensions} from 'react-native'
import { Chip } from "react-native-paper"

const DayScreenFabButtonOptions = (props) => {
    return (
        <View style={styles.chipStyles}>
            <Chip textStyle={{fontSize: 15}} 
                style={styles.chipStyleAdd} 
                icon="create"
                mode="outlined"
                onPress={() => {
                    props.firstScrollView.current.scrollTo({x: 0,y: 0});
                    props.newTaskTextRef.current.focus();
                    props.toggleFabButtonOptions();
                }}>
                Add Task
            </Chip>
            <Chip textStyle={{fontSize: 15}} 
                style={styles.chipStyleCheck} 
                icon="check"
                mode="outlined"
                onPress={() => {
                    props.checkAllTasks()
                    props.toggleFabButtonOptions();
                }}>
                Check All
            </Chip>
            <Chip textStyle={{fontSize: 15}} 
                style={styles.chipStyleDelete} 
                icon="delete"
                mode="outlined"
                onPress={() => {
                props.deleteAllTasks();
                props.toggleFabButtonOptions();
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
        paddingLeft: 7,
        paddingRight: 7,
        backgroundColor: "#EDF0FF"
    },
    chipStyleCheck: {
        marginBottom: 15,
        paddingLeft: 7,
        paddingRight: 7,
        backgroundColor: "#EDF0FF"
    },
    chipStyleDelete: {
        marginBottom: 15,
        paddingLeft: 7,
        paddingRight: 7,
        backgroundColor: "#EDF0FF"
    },
})

export default DayScreenFabButtonOptions
