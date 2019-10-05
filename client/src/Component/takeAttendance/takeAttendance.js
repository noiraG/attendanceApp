import React from "react";
import "./styles.scss";
import Webcam from "react-webcam";
import canvas from "canvas";

const faceapi = require("face-api.js");

class TakeAttendance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      course: "",
      image: null,
      showCamera: true
    };
    this.webcamRef = React.createRef();
  }

  render() {
    return (
      <div className="attendance-container">
        <div className="attendance-header">Input your Course Code</div>
        <input
          className="attendance-input"
          type="text"
          value={this.state.course}
          onChange={e => this.setState({ course: e.target.value })}
        />
        {this.state.showCamera ? (
          <Webcam
            audio={false}
            height={300}
            ref={this.webcamRef}
            screenshotFormat="image/jpeg"
            width={500}
            videoConstraints={{ width: 500, height: 300, facingMode: "user" }}
          />
        ) : (
          <img id="photo" src={this.state.image} />
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
        <div className="attendance-btn" onClick={this.onBtnClick}>
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
        fetch("http://localhost:5000/api/attendance/update/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            classDetail: {
              courseIndex: "CZ2002",
              classIndex: "102111"
            },
            descriptor: {
              _descriptors: res.descriptor,
              _label: "U1880216A"
            }
          })
        })
          .then(res => res.json())
          .then(res => console.log(res));
      })
      .catch(e => console.log(e));
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
        "photo",
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
