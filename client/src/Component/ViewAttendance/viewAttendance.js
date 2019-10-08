import React from "react";
import "./styles.scss";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";

class ViewAttendance extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      attendance: [],
      matriculationNo: props.matriculationNo
    };
  }

  componentDidMount() {
    this.retrieveList();
  }

  render() {
    return (
      <Box height="100%" style={{ backgroundColor: "#cfe8fc" }}>
        <div className="attendance-container">
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    {this.state.matriculationNo}'s attendancelist
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
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.attendance.map(record => {
                  return (
                    <TableRow key={record.attendanceReferenceID}>
                      <TableCell component="th" scope="row">
                        {record.courseIndex}
                      </TableCell>
                      <TableCell align="right">{record.classIndex}</TableCell>
                      <TableCell align="right">{record.courseName}</TableCell>
                      <TableCell align="right">{record.date}</TableCell>
                      <TableCell align="right">{record.startingTime}</TableCell>
                      <TableCell align="right">{record.endingTime}</TableCell>
                      <TableCell align="right">{record.supervisor}</TableCell>
                      <TableCell align="right">
                        {record.status || "No attend"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        </div>
      </Box>
    );
  }

  async retrieveList() {
    const { course } = this.state;
    fetch("http://localhost:5000/api/attendance/view/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        matriculationNo: this.state.matriculationNo
      })
    })
      .then(res => res.json())
      .then(res =>
        this.setState({
          attendance: res
        })
      );
  }
}

export default ViewAttendance;
