import React from "react";
import "./styles.scss";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import CreateClassSession from "../createClassSession/createClassSession";
import DeleteIcon from "@material-ui/icons/Delete";
import Fab from "@material-ui/core/Fab";

export default class viewClassSession extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classSession: [],
      addState: false
    };
    this.addButton = this.addButton.bind(this);
  }

  componentDidMount() {
    this.retrieveList();
  }

  render() {
    return (
      <div className="attendance-container">
        {this.state.addState ? (
          <CreateClassSession />
        ) : (
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Class Session</TableCell>
                  <TableCell align="right"></TableCell>
                  <TableCell align="right"></TableCell>
                  <TableCell align="right"></TableCell>
                  <TableCell align="right"></TableCell>
                  <TableCell align="right"></TableCell>
                  <TableCell align="right"></TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.addButton}
                    >
                      Add Class Session
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Course Index</TableCell>
                  <TableCell align="right">Class index</TableCell>
                  <TableCell align="right">Course Name</TableCell>
                  <TableCell align="right">Date</TableCell>
                  <TableCell align="right">Starting Time</TableCell>
                  <TableCell align="right">Ending Time</TableCell>
                  <TableCell align="right">Supervisor</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.classSession.reverse().map(record => {
                  return (
                    <TableRow key={record.key}>
                      <TableCell component="th" scope="row">
                        {record.value.courseIndex}
                      </TableCell>
                      <TableCell align="right">
                        {record.value.classIndex}
                      </TableCell>
                      <TableCell align="right">
                        {record.value.courseName}
                      </TableCell>
                      <TableCell align="right">{record.value.date}</TableCell>
                      <TableCell align="right">
                        {record.value.startingTime}
                      </TableCell>
                      <TableCell align="right">
                        {record.value.endingTime}
                      </TableCell>
                      <TableCell align="right">
                        {record.value.supervisor}
                      </TableCell>
                      <TableCell align="center">
                        <Fab aria-label="delete">
                          <DeleteIcon />
                        </Fab>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        )}
      </div>
    );
  }

  addButton = () => {
    console.log(this.state.addState);
    this.setState({
      addState: true
    });
    console.log(this.state.addState);
  };

  // delButton(referenceKey) {
  //   console.log(referenceKey);
  // fetch("http://localhost:5000/api/class/delete", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json"
  //   },
  //   body: JSON.stringify({
  //     referenceKey: "" + referenceKey
  //   })
  // });
  //  }

  async retrieveList() {
    fetch("http://localhost:5000/api/class")
      .then(res => res.json())
      .then(res => {
        this.setState({
          classSession: res
        });
      });
  }
}
