import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Grid from "@material-ui/core/Grid";
import RouteLink from "./routeLink";
class NavigationBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibility: true,
      selectedFile: null
    };
  }
  handleClick() {
    if (this.state.visibility.valueOf(true)) {
      this.setState({
        visibility: false
      });
    } else {
      this.setState({
        visibility: true
      });
    }
  }

  render() {
    return (
      <div>
        <AppBar position="static">
          <Toolbar variant="dense">
            <Grid item xs="auto">
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={this.handleClick.bind(this)}
              >
                {this.state.visibility ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Grid>
            <Grid item xs="auto">
              <Typography variant="h6" color="inherit">
                AlphaPro
              </Typography>
            </Grid>
          </Toolbar>
        </AppBar>
        <Grid item xs={2}>
          <Collapse in={this.state.visibility} timeout="auto" unmountOnExit>
            <RouteLink />
          </Collapse>
        </Grid>
      </div>
    );
  }
}
export default NavigationBar;
