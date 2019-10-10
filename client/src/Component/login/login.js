import React from "react";
import "./styles.scss";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import logo from "./logo/frogs-in-packaged-salads.jpg";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      loadingState: false
    };
    this.onLoginClick.bind(this);
  }

  render() {
    return (
      <Box height="100%" style={{ backgroundColor: "#cfe8fc" }}>
        <div className="login-container">
          <Paper style={{ padding: "50px 50px 70px 50px", marginTop: "100px" }}>
            <img
              src={logo}
              width="75px"
              height="75px"
              alt="Cry my tear out"
            ></img>
            <div className="login-landing-msg">
              <Typography variant="h4">Log in to proceed</Typography>
            </div>
            <div className="login-form">
              <div className="login-form__header">Username</div>
              <input
                className="login-form__input"
                type="text"
                placeholder="your username"
                value={this.state.username}
                onChange={e =>
                  this.setState({ username: e.currentTarget.value })
                }
              />
              <div className="login-form__header">Password</div>
              <input
                className="login-form__input"
                type="password"
                placeholder="your password"
                value={this.state.password}
                onChange={e =>
                  this.setState({ password: e.currentTarget.value })
                }
              />
              <Button
                variant="contained"
                onClick={this.onLoginClick}
                color="primary"
                style={{
                  width: "200px",
                  padding: "5px",
                  margin: "20px 0px 0px 25px"
                }}
              >
                {!this.state.loadingState ? "Login" : "Login In"}
              </Button>
            </div>
          </Paper>
        </div>
      </Box>
    );
  }

  onLoginClick = () => {
    const { username, password } = this.state;
    this.setState({ loadingState: true });
    fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username: username, password: password })
    })
      .then(res => res.json())
      .then(res => this.props.onLogin(res));
    this.setState({ loadingState: false });
  };
}
