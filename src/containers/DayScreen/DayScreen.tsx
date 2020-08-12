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
import { AppProps, AppState } from "./DayScreen.interface";

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
    this.firstScrollView = React.createRef();

    this.focusSubscription = null;
    this.keyboardDidShowListener = null;
    this.keyboardDidHideListener = null;
  }

  componentDidMount = async () => {
    try {
      let themeName = await getTheme();
      if (typeof themeName !== "string") {
        throw themeName;
      }
      this.setState({
        theme: themeName,
      });
    } catch (err) {
      this.setSnackBarTextAndIfError(
        "Failed to set theme. Switching to default.",
        true
      );
      this.toggleSnackBarVisibility();
      this.setState({
        theme: "light",
      });
    }

    if (Platform.OS === "ios") {
      this.setState({
        topOffset: Dimensions.get("window").height - 175,
      });
    }

    try {
      let expectVoid = await this.getDataForASingleDay();
      if (expectVoid !== undefined && expectVoid !== null) {
        throw expectVoid;
      }
    } catch (err) {
      this.setSnackBarTextAndIfError(err, true);
      this.toggleSnackBarVisibility();
    }

    this.focusSubscription = this.props.navigation.addListener(
      "focus",
      async () => {
        try {
          let expectVoid = await this.getDataForASingleDay();
          if (expectVoid !== undefined && expectVoid !== null) {
            throw expectVoid;
          }
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
    this.focusSubscription();
  };

  componentDidUpdate = (prevProps: AppProps, prevState: AppState) => {
    if (prevProps.route.params?.id !== this.props.route.params?.id) {
      this.getDataForASingleDay();
    }

    if (prevState.id !== this.state.id) {
      setTimeout(() => {
        this.firstScrollView.current!.scrollTo({ x: 0, y: 0 });
      }, 300);
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

  getDataForASingleDay = async (): Promise<void> => {
    try {
      let singleDayData: any = await getASingleDaysData(
        this.props.route.params?.id
      );
      this.setState({
        id: this.props.route.params?.id,
        Day: singleDayData,
        date: moment()
          .startOf("isoWeek")
          .add(theWeek.indexOf(this.props.route.params?.id), "days")
          .format("YYYY-MM-DD"),
      });
    } catch (err) {
      return err;
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

  submitTaskText = async (
    useSnackBar = true,
    snackBarText?: string
  ): Promise<void> => {
    try {
      let singleDaysData: any = await getASingleDaysData(this.state.id);
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
  toggleSnackBarVisibility = (): void => {
    this.setState({
      snackBarVisibility: !this.state.snackBarVisibility,
    });
  };

  //Sets the text to show on the snackbar and if the snackbar is an error message or not
  setSnackBarTextAndIfError = (text: string, isError: boolean): void => {
    this.setState({
      snackBarText: text,
      snackBarIsError: isError,
    });
  };

  toggleFabButtonOptions = (): void => {
    this.setState({
      fabButtonClicked: !this.state.fabButtonClicked,
    });
  };

  checkTask = async (taskID: number, isChecked: boolean): Promise<void> => {
    try {
      let expectVoid: void = await checkTask(taskID, isChecked);
      if (expectVoid !== undefined && expectVoid !== null) {
        throw expectVoid;
      }
      this.submitTaskText(false);
    } catch (err) {
      this.setSnackBarTextAndIfError(err, true);
      this.toggleSnackBarVisibility();
    }
  };

  deleteTask = async (taskID: number): Promise<void> => {
    try {
      let expectVoid: void = await deleteTask(taskID);
      if (expectVoid !== undefined && expectVoid !== null) {
        throw expectVoid;
      }
      await this.submitTaskText(true, "Task Deleted!");
    } catch (err) {
      this.setSnackBarTextAndIfError("Error deleting the task.", true);
      this.toggleSnackBarVisibility();
    }
  };

  deleteNote = async (noteID: number): Promise<void> => {
    try {
      let expectVoid: void = await deleteNote(noteID);
      if (expectVoid !== undefined && expectVoid !== null) {
        throw expectVoid;
      }
      this.submitTaskText(true, "Note Deleted!");
    } catch (err) {
      this.setSnackBarTextAndIfError("Error deleting the note.", true);
      this.toggleSnackBarVisibility();
    }
  };

  checkAllTasks = async (): Promise<void> => {
    try {
      let expectVoid: void = await checkAllTasks(this.state.id);
      if (expectVoid !== undefined && expectVoid !== null) {
        throw expectVoid;
      }
      this.submitTaskText(false);
    } catch (err) {
      this.setSnackBarTextAndIfError("Error checking all tasks.", true);
      this.toggleSnackBarVisibility();
    }
  };

  deleteAllTasks = async (): Promise<void> => {
    try {
      let expectVoid: void = await deleteAllTasks(this.state.id);
      if (expectVoid !== undefined && expectVoid !== null) {
        throw expectVoid;
      }
      this.submitTaskText(true, "All Tasks Deleted!");
    } catch (err) {
      this.setSnackBarTextAndIfError("Error deleting all tasks.", true);
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
        <Header
          title={this.state.id}
          navigation={this.props.navigation}
          back={true}
          screen="Day"
        />
        <View
          style={{ maxWidth: 800, alignSelf: "center" }}
          onLayout={this.onLayout}
        >
          <ScrollView
            ref={this.firstScrollView}
            contentContainerStyle={styles.cardContainerViewContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
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
              backgroundColor:
                this.state.theme === "light" ? "#6200ee" : "#c2c2f0",
            }}
            color={this.state.theme === "light" ? "white" : "black"}
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
    margin: 10,
    right: 0,
    bottom: 130,
    color: "white",
  },
});
