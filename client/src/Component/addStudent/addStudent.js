import React from "react";
import Webcam from "react-webcam";
import canvas from "canvas";
import "./styles.scss";

const faceapi = require("face-api.js");

export default class AddStudent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matriculationNo: "",
      name: "",
      password: "",
      descriptor: null,
      image: null,
      showCamera: true
    };
    this.webcamRef = React.createRef();
  }

  render() {
    const { matriculationNo, name, username, password } = this.state;
    return (
      <div className="student-container">
        <div className="student-wrapper">
          <div className="student-form">
            <div className="student-form__header">Name</div>
            <input
              className="student-form__input"
              type="text"
              value={name}
              onChange={e => this.setState({ name: e.currentTarget.value })}
            />
            <div className="student-form__header">Matriculation Number</div>
            <input
              className="student-form__input"
              type="text"
              value={matriculationNo}
              onChange={e =>
                this.setState({ matriculationNo: e.currentTarget.value })
              }
            />
            {/* <div className="student-form__header">Username</div>
            <input
              className="student-form__input"
              type="text"
              value={username}
              onChange={e => this.setState({ username: e.currentTarget.value })}
            /> */}
            <div className="student-form__header">Password</div>
            <input
              className="student-form__input"
              type="password"
              value={password}
              onChange={e => this.setState({ password: e.currentTarget.value })}
            />
          </div>
          <div className="student-camera">
            {this.state.showCamera ? (
              <Webcam
                className="student-camera__feed"
                audio={false}
                height={300}
                ref={this.webcamRef}
                screenshotFormat="image/jpeg"
                width={500}
                videoConstraints={{
                  width: 500,
                  height: 300,
                  facingMode: "user"
                }}
              />
            ) : (
              <img
                id="photo"
                className="student-camera__feed"
                src={this.state.image}
              />
            )}
            {this.state.showCamera ? (
              <div className="student-camera__btn" onClick={this.webcamCapture}>
                Take Photo
              </div>
            ) : (
              <div className="student-camera__btn" onClick={this.takeAnother}>
                Retake Photo
              </div>
            )}
          </div>
        </div>
        <div className="student-form__btn" onClick={this.onBtnClick}>
          Submit
        </div>
      </div>
    );
  }

  onBtnClick = () => {
    console.log("clicked");
    const { matriculationNo, name, username, password } = this.state;
    this.generateDescriptors()
      .then(res => {
        console.log(JSON.stringify(res.descriptor));
        fetch("http://localhost:5000/api/student/add/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            matriculationNo: matriculationNo,
            name: name,
            username: matriculationNo,
            password: password,
            descriptor: res.descriptor
          })
        })
          .then(res => res.json())
          .then(res => {
            this.setState({
              matriculationNo: "",
              name: "",
              username: "",
              password: "",
              descriptor: null,
              image: null,
              showCamera: true
            });
            alert("Student has been added");
          });
      })
      .catch(e => alert("Photo not valid. Please retake and try again"));
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
        "photo",
        new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 })
      )
      .withFaceLandmarks()
      .withFaceExpressions()
      .withFaceDescriptor();
    return result;
  };

  takeAnother = () => {
    this.setState({ showCamera: true });
  };
}
