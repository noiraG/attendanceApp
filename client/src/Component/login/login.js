import React from "react";
import "./styles.scss";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import logo from "./logo/AlphaPro_logo.png";

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
              width="125px"
              height="125px"
              style={{ borderRadius: 500 }}
              alt="Cry my tear out"
            ></img>
            <div className="login-landing-msg">
              <Typography variant="h4">Log in to proceed</Typography>
            </div>
            <form onSubmit={this.handleSubmit} noValidate>
              <div className="login-form">
                <div className="login-form__header">Matriculation No.</div>
                <input
                  className="login-form__input"
                  type="text"
                  placeholder="your username"
                  name="username"
                  value={this.state.username}
                  onChange={e =>
                    this.setState({ username: e.currentTarget.value })
                  }
                />
                <div className="login-form__header">Password</div>
                <input
                  className="login-form__input"
                  type="password"
                  name="password"
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
            </form>
          </Paper>
        </div>
      </Box>
    );
  }

  onLoginClick = () => {
    const { username, password } = this.state;

    if (
      RegExp(/[A-Za-z][0-9]{7}[A-Za-z]/).test(username) ||
      RegExp(/(admin)[A-Za-z0-9]*/).test(username)
    ) {
      console.log("username is valid");
      if (password.length > 1) {
        console.log("password is valid");
        this.setState({ loadingState: true });
        fetch("http://localhost:5000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ username: username, password: password })
        })
          .then(res => res.json())
          .then(res =>
            res.status
              ? this.props.onLogin(res.message)
              : alert("Invalid Matriculation No./password is entered")
          );
        this.setState({ loadingState: false });
      } else {
        alert("Please enter a password");
      }
    } else {
      alert("Matriculation No. is not valid");
    }
  };
}
