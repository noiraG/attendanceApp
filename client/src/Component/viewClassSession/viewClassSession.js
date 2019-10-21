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
import EditIcon from "@material-ui/icons/Edit";

export default class ViewClassSession extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classSession: [],
      addState: false,
      editState: false,
      viewState: true,
      startingTime: null,
      endingTime: null,
      classIndex: null,
      courseIndex: null,
      courseName: null,
      date: null,
      supervisor: null,
      key: null
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
                      <TableRow key={record.key} style={{ maxHeight: "50px" }}>
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
                            style={{
                              padding: "5px",
                              backgroundColor: "#42f557",
                              maxHeight: "40px",
                              maxWidth: "40px",
                              marginRight: "15px"
                            }}
                            aria-label="edit"
                            onClick={this.editButton.bind(this, record)}
                          >
                            <EditIcon />
                          </Fab>
                          <Fab
                            style={{
                              padding: "5px",
                              backgroundColor: "#f54242",
                              maxHeight: "40px",
                              maxWidth: "40px"
                            }}
                            aria-label="delete"
                            onClick={this.delButton.bind(this, record.key)}
                          >
                            <DeleteIcon style={{ color: "#000000" }} />
                          </Fab>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>
          ) : null}
          {this.state.editState ? (
            <UpdateClassSession
              classIndex={this.state.classIndex}
              courseIndex={this.state.courseIndex}
              courseName={this.state.courseName}
              endingTime={this.state.endingTime}
              startingTime={this.state.startingTime}
              supervisor={this.state.supervisor}
              date={this.state.date}
              key={this.state.key}
            />
          ) : null}
        </div>
      </Box>
    );
  }

  editButton = record => {
    console.log("record: ", record);
    this.setState({
      addState: false,
      editState: true,
      viewState: false,
      classIndex: record.value.classIndex,
      courseIndex: record.value.courseIndex,
      courseName: record.value.courseName,
      endingTime: record.value.endingTime,
      startingTime: record.value.startingTime,
      supervisor: record.value.supervisor,
      date: record.value.date,
      key: record.key
    });
    console.log("edit button clicked: ", this.state.editState);
  };

  addButton = () => {
    this.setState({
      addState: true,
      editState: false,
      viewState: false
    });
    console.log("add button clicked: ", this.state.addState);
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
    }).then(res => {
      res
        ? alert("Class Session deleted successfully")
        : alert("Class Session is not deleted successfully");
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
