import React from "react";
import "./styles.scss";
import Webcam from "react-webcam";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const faceapi = require("face-api.js");

class TakeAttendance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matriculationNo: props.matriculationNo,
      courseIndex: "",
      classIndex: "",
      status: "Attended",
      image: null,
      showCamera: true,
      student: "",
      loadingState: false
    };
    this.webcamRef = React.createRef();
  }

  render() {
    const admin = this.props.admin;
    const handleChange = event => {
      this.setState({
        [event.target.name]: event.target.value
      });
      console.log("the current status is: ", this.state.status);
    };

    return (
      <Box height="100%" style={{ backgroundColor: "#cfe8fc" }}>
        <div className="attendance-container">
          {admin ? (
            <Paper
              style={{
                marginTop: "10px",
                padding: "10px 0px 50px 50px",
                width: "350px",
                height: "250px"
              }}
            >
              <div className="attendance-header">Input your Course Code</div>
              <input
                className="attendance-input"
                type="text"
                value={this.state.courseIndex}
                onChange={e => this.setState({ courseIndex: e.target.value })}
              />
              <div className="attendance-header">Input your Class Index</div>
              <input
                className="attendance-input"
                type="text"
                value={this.state.classIndex}
                onChange={e => this.setState({ classIndex: e.target.value })}
              />
              <div className="attendance-header">Input Student Matric No.</div>
              <input
                className="attendance-input"
                type="text"
                value={this.state.student}
                onChange={e => this.setState({ student: e.target.value })}
              />

              <Select
                value={this.state.status}
                onChange={handleChange}
                name="status"
                displayEmpty
                style={{ margin: "0px 525px 0px 105px" }}
              >
                <MenuItem value={"Attended"}>Attended</MenuItem>
                <MenuItem value={"Late"}>Late</MenuItem>
                <MenuItem value={"MC"}>MC</MenuItem>
              </Select>

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
                value={this.state.courseIndex}
                onChange={e => this.setState({ courseIndex: e.target.value })}
              />
              <div className="attendance-header">Input your Class Index</div>
              <input
                className="attendance-input"
                type="text"
                value={this.state.classIndex}
                onChange={e => this.setState({ classIndex: e.target.value })}
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
                <Button
                  style={{
                    borderRadius: "5px",
                    margin: "10px 92px 0px 43px",
                    zIndex: "100",
                    padding: "10px",
                    width: "200px"
                  }}
                  variant="contained"
                  onClick={this.webcamCapture}
                >
                  Take photo
                </Button>
              ) : (
                <Button
                  style={{
                    borderRadius: "5px",
                    margin: "10px 92px 0px 43px",
                    zIndex: "100",
                    padding: "10px",
                    width: "200px"
                  }}
                  variant="contained"
                  onClick={this.takeAnother}
                >
                  Retake Photo
                </Button>
              )}

              <Button
                style={{
                  margin: "10px 92px 55px 43px",
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
    const { courseIndex, classIndex, image } = this.state;

    if (courseIndex.length > 0) {
      if (classIndex.length > 0) {
        if (image != null) {
          this.setState({ loadingState: true });
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
                    courseIndex: this.state.courseIndex,
                    classIndex: this.state.classIndex
                  },
                  descriptor: {
                    _descriptors: res.descriptor,
                    _label: this.state.matriculationNo
                  }
                })
              })
                .then(res => res.json())
                .then(res => {
                  this.setState({ loadingState: false });
                  res
                    ? alert("Attendance has been recorded")
                    : alert(
                        "Error occurred. Please ensure the input is valid or approach administrator for assistance."
                      );
                });
            })
            .catch(e =>
              alert(
                "Photo not valid. Please retake and try again or approach administrator for assistance."
              )
            );
        } else {
          alert("Please take a photo.");
        }
      } else {
        alert("Please enter a valid class index.");
      }
    } else {
      alert("Please enter a valid course index.");
    }
  };

  onAdminClick = () => {
    console.log("click");
    const { courseIndex, classIndex, student, status } = this.state;

    if (courseIndex.length > 0) {
      if (classIndex.length > 0) {
        if (RegExp(/[A-Za-z][0-9]{7}[A-Za-z]/).test(student)) {
          this.setState({ loadingState: true });
          fetch("http://localhost:5000/api/attendance/admin-update/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              classDetail: {
                courseIndex: courseIndex,
                classIndex: classIndex,
                status: status
              },
              matriculationNo: this.state.student
            })
          })
            .then(res => res.json())
            .then(res => {
              this.setState({ loadingState: false });
              res
                ? alert("Attendance has been recorded")
                : alert("Attendance is not updated. Error occurred.");
            });
        } else {
          alert("Please enter a valid student matriculation No.");
        }
      } else {
        alert("Please enter a valid class index.");
      }
    } else {
      alert("Please enter a valid course index.");
    }
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
