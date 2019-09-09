import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import MenuIcon from "@material-ui/icons/Menu";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import RouteLink from "./routeLink";

class NavigationBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibility: true
    };
  }

  classes = makeStyles(theme => ({
    root: {
      flexGrow: 1
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1
    }
  }));

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
      <div className={this.classes.root}>
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignitem="flex-start"
        >
          <Grid item>
            <AppBar position="static">
              <Toolbar>
                <Grid item>
                  <IconButton
                    edge="start"
                    className={this.classes.menuButton}
                    color="inherit"
                    aria-label="menu"
                    onClick={this.handleClick.bind(this)}
                  >
                    <MenuIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={11}>
                  <Typography variant="h6" className={this.classes.title}>
                    AlphaPro
                  </Typography>
                </Grid>
                <Grid item>
                  <Button color="inherit">Login</Button>
                </Grid>
              </Toolbar>
            </AppBar>
          </Grid>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignitems="flex-start"
          >
            <Grid item xs={2}>
              {this.state.visibility ? <RouteLink /> : null}
            </Grid>
            <Grid item xs={10}>
              <Grid container alignitem="flex-start">
                <p>test</p>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}
export default NavigationBar;
