import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Fab from "@material-ui/core/Fab";
import DeleteIcon from "@material-ui/icons/Delete";
class listStudent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibility: false,
      selectedFile: null,
      student: []
    };
  }

  retrieveStudent = async () => {
    const response = await fetch("http://localhost:5000/api/student");
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  componentDidMount() {
    this.retrieveStudent()
      .then(res => {
        this.setState({
          student: res
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <div>
        <h1>Student</h1>
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
                <TableCell colSpan="3" align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.student.map(row => (
                <TableRow key={row.matriculationNo}>
                  <TableCell component="th" scope="row">
                    {row.matriculationNo}
                  </TableCell>
                  <TableCell colSpan="3" align="right">
                    {row.name}
                  </TableCell>
                  <TableCell colSpan="3" align="right">
                    {row.username}
                  </TableCell>
                  <TableCell colSpan="3"></TableCell>
                  <TableCell colSpan="3">
                    <Fab aria-label="delete">
                      <DeleteIcon />
                    </Fab>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}
export default listStudent;
