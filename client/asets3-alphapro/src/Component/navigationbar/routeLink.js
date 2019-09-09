import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
{
  /* Add all the link to each page here */
}

class RouteLink extends React.Component {
  render() {
    return (
      <div>
        <List component="div">
          <ListItem button>Take Attendance</ListItem>
          <ListItem button>View Student</ListItem>
        </List>
      </div>
    );
  }
}
export default RouteLink;
