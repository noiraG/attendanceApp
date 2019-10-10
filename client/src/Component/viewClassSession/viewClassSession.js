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
import UpdateClassSession from "../updateClassSession/updateClassSession";
import DeleteIcon from "@material-ui/icons/Delete";
import Fab from "@material-ui/core/Fab";
import Box from "@material-ui/core/Box";

export default class viewClassSession extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classSession: [],
      addState: false,
      editState: false,
      viewState: true
    };
    this.addButton = this.addButton.bind(this);
  }

  componentDidMount() {
    this.retrieveList();
  }

  render() {
    return (
      <Box height="100%" style={{ backgroundColor: "#cfe8fc" }}>
        <div className="attendance-container">
          {this.state.addState ? <CreateClassSession /> : null}
          {this.state.viewState ? (
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
                          <Fab
                            aria-label="delete"
                            onClick={this.delButton.bind(this, record.key)}
                          >
                            <DeleteIcon />
                          </Fab>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>
          ) : null}
          {this.state.editState ? <UpdateClassSession /> : null}
        </div>
      </Box>
    );
  }

  addButton = () => {
    console.log(this.state.addState);
    this.setState({
      addState: true
    });
    console.log(this.state.addState);
  };

  async delButton(reference) {
    console.log(reference);
    await fetch("http://localhost:5000/api/class/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        referenceKey: reference
      })
    });
    this.retrieveList();
  }

  async retrieveList() {
    let response = await fetch("http://localhost:5000/api/class");

    let json = await response.json();

    this.setState({
      classSession: json
    });
  }
}
