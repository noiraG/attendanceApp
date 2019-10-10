import React from "react";
import Webcam from "react-webcam";
import "./styles.scss";
import Box from "@material-ui/core/Box";

const faceapi = require("face-api.js");

var descriptorSet = [];

export default class AddStudent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matriculationNo: "",
      name: "",
      password: "",
      descriptor: null,
      image: null,
      showCamera: true,
      loadingState: false,
      imageCounter: 0
    };
    this.webcamRef = React.createRef();
  }

  render() {
    const { matriculationNo, name, username, password } = this.state;
    return (
      <Box height="100%" style={{ backgroundColor: "#cfe8fc" }}>
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
              <div className="student-form__header">Password</div>
              <input
                className="student-form__input"
                type="password"
                value={password}
                onChange={e =>
                  this.setState({ password: e.currentTarget.value })
                }
              />
              <div className="student-form__header">Photo Count</div>
              <div className="student-form__header">
                {this.state.imageCounter}
              </div>
            </div>
            <div className="student-camera">
              {this.state.showCamera ? (
                <Webcam
                  className="student-camera__feed"
                  audio={false}
                  height={300}
                  ref={this.webcamRef}
                  screenshotFormat="image/jpeg"
                  width={300}
                  videoConstraints={{
                    width: 250,
                    height: 300,
                    facingMode: "user"
                  }}
                />
              ) : (
                <Box width={300} height={300}>
                  <img
                    id="photo"
                    className="student-camera__feed"
                    width="250"
                    height="300"
                    src={this.state.image}
                  />
                </Box>
              )}
              {this.state.showCamera ? (
                <div
                  className="student-camera__btn"
                  onClick={this.webcamCapture}
                >
                  Take Photo
                </div>
              ) : (
                <div className="student-camera__btn" onClick={this.takeAnother}>
                  Checking Photo
                </div>
              )}
            </div>
          </div>
          <div className="student-form__btn" onClick={this.onBtnClick}>
            {!this.state.loadingState ? "Submit" : "Submitting"}
          </div>
        </div>
      </Box>
    );
  }

  onBtnClick = async () => {
    this.setState({
      loadingState: true
    });
    console.log("clicked");
    const { matriculationNo, name, username, password } = this.state;
    console.log("descriptor set: ", descriptorSet);
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
        descriptor: descriptorSet
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
    this.setState({
      loadingState: false
    });
  };

  webcamCapture = async () => {
    const imageSrc = this.webcamRef.current.getScreenshot();
    let imageCount = this.state.imageCounter;
    this.setState({ image: imageSrc, showCamera: false });
    let result = await this.generateDescriptors();
    console.log("checking the image descriptor");
    if (result) {
      console.log("descriptor stored");
      imageCount++;
      this.setState({ imageCounter: imageCount });
      descriptorSet.push(result);
    }
    this.setState({ image: null, showCamera: true });
  };

  generateDescriptors = async () => {
    await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
    await faceapi.nets.faceExpressionNet.loadFromUri("/models");
    let result = await faceapi
      .detectSingleFace("photo")
      .withFaceLandmarks()
      .withFaceDescriptor();

    return result;
  };

  takeAnother = () => {
    this.setState({ showCamera: true });
  };
}

//   generateDescriptors = async () => {
//     await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
//     await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
//     await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
//     await faceapi.nets.faceExpressionNet.loadFromUri("/models");
//     let result = await faceapi
//       .detectSingleFace(
//         "photo",
//         new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 })
//       )
//       .withFaceLandmarks()
//       .withFaceExpressions()
//       .withFaceDescriptor();
//     return result;
//   };

//   takeAnother = () => {
//     this.setState({ showCamera: true });
//   };
// }
