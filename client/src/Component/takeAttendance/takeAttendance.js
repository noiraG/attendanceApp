import React from "react";
import "./styles.scss";
import Webcam from "react-webcam";
import canvas from "canvas";

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
      student: ""
    };
    this.webcamRef = React.createRef();
  }

  render() {
    const admin = this.props.admin;
    return (
      <div className="attendance-container">
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
        {!admin && this.state.showCamera ? (
          <Webcam
            audio={false}
            height={300}
            ref={this.webcamRef}
            screenshotFormat="image/jpeg"
            width={500}
            videoConstraints={{ width: 250, height: 300, facingMode: "user" }}
          />
        ) : (
          <img id="photo1" src={this.state.image} />
        )}
        {!admin &&
          (this.state.showCamera ? (
            <div className="camera-btn" onClick={this.webcamCapture}>
              Take Photo
            </div>
          ) : (
            <div className="camera-btn" onClick={this.takeAnother}>
              Retake Photo
            </div>
          ))}
        {admin && (
          <div className="attendance-header">Input Student Matric No.</div>
        )}
        {admin && (
          <input
            className="attendance-input"
            type="text"
            value={this.state.student}
            onChange={e => this.setState({ student: e.target.value })}
          />
        )}
        <div
          className="attendance-btn"
          onClick={!admin ? this.onBtnClick : this.onAdminClick}
        >
          Submit
        </div>
      </div>
    );
  }

  onBtnClick = () => {
    console.log("click");
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
              alert(
                "Photo does not match you. Please try again or approach administrator"
              );
            } else if (res === true) {
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
          alert("There was an error");
        } else if (res === true) {
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
    // let image = document.getElementById("photo");
    let result = await faceapi
      .detectSingleFace(
        "photo1",
        new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 })
      )
      .withFaceLandmarks()
      .withFaceExpressions()
      .withFaceDescriptor();
    console.log(result);
    return result;
  };

  takeAnother = () => {
    this.setState({ showCamera: true });
  };
}

export default TakeAttendance;
