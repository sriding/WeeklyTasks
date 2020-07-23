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
} from "react-native";
import { FAB } from "react-native-paper";
import theWeek from "../../utilities/theWeek";

import { getASingleDaysData } from "../../controllers/database/Miscellaneous/GetASingleDaysData/getASingleDaysData";
import {
  checkTask,
  deleteTask,
  checkAllTasks,
  deleteAllTasks,
} from "../../controllers/database/Tasks/tasks";
import { deleteNote } from "../../controllers/database/Notes/notes";
import { getTheme } from "../../controllers/database/Settings/settings";

import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from "react-navigation";

//Components
import Header from "./../Header/Header";
import SnackBarPopup from "./../SnackBarPopup/SnackBarPopup";
import DayScreenCard from "./../DayScreenCard/DayScreenCard";
import DayScreenFabButtonOptions from "./../DayScreenFabButtonOptions/DayScreenFabButtonOptions";

import moment from "moment";

interface DayObject {
  id: string;
  tasks: { id: number; day: string; text: string; isChecked: boolean }[];
  note: {
    id: number;
    text: string;
  };
}
interface AppProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface AppState {
  id: string;
  Day: DayObject;
  fabButtonClicked: boolean;
  snackBarVisibility: boolean;
  snackBarIsError: boolean;
  snackBarText: string;
  keyboardHeight: number;
  keyboardOpen: boolean;
  date: string;
  topOffset: number;
  theme: string;
}

export default class DayScreen extends Component<AppProps, AppState> {
  protected newTaskTextRef: React.RefObject<TextInput>;
  protected newNoteTextRef: React.RefObject<TextInput>;
  protected firstScrollView: React.RefObject<ScrollView>;
  public keyboardDidShowListener!: EmitterSubscription;
  public keyboardDidHideListener!: EmitterSubscription;
  public didFocusSubscription: any;

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
  }

  componentDidMount = () => {
    getTheme().then((mark) => {
      this.setState({
        theme: mark,
      });
    });

    if (Platform.OS === "ios") {
      this.setState({
        topOffset: Dimensions.get("window").height - 175,
      });
    }
    this.didFocusSubscription = this.props.navigation.addListener(
      "focus",
      () => {
        getASingleDaysData(this.props.route.params.id)
          .then((data: DayObject) => {
            this.setState({
              id: this.props.route.params.id,
              Day: data,
              date: moment()
                .startOf("isoWeek")
                .add(theWeek.indexOf(this.props.route.params.id), "days")
                .format("YYYY-MM-DD"),
            });
          })
          .catch((error: string) => {
            this.setSnackBarTextAndIfError(error, true);
            this.toggleSnackBarVisibility();
          });
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
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    this.didFocusSubscription();
  };

  componentDidUpdate = (prevProps: AppProps, prevState: AppState) => {
    if (prevState.id !== this.state.id) {
      setTimeout(() => {
        this.firstScrollView.current!.scrollTo({ x: 0, y: 0 });
      }, 300);
    }
  };

  _keyboardDidShow = (event: any) => {
    if (Platform.OS == "ios") {
      this.setState({
        keyboardHeight: event.endCoordinates.height,
        keyboardOpen: true,
      });
    }
  };

  _keyboardDidHide = () => {
    if (Platform.OS == "ios") {
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

  submitTaskText = (useSnackBar = true, snackBarText?: string) => {
    getASingleDaysData(this.state.id)
      .then((data: DayObject) => {
        this.setState({
          Day: data,
        });
        if (useSnackBar) {
          this.setSnackBarTextAndIfError(snackBarText!, false);
          this.toggleSnackBarVisibility();
        }
      })
      .catch((error: string) => {
        this.setSnackBarTextAndIfError(error, true);
        this.toggleSnackBarVisibility();
      });
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

  checkTask = (taskID: number, isChecked: boolean) => {
    checkTask(taskID, isChecked)
      .then(() => {
        this.submitTaskText(false);
      })
      .catch((error: string) => {
        this.setSnackBarTextAndIfError(error, true);
        this.toggleSnackBarVisibility();
      });
  };

  deleteTask = (taskID: number) => {
    deleteTask(taskID)
      .then(() => {
        this.submitTaskText(true, "Task Deleted!");
      })
      .catch((error: string) => {
        this.setSnackBarTextAndIfError(error, true);
        this.toggleSnackBarVisibility();
      });
  };

  deleteNote = (noteID: number) => {
    deleteNote(noteID)
      .then(() => {
        this.submitTaskText(true, "Note Deleted!");
      })
      .catch((error: string) => {
        this.setSnackBarTextAndIfError(error, true);
        this.toggleSnackBarVisibility();
      });
  };

  checkAllTasks = () => {
    checkAllTasks(this.state.id)
      .then(() => {
        this.submitTaskText(false);
      })
      .catch((error: string) => {
        this.setSnackBarTextAndIfError(error, true);
        this.toggleSnackBarVisibility();
      });
  };

  deleteAllTasks = () => {
    deleteAllTasks(this.state.id)
      .then(() => {
        this.submitTaskText(true, "All Tasks Deleted!");
      })
      .catch((error: string) => {
        this.setSnackBarTextAndIfError(error, true);
        this.toggleSnackBarVisibility();
      });
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
