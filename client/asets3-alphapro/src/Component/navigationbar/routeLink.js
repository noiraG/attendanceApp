import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import {
  Route,
  Link,
  BrowserRouter as Router,
  Redirect
} from "react-router-dom";
import App from "../../App";
import takeAttendance from "../takeAttendance/takeAttendance";
import listStudent from "../student/listStudent";

{
  /* Add all the link to each page here */
}
class RouteLink extends React.Component {
  render() {
    return (
      <Router>
        <List component="div" disablePadding>
          <ListItem button>
            <Link to="/home/attendance">Take Attendance</Link>
          </ListItem>
          <ListItem button>
            <Link to="/home/student">View Student</Link>
          </ListItem>
        </List>
        <Route exact path="/home" component={App} />
        <Route exact path="/home/attendance" component={takeAttendance} />
        <Route exact path="/home/student" component={listStudent} />
        <Redirect exact from="/" to={App} />
      </Router>
    );
  }
}
export default RouteLink;
