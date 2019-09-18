import React from "react";
import NavigationBar from "./Component/navigationbar/navigateBar";
import "./App.css";
// import {BrowserRouter as Router, Route, Redirect} from "react-router-dom";
import TakeAttendance from "./Component/takeAttendance/takeAttendance";

export default class App extends React.Component {
    state = {
        takeAttendanceView: true
    }

    render() {
        return (
            <div className="App" height="100%">
                <NavigationBar takeAttendanceView={this.state.takeAttendanceView}
                               setTakeViewState={this.setTakeViewState.bind(this)}/>
                {this.state.takeAttendanceView && <TakeAttendance/>}
            </div>
        );
    }

    setTakeViewState(active) {
        return () => {
            this.setState({takeAttendanceView: active});
        }
    }
}
