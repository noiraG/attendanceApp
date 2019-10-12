import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Fab from "@material-ui/core/Fab";
import DeleteIcon from "@material-ui/icons/Delete";
import Box from "@material-ui/core/Box";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import AddStudent from "../addStudent/addStudent";
import UpdateStudent from "../updateStudent/updateStudent";

class ViewStudent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibility: false,
      addState: false,
      editState: false,
      viewState: true,
      student: [],
      username: null,
      name: null,
      password: null,
      matriculationNo: null
    };
  }

  componentDidMount() {
    this.retrieveStudent();
  }

  render() {
    return (
      <Box
        height="100%"
        style={{
          backgroundColor: "#cfe8fc",
          width: "100%"
        }}
      >
        {this.state.addState ? <AddStudent /> : null}
        {this.state.viewState ? (
          <div
            style={{
              padding: "155px 0 0 0",
              width: "680px",
              margin: "0 0 0 405px"
            }}
          >
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Matriculation No.</TableCell>
                    <TableCell colSpan="3" align="right">
                      Name
                    </TableCell>
                    <TableCell colSpan="3" align="right">
                      Username
                    </TableCell>
                    <TableCell colSpan="3" align="right"></TableCell>
                    <TableCell colSpan="3" align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ maxWidth: "120px" }}
                        onClick={this.addButton}
                      >
                        Add Student
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.student.map(row => (
                    <TableRow key={row.key} style={{ height: "74px" }}>
                      <TableCell component="th" scope="row">
                        {row.key}
                      </TableCell>
                      <TableCell colSpan="3" align="right">
                        {row.value.name}
                      </TableCell>
                      <TableCell colSpan="3" align="right">
                        {row.value.username}
                      </TableCell>
                      <TableCell colSpan="3" align="right"></TableCell>
                      <TableCell colSpan="3" align="center">
                        <Fab
                          aria-label="edit"
                          style={{
                            maxHeight: "40px",
                            maxWidth: "40px",
                            marginRight: "10px",
                            padding: "5px",
                            backgroundColor: "#42f557"
                          }}
                          onClick={this.editButton.bind(this, row)}
                        >
                          <EditIcon />
                        </Fab>
                        <Fab
                          aria-label="delete"
                          style={{ maxHeight: "40px", maxWidth: "40px" }}
                        >
                          <DeleteIcon />
                        </Fab>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </div>
        ) : null}
        {this.state.editState ? (
          <UpdateStudent
            matriculationNo={this.state.matriculationNo}
            username={this.state.username}
            name={this.state.name}
            password={this.state.password}
          />
        ) : null}
      </Box>
    );
  }

  editButton = record => {
    this.setState({
      addState: false,
      editState: true,
      viewState: false,
      matriculationNo: record.key,
      username: record.value.username,
      name: record.value.name,
      password: record.value.password
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

  async retrieveStudent() {
    fetch("http://localhost:5000/api/student")
      .then(res => res.json())
      .then(res => this.setState({ student: res }));
  }
}

export default ViewStudent;
