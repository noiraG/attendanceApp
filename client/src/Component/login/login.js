import React from "react";
import "./styles.scss";
import Box from "@material-ui/core/Box";

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
          <div className="login-landing-msg">Log in to proceed</div>
          <div className="login-form">
            <div className="login-form__header">Username</div>
            <input
              className="login-form__input"
              type="text"
              placeholder="your username"
              value={this.state.username}
              onChange={e => this.setState({ username: e.currentTarget.value })}
            />
            <div className="login-form__header">Password</div>
            <input
              className="login-form__input"
              type="password"
              placeholder="your password"
              value={this.state.password}
              onChange={e => this.setState({ password: e.currentTarget.value })}
            />
            <div className="login-form__btn" onClick={this.onLoginClick}>
              {!this.state.loadingState ? "Log In" : "Log In In"}
            </div>
          </div>
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
