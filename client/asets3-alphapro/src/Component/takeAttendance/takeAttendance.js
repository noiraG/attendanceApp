import React from "react";
class takeAttendance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibility: false,
      selectedFile: null
    };
  }
  render() {
    return (
      <div>
        <input type="file" onChange={this.fileSelectedHandler}></input>
        <button>Upload</button>
      </div>
    );
  }
}
export default takeAttendance;
