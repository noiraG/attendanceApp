import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import{ withRouter } from "react-router-dom";
{
  /* Add all the link to each page here */
}

class RouteLink extends React.Component {
  render() {
    return (
      <div>
        <List component="div">
          <ListItem button onClick={()=>{this.props.history.push("/attendance")}}>Take Attendance</ListItem>
          <ListItem button>View Student</ListItem>
        </List>
      </div>
    );
  }
}
export default withRouter(RouteLink);
