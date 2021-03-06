import React from "react";
import Webcam from "react-webcam";
import "./styles.scss";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

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
          <Paper
            style={{
              marginTop: "10px",
              padding: "10px 0px 50px 50px",
              margin: "50px 0 0 50px",
              width: "490px",
              height: "400px"
            }}
          >
            <div className="student-wrapper">
              <div className="student-form" style={{ marginRight: "5px" }}>
                <div
                  className="student-form__header"
                  style={{ margin: "0 110px 0 0" }}
                >
                  Name
                </div>
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
                <div
                  className="student-form__header"
                  style={{ margin: "0 90px 0 0" }}
                >
                  Password
                </div>
                <input
                  className="student-form__input"
                  type="password"
                  value={password}
                  onChange={e =>
                    this.setState({ password: e.currentTarget.value })
                  }
                />
                <div className="student-form__header" style={{ fontSize: 24 }}>
                  Photo Count
                </div>
                <div
                  className="student-form__header"
                  style={{ fontSize: 30, marginTop: "10px" }}
                >
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
                  <Button
                    className="student-camera__btn"
                    style={{
                      borderRadius: "5px",
                      margin: "10px 50px 0px 43px",
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
                    className="student-camera__btn"
                    style={{
                      borderRadius: "5px",
                      margin: "10px 50px 0px 43px",
                      zIndex: "100",
                      padding: "10px",
                      width: "200px"
                    }}
                    variant="contained"
                    onClick={this.takeAnother}
                  >
                    Checking Photo
                  </Button>
                )}
              </div>
            </div>

            <Button
              className="student-form__btn"
              style={{
                margin: "20px 92px 55px 43px",
                padding: "5px",
                width: "200px"
              }}
              variant="contained"
              onClick={this.onBtnClick}
              color="primary"
            >
              {!this.state.loadingState ? "Submit" : "Submitting"}
            </Button>
          </Paper>
        </div>
      </Box>
    );
  }

  onBtnClick = async () => {
    const { matriculationNo, name, password, imageCounter } = this.state;
    if (name.length > 1) {
      if (RegExp(/[A-Za-z][0-9]{7}[A-Za-z]/).test(matriculationNo)) {
        if (password.length > 1) {
          if (imageCounter == 4) {
            this.setState({
              loadingState: true
            });
            console.log("clicked");

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
                res
                  ? alert("Student has been added")
                  : alert("Student has already existed");
              });

            this.setState({
              matriculationNo: "",
              name: "",
              password: "",
              descriptor: null,
              image: null,
              showCamera: true,
              imageCounter: 0
            });
            descriptorSet = [];
            this.setState({
              loadingState: false
            });
          } else {
            alert("Please take more photo");
          }
        } else {
          alert("Please enter a valid password");
        }
      } else {
        alert("Please enter a valid matriculation No.");
      }
    } else {
      alert("Please enter a valid name");
    }
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
