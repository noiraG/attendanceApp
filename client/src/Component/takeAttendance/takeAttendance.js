import React from "react";
import "./styles.scss";
import Webcam from "react-webcam"

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
            <div>
                <div>Input your Course Code</div>
                <input type="text" value={this.state.course} onChange={(e) => this.setState({course: e.target.value})}/>
                {this.state.showCamera ? <Webcam
                        audio={false}
                        height={300}
                        ref={this.webcamRef}
                        screenshotFormat="image/jpeg"
                        width={500}
                        videoConstraints={{width: 1280, height: 720, facingMode: "user"}}
                    /> :
                    <img src={this.state.image}/>
                }
                {this.state.showCamera ? <div className="class-form__btn" onClick={this.webcamCapture}>Take Photo</div> :
                    <div className="class-form__btn" onClick={this.takeAnother}>Take Another Photo</div>
                }
            </div>
        );
    }

    webcamCapture = () => {
        const imageSrc = this.webcamRef.current.getScreenshot();
        this.setState({image: imageSrc, showCamera: false});
    }

    takeAnother = () => {
        this.setState({showCamera: true});
    }
}

export default TakeAttendance;
