//Core React and React Native modules
import React, { Component } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
  Keyboard,
  EmitterSubscription,
  TextInput,
} from "react-native";

//React Native Paper modules
import { FAB } from "react-native-paper";

//3rd Party modules
import moment from "moment";

//Interfaces
import { DayObject, AppProps, AppState } from "./Interfaces-DayScreen";

//Utilities
import theWeek from "../../utilities/theWeek";

//Functions
import { getASingleDaysData } from "../../controllers/database/Miscellaneous/GetASingleDaysData/getASingleDaysData";
import {
  checkTask,
  deleteTask,
  checkAllTasks,
  deleteAllTasks,
} from "../../controllers/database/Tasks/tasks";
import { deleteNote } from "../../controllers/database/Notes/notes";
import { getTheme } from "../../controllers/database/Settings/settings";

//Components
import Header from "../../components/Header/Header";
import SnackBarPopup from "../../components/SnackBarPopup/SnackBarPopup";
import DayScreenCard from "../../components/DayScreenCard/DayScreenCard";
import DayScreenFabButtonOptions from "../../components/DayScreenFabButtonOptions/DayScreenFabButtonOptions";

export default class DayScreen extends Component<AppProps, AppState> {
  newTaskTextRef: React.RefObject<TextInput>;
  newNoteTextRef: React.RefObject<TextInput>;
  firstScrollView: React.RefObject<ScrollView>;
  focusSubscription: any;
  keyboardDidShowListener: EmitterSubscription | null;
  keyboardDidHideListener: EmitterSubscription | null;

  constructor(props: AppProps) {
    super(props);
    this.state = {
      id: "",
      Day: null,
      fabButtonClicked: false,
      snackBarVisibility: false,
      snackBarIsError: false,
      snackBarText: "",
      keyboardHeight: 0,
      keyboardOpen: false,
      date: "",
      topOffset: Dimensions.get("window").height - 130,
      theme: "light",
    };

    this.newTaskTextRef = React.createRef();
    this.newNoteTextRef = React.createRef();
    this.firstScrollView = React.createRef();
    this.focusSubscription = null;
    this.keyboardDidShowListener = null;
    this.keyboardDidHideListener = null;
  }

  componentDidMount = async () => {
    let themeName = await getTheme();
    this.setState({
      theme: themeName,
    });

    if (Platform.OS === "ios") {
      this.setState({
        topOffset: Dimensions.get("window").height - 175,
      });
    }

    try {
      await this.getDataForASingleDay();
    } catch (err) {
      this.setSnackBarTextAndIfError(err, true);
      this.toggleSnackBarVisibility();
    }

    this.focusSubscription = this.props.navigation.addListener(
      "focus",
      async () => {
        try {
          await this.getDataForASingleDay();
        } catch (err) {
          this.setSnackBarTextAndIfError(err, true);
          this.toggleSnackBarVisibility();
        }
      }
    );

    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );

    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );
  };

  componentWillUnmount = () => {
    this.keyboardDidShowListener?.remove();
    this.keyboardDidHideListener?.remove();
    //this.focusSubscription();
  };

  componentDidUpdate = (prevProps: AppProps, prevState: AppState) => {
    if (prevState.id !== this.state.id) {
      setTimeout(() => {
        this.firstScrollView.current!.scrollTo({ x: 0, y: 0 });
      }, 300);
    }
  };

  getDataForASingleDay = async () => {
    try {
      let singleDayData = await getASingleDaysData(this.props.route.params.id);
      this.setState({
        id: this.props.route.params.id,
        Day: singleDayData,
        date: moment()
          .startOf("isoWeek")
          .add(theWeek.indexOf(this.props.route.params.id), "days")
          .format("YYYY-MM-DD"),
      });
    } catch (err) {
      this.setSnackBarTextAndIfError(err, true);
      this.toggleSnackBarVisibility();
    }
  };

  _keyboardDidShow = (event: any) => {
    if (Platform.OS === "ios") {
      this.setState({
        keyboardHeight: event.endCoordinates.height,
        keyboardOpen: true,
      });
    }
  };

  _keyboardDidHide = () => {
    if (Platform.OS === "ios") {
      this.setState({
        keyboardHeight: 0,
        keyboardOpen: false,
      });
    }
  };

  onLayout = () => {
    if (Platform.OS !== "ios") {
      if (Dimensions.get("window").height > Dimensions.get("window").width) {
        this.setState({
          topOffset: Dimensions.get("window").height - 130,
        });
      } else {
        this.setState({
          topOffset: Dimensions.get("window").height - 130,
        });
      }
    } else if (
      Dimensions.get("window").width > Dimensions.get("window").height
    ) {
      this.setState({
        topOffset: Dimensions.get("window").height - 130,
      });
    } else {
      this.setState({
        topOffset: Dimensions.get("window").height - 175,
      });
    }
  };

  submitTaskText = async (useSnackBar = true, snackBarText?: string) => {
    try {
      let singleDaysData = await getASingleDaysData(this.state.id);
      this.setState({
        Day: singleDaysData,
      });
      if (useSnackBar) {
        this.setSnackBarTextAndIfError(snackBarText!, false);
        this.toggleSnackBarVisibility();
      }
    } catch (err) {
      this.setSnackBarTextAndIfError(err, true);
      this.toggleSnackBarVisibility();
    }
  };

  //Toggles snackbar appearance
  toggleSnackBarVisibility = () => {
    this.setState({
      snackBarVisibility: !this.state.snackBarVisibility,
    });
  };

  //Sets the text to show on the snackbar and if the snackbar is an error message or not
  setSnackBarTextAndIfError = (text: string, isError: boolean) => {
    this.setState({
      snackBarText: text,
      snackBarIsError: isError,
    });
  };

  toggleFabButtonOptions = () => {
    this.setState({
      fabButtonClicked: !this.state.fabButtonClicked,
    });
  };

  checkTask = async (taskID: number, isChecked: boolean) => {
    try {
      await checkTask(taskID, isChecked);
      this.submitTaskText(false);
    } catch (err) {
      this.setSnackBarTextAndIfError(err, true);
      this.toggleSnackBarVisibility();
    }
  };

  deleteTask = async (taskID: number) => {
    try {
      await deleteTask(taskID);
      this.submitTaskText(true, "Task Deleted!");
    } catch (err) {
      this.setSnackBarTextAndIfError(err, true);
      this.toggleSnackBarVisibility();
    }
  };

  deleteNote = async (noteID: number) => {
    try {
      await deleteNote(noteID);
      this.submitTaskText(true, "Note Deleted!");
    } catch (err) {
      this.setSnackBarTextAndIfError(err, true);
      this.toggleSnackBarVisibility();
    }
  };

  checkAllTasks = async () => {
    try {
      await checkAllTasks(this.state.id);
      this.submitTaskText(false);
    } catch (err) {
      this.setSnackBarTextAndIfError(err, true);
      this.toggleSnackBarVisibility();
    }
  };

  deleteAllTasks = async () => {
    try {
      await deleteAllTasks(this.state.id);
      this.submitTaskText(true, "All Tasks Deleted!");
    } catch (err) {
      this.setSnackBarTextAndIfError(err, true);
      this.toggleSnackBarVisibility();
    }
  };

  render() {
    return (
      <SafeAreaView
        style={{
          ...styles.mainContainer,
          backgroundColor: this.state.theme === "light" ? "#EDF0FF" : "#171617",
        }}
      >
        <View onLayout={this.onLayout}>
          <Header
            title={this.state.id}
            navigation={this.props.navigation}
            back={true}
          />
          <ScrollView
            ref={this.firstScrollView}
            contentContainerStyle={styles.cardContainerViewContainer}
            showsVerticalScrollIndicator={false}
            onScrollBeginDrag={() => {
              if (this.state.fabButtonClicked) {
                this.setState({
                  fabButtonClicked: false,
                });
              }
            }}
          >
            <DayScreenCard
              Day={this.state.Day}
              checkTask={this.checkTask}
              deleteTask={this.deleteTask}
              deleteNote={this.deleteNote}
              submitTaskText={this.submitTaskText}
              id={this.state.id}
              newTaskTextRef={this.newTaskTextRef}
              newNoteTextRef={this.newNoteTextRef}
              keyboardHeight={this.state.keyboardHeight}
              keyboardOpen={this.state.keyboardOpen}
              firstScrollView={this.firstScrollView}
              theme={this.state.theme}
            />
          </ScrollView>
          <SnackBarPopup
            visibility={this.state.snackBarVisibility}
            toggleSnackBarVisibility={this.toggleSnackBarVisibility}
            snackBarIsError={this.state.snackBarIsError}
            snackBarText={this.state.snackBarText}
          />
          <FAB
            style={{
              ...styles.fabButton,
              top: this.state.topOffset,
              backgroundColor:
                this.state.theme === "light" ? "#6200ee" : "#171617",
            }}
            icon="view-list"
            onPress={() => {
              this.toggleFabButtonOptions();
            }}
          />
          {this.state.fabButtonClicked ? (
            <DayScreenFabButtonOptions
              newTaskTextRef={this.newTaskTextRef}
              checkAllTasks={this.checkAllTasks}
              deleteAllTasks={this.deleteAllTasks}
              firstScrollView={this.firstScrollView}
              toggleFabButtonOptions={this.toggleFabButtonOptions}
              topOffset={this.state.topOffset}
              theme={this.state.theme}
            />
          ) : null}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flexGrow: 1,
    flexWrap: "nowrap",
    minHeight: "100%",
  },
  goBackButtonViewContainer: {
    maxWidth: 120,
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 20,
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
  fabButton: {
    position: "absolute",
    margin: 20,
    right: 0,
    width: 55,
    color: "white",
  },
});
