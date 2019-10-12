import React from "react";
import NavigationBar from "./Component/navigationbar/navigateBar";
import "./App.css";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import TakeAttendance from "./Component/takeAttendance/takeAttendance";
import Login from "./Component/login/login";
import { TAB_CONSTANTS } from "./constants";
import ViewClassSession from "./Component/viewClassSession/viewClassSession";
import ViewStudent from "./Component/student/listStudent";
import ViewAttendance from "./Component/ViewAttendance/viewAttendance";

export default class App extends React.Component {
  state = {
    authenticated: false,
    selectedTab: TAB_CONSTANTS.TAKE_ATTENDANCE,
    admin: false,
    name: "",
    referenceKey: ""
  };

  render() {
    return (
      <div className="App" height="100%" style={{ minHeight: "100vh" }}>
        <Router>
          <NavigationBar
            selectedTab={this.state.selectedTab}
            setTabSelected={this.setTabSelected.bind(this)}
            authenticated={this.state.authenticated}
            username={this.state.name}
            admin={this.state.admin}
          />
          <Route path="/login" render={this.renderLogin} />
          <Route path="/dashboard" render={this.renderDashboard} />
          {this.state.authenticated ? (
            <Redirect to="/dashboard" />
          ) : (
            <Redirect to="/login" />
          )}
        </Router>
      </div>
    );
  }

  onLogin = userDetails => {
    if (userDetails.status == false) {
      this.setState({
        authenticated: false
      });
    } else if (userDetails.name != null) {
      console.log(userDetails);
      this.setState({
        name: userDetails.name,
        referenceKey: userDetails.referenceKey,
        admin: userDetails.admin,
        authenticated: true
      });
    } else {
      this.setState({
        authenticated: false
      });
    }
  };

  renderDashboard = () => {
    if (!this.state.authenticated) return <Redirect to="/login" />;
    switch (this.state.selectedTab) {
      case TAB_CONSTANTS.TAKE_ATTENDANCE:
        return (
          <TakeAttendance
            matriculationNo={this.state.referenceKey}
            admin={this.state.admin}
          />
        );
      case TAB_CONSTANTS.VIEW_ATTENDANCE:
        return (
          <ViewAttendance
            matriculationNo={this.state.referenceKey}
            admin={this.state.admin}
          />
        );
      case TAB_CONSTANTS.VIEW_SESSION:
        return <ViewClassSession />;
      case TAB_CONSTANTS.VIEW_STUDENT:
        return <ViewStudent />;
    }
  };

  renderLogin = () => <Login onLogin={this.onLogin.bind(this)} />;

  setTabSelected(tab) {
    return () => {
      this.setState({ selectedTab: tab });
    };
  }
}
