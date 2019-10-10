import React from "react";
import "./styles.scss";
import Webcam from "react-webcam";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

const faceapi = require("face-api.js");

class TakeAttendance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matriculationNo: props.matriculationNo,
      course: "",
      class: "",
      image: null,
      showCamera: true,
      student: "",
      loadingState: false
    };
    this.webcamRef = React.createRef();
  }

  render() {
    const admin = this.props.admin;
    return (
      <Box height="100%" style={{ backgroundColor: "#cfe8fc" }}>
        <div className="attendance-container">
          {admin ? (
            <Paper
              style={{
                marginTop: "10px",
                padding: "10px 0px 50px 50px",
                width: "350px",
                height: "200px"
              }}
            >
              <div className="attendance-header">Input your Course Code</div>
              <input
                className="attendance-input"
                type="text"
                value={this.state.course}
                onChange={e => this.setState({ course: e.target.value })}
              />
              <div className="attendance-header">Input your Class Code</div>
              <input
                className="attendance-input"
                type="text"
                value={this.state.class}
                onChange={e => this.setState({ class: e.target.value })}
              />
              <div className="attendance-header">Input Student Matric No.</div>
              <input
                className="attendance-input"
                type="text"
                value={this.state.student}
                onChange={e => this.setState({ student: e.target.value })}
              />

              <Button
                style={{
                  margin: "10px 92px 50px 43px",
                  padding: "5px",
                  width: "200px"
                }}
                variant="contained"
                onClick={!admin ? this.onBtnClick : this.onAdminClick}
                color="primary"
              >
                {!this.state.loadingState ? "Submit" : "Submitting"}
              </Button>
            </Paper>
          ) : (
            <Paper
              style={{
                padding: "10px 0px 50px 50px",
                width: "350px",
                height: "480px"
              }}
            >
              <div className="attendance-header">Input your Course Code</div>
              <input
                className="attendance-input"
                type="text"
                value={this.state.course}
                onChange={e => this.setState({ course: e.target.value })}
              />
              <div className="attendance-header">Input your Class Code</div>
              <input
                className="attendance-input"
                type="text"
                value={this.state.class}
                onChange={e => this.setState({ class: e.target.value })}
              />
              {this.state.showCamera ? (
                <div style={{ margin: "0px 0px 0px -103px" }}>
                  <Webcam
                    audio={false}
                    height={300}
                    ref={this.webcamRef}
                    screenshotFormat="image/jpeg"
                    width={500}
                    videoConstraints={{
                      width: 250,
                      height: 300,
                      facingMode: "user"
                    }}
                  />
                </div>
              ) : (
                <div style={{ margin: "0px 0px 0px -53px" }}>
                  <img
                    id="photo1"
                    width="250"
                    height="300"
                    src={this.state.image}
                  />
                </div>
              )}

              {this.state.showCamera ? (
                <div className="camera-btn" onClick={this.webcamCapture}>
                  Take Photo
                </div>
              ) : (
                <div className="camera-btn" onClick={this.takeAnother}>
                  Retake Photo
                </div>
              )}

              <Button
                style={{
                  margin: "10px 92px 50px 43px",
                  padding: "5px",
                  width: "200px"
                }}
                variant="contained"
                onClick={!admin ? this.onBtnClick : this.onAdminClick}
                color="primary"
              >
                {!this.state.loadingState ? "Submit" : "Submitting"}
              </Button>
            </Paper>
          )}
        </div>
      </Box>
    );
  }

  onBtnClick = () => {
    console.log("click");
    this.setState({ loadingState: true });
    const { course } = this.state;
    this.generateDescriptors()
      .then(res => {
        console.log(JSON.stringify(res.descriptor));
        fetch("http://localhost:5000/api/attendance/update2", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            classDetail: {
              courseIndex: this.state.course,
              classIndex: this.state.class
            },
            descriptor: {
              _descriptors: res.descriptor,
              _label: this.state.matriculationNo
            }
          })
        })
          .then(res => res.json())
          .then(res => {
            if (!res) {
              this.setState({ loadingState: false });
              alert(
                "Photo does not match you. Please try again or approach administrator"
              );
            } else if (res === true) {
              this.setState({ loadingState: false });
              alert("Attendance has been recorded");
            }
          });
      })
      .catch(e =>
        alert(
          "Photo not valid. Please retake and try again or approach administrator"
        )
      );
  };

  onAdminClick = () => {
    console.log("click");
    this.setState({ loadingState: true });
    fetch("http://localhost:5000/api/attendance/admin-update/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        classDetail: {
          courseIndex: this.state.course,
          classIndex: this.state.class
        },
        matriculationNo: this.state.student
      })
    })
      .then(res => res.json())
      .then(res => {
        if (!res) {
          this.setState({ loadingState: false });
          alert("There was an error");
        } else if (res === true) {
          this.setState({ loadingState: false });
          alert("Attendance has been recorded");
        }
      });
  };

  webcamCapture = async () => {
    const imageSrc = this.webcamRef.current.getScreenshot();
    this.setState({ image: imageSrc, showCamera: false });
  };

  generateDescriptors = async () => {
    await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
    await faceapi.nets.faceExpressionNet.loadFromUri("/models");
    let result = await faceapi
      .detectSingleFace(
        "photo1",
        new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 })
      )
      .withFaceLandmarks()
      .withFaceDescriptor();
    console.log(result);
    return result;
  };

  takeAnother = () => {
    this.setState({ showCamera: true });
  };
}

export default TakeAttendance;
