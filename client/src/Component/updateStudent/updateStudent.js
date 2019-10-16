import React from "react";
import "./styles.scss";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

export default class UpdateStudent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matriculationNo: props.matriculationNo,
      username: props.username,
      name: props.name,
      password: props.password
    };
  }

  render() {
    const { matriculationNo, username, name, password } = this.state;
    return (
      <div>
        <div className="class-form-wrapper3">
          <Paper
            style={{
              margin: "150px 0 0 535px",
              padding: "35px 0px 50px 55px",
              width: "350px",
              height: "230px"
            }}
          >
            <div className="class-form3">
              <div className="class-form3__field">
                <div className="class-form3__header">matriculation No.</div>
                <input
                  className="class-form3__input"
                  disabled
                  type="text"
                  value={matriculationNo}
                  onChange={e =>
                    this.setState({ matriculationNo: e.currentTarget.value })
                  }
                />
              </div>
              <div className="class-form3__field">
                <div className="class-form3__header">name</div>
                <input
                  className="class-form3__input"
                  type="text"
                  value={name}
                  onChange={e => this.setState({ name: e.currentTarget.value })}
                />
              </div>
              <div className="class-form3__field">
                <div className="class-form3__header">password</div>
                <input
                  className="class-form3__input"
                  type="text"
                  value={password}
                  onChange={e =>
                    this.setState({ password: e.currentTarget.value })
                  }
                />
              </div>
              <Button
                variant="contained"
                className="class-form3__btn"
                color="primary"
                onClick={this.onEditClick}
                style={{ margin: "10px 0 0 0px" }}
              >
                Update
              </Button>
            </div>
          </Paper>
        </div>
      </div>
    );
  }

  onEditClick = () => {
    const { matriculationNo, username, name, password } = this.state;

    if (name.length > 0) {
      if (password.length > 0) {
        fetch("http://localhost:5000/api/student/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            matriculationNo: matriculationNo,
            username: username,
            name: name,
            password: password
          })
        })
          .then(res => res.json())
          .then(res =>
            res ? alert("class has been updated") : alert("Class update failed")
          );
      } else {
        alert("Please enter a valid password");
      }
    } else {
      alert("Please enter a valid name.");
    }
  };
}
