import React from "react";
class listStudent extends React.Component {
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
        <h1>Listed Student</h1>
      </div>
    );
  }
}
export default listStudent;
