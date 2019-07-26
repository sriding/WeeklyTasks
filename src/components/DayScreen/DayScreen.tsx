import React, { Fragment, Component } from 'react'
import { Text, SafeAreaView, View, StyleSheet, ScrollView } from "react-native";
import { Button, Card, Title, Subheading, Paragraph, Chip } from "react-native-paper";

export default class DayScreen extends Component {
    componentDidMount = () => {
        console.log("DayScreen mounted");
    }

    componentWillUnmount = () => {
        console.log("DayScreen unmounted");
    }

    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>
                <View style={styles.goBackButtonViewContainer}>
                    <Button mode="contained" color="#EDF0FF" contentStyle={styles.goBackButton} onPress={() => this.props.navigation.goBack()}>
                        Go Back
                    </Button>
                </View>
                <ScrollView contentContainerStyle={styles.cardContainerViewContainer}>
                    <Card style={styles.cardContainer}>
                        <Card.Content>
                            <Button mode="contained" style={styles.headingText}>Monday</Button>
                            <Button mode="outlined" style={styles.subHeadingText}>Tasks</Button>
                            <Paragraph style={styles.paragraphText}>Number one.
                            There will be one note available per card/per day.
                            There will be one note available per card/per day.
                            There will be one note available per card/per day.
                            There will be one note available per card/per day.
                            There will be one note available per card/per day.
                            There will be one note available per card/per day.
                            </Paragraph>
                            <View style={styles.buttonCombiner}>
                                <Button style={styles.buttonStyle} icon="check-circle">Check</Button>
                                <Button style={styles.buttonStyle} icon="highlight-off">Delete</Button>
                            </View>
                            <Paragraph style={styles.paragraphText}>Number two.
                            There will be one note available per card/per day.
                            There will be one note available per card/per day.
                            There will be one note available per card/per day.
                            There will be one note available per card/per day.
                            There will be one note available per card/per day.
                            There will be one note available per card/per day.
                            </Paragraph>
                            <View style={styles.buttonCombiner}>
                                <Button style={styles.buttonStyle} icon="check-circle">Check</Button>
                                <Button style={styles.buttonStyle} icon="highlight-off">Delete</Button>
                            </View>
                        </Card.Content>
                        <Card.Content>
                            <Button mode="outlined" style={styles.subHeadingText}>Note</Button>
                            <Paragraph style={styles.paragraphText}>There will be one note available per card/per day.
                            There will be one note available per card/per day.
                            There will be one note available per card/per day.
                            There will be one note available per card/per day.
                            There will be one note available per card/per day.
                            There will be one note available per card/per day.
                            There will be one note available per card/per day.
                            There will be one note available per card/per day.
                            There will be one note available per card/per day.
                            There will be one note available per card/per day.
                            </Paragraph>
                            <Button style={styles.buttonStyle} icon="highlight-off">Delete</Button>
                        </Card.Content>
                        <Card.Content style={styles.chipStyles}>
                            <Chip icon="done">Check All</Chip>
                            <Chip icon="not-interested">Delete All</Chip>
                        </Card.Content>
                    </Card>
                </ScrollView>
            </SafeAreaView>
        )}
    }

const styles = StyleSheet.create({
    mainContainer: {
        flexGrow: 1,
        flexWrap: "nowrap",
        backgroundColor: "#EDF0FF",
    },
    goBackButtonViewContainer: {
        maxWidth: 120, 
        marginLeft: 20, 
        marginTop: 20,
        marginBottom: 20
    },
    goBackButton: {
        maxWidth: 150,
    },
    cardContainerViewContainer: {
        flexGrow: 1,
        flexDirection: "row",
        justifyContent: "center",
        paddingBottom: 150,
    },
    cardContainer: {
        alignItems: "center",
        textAlign: "center",
        maxWidth: "85%",
        minHeight: "90%",
        marginTop: 20,
        shadowColor: "#000000",
        shadowRadius: 4,
        shadowOffset: {
          width: 0,
          height: 3
        },
    },
    buttonCombiner: {
        flexDirection: "row",
        alignContent: "center"
    },
    buttonStyle: {
        width: 100
    },
    headingText: {
        maxWidth: "100%"
    },
    subHeadingText: {
        maxWidth: 150,
        marginTop: 25,
        marginBottom: 10,
    },
    paragraphText: {
        fontSize: 20,
        marginBottom: 15,
        marginTop: 15
    },
    chipStyles: {
        flexGrow: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginTop: 50
    }
});
