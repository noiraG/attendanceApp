import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

class listStudent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibility: false,
      selectedFile: null
    };
  }

  createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  render() {
    return (
      <div>
        <h1>Listed Student</h1>
      </div>
    );
  }
}
export default listStudent;
