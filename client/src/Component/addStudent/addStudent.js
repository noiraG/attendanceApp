import React from "react";
import Webcam from "react-webcam";
import "./styles.scss"

export default class AddStudent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            matriculationNo: "",
            name: "",
            username: "",
            password: "",
            image: null,
            showCamera: true
        };
        this.webcamRef = React.createRef();
    }

    render() {
        const {matriculationNo, name, username, password} = this.state
        return (
            <div className="student-container">
                <div className="student-wrapper">
                    <div className="student-form">
                        <div className="student-form__header">Name</div>
                        <input className="student-form__input" type="text" value={name}
                               onChange={(e) => this.setState({name: e.currentTarget.value})}/>
                        <div className="student-form__header">Matriculation Number</div>
                        <input className="student-form__input" type="text" value={matriculationNo}
                               onChange={(e) => this.setState({matriculationNo: e.currentTarget.value})}/>
                        <div className="student-form__header">Username</div>
                        <input className="student-form__input" type="text" value={username}
                               onChange={(e) => this.setState({username: e.currentTarget.value})}/>
                        <div className="student-form__header">Password</div>
                        <input className="student-form__input" type="password" value={password}
                               onChange={(e) => this.setState({password: e.currentTarget.value})}/>
                    </div>
                    <div className="student-camera">
                        {this.state.showCamera ? <Webcam className="student-camera__feed"
                                audio={false}
                                height={300}
                                ref={this.webcamRef}
                                screenshotFormat="image/jpeg"
                                width={500}
                                videoConstraints={{width: 500, height: 300, facingMode: "user"}}
                            /> :
                            <img className="student-camera__feed" src={this.state.image}/>
                        }
                        {this.state.showCamera ? <div className="student-camera__btn" onClick={this.webcamCapture}>Take Photo</div> :
                            <div className="student-camera__btn" onClick={this.takeAnother}>Retake Photo</div>
                        }
                    </div>
                </div>
                <div className="student-form__btn" onClick={this.onBtnClick}>Submit</div>
            </div>

        );
    }


    onBtnClick = () => {
        const {matriculationNo, name, username, password, image} = this.state;
        fetch("http://localhost:5000/api/student/add/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                matriculationNo: matriculationNo,
                name: name,
                username: username,
                password: password,
                image: image
            }),
        }).then((res) => res.json()).then((res) => console.log(res));
    }

    webcamCapture = () => {
        const imageSrc = this.webcamRef.current.getScreenshot();
        this.setState({image: imageSrc, showCamera: false});
    }

    takeAnother = () => {
        this.setState({showCamera: true});
    }
}
