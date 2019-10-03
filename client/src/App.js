import React from "react";
import NavigationBar from "./Component/navigationbar/navigateBar";
import "./App.css";
import {BrowserRouter as Router, Route, Redirect} from "react-router-dom";
import TakeAttendance from "./Component/takeAttendance/takeAttendance";
import Login from "./Component/login/login";
import { TAB_CONSTANTS } from "./constants";
import CreateClassSession from "./Component/createClassSession/createClassSession";
import AddStudent from "./Component/addStudent/addStudent";

export default class App extends React.Component {
    state = {
        authenticated: false,
        selectedTab: TAB_CONSTANTS.TAKE_ATTENDANCE,
        admin: false,
        name: "",
        referenceKey: ""
    }

    render() {
        return (
            <div className="App" height="100%">
                <Router>
                    <NavigationBar
                        selectedTab={this.state.selectedTab}
                        setTabSelected={this.setTabSelected.bind(this)}
                        authenticated={this.state.authenticated}
                        username={this.state.name}
                        admin={this.state.admin}
                    />
                    <Route path="/login" render={this.renderLogin}/>
                    <Route path="/dashboard" render={this.renderDashboard}/>
                    {this.state.authenticated ?
                        <Redirect to="/dashboard"/> : <Redirect to="/login"/>
                    }
                </Router>
            </div>
        );
    }

    onLogin = (userDetails) => {
        this.setState({
            name: userDetails.name,
            referenceKey: userDetails.key,
            admin: userDetails.admin,
            authenticated: true
        })
    }


    renderDashboard = () => {
        if (!this.state.authenticated)
            return <Redirect to="/login"/>
        switch (this.state.selectedTab) {
            case TAB_CONSTANTS.TAKE_ATTENDANCE:
                return <TakeAttendance/>
            case TAB_CONSTANTS.CREATE_SESSION:
                return <CreateClassSession/>
            case TAB_CONSTANTS.ADD_STUDENT:
                return <AddStudent/>
        }
    }

    renderLogin = () => (
        <Login onLogin={this.onLogin.bind(this)}/>
    )

    setTabSelected(tab) {
        return () => {
            this.setState({selectedTab: tab});
        }
    }
}
