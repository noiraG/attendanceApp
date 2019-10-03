import React from "react";
import Webcam from "react-webcam";
// import "./styles.scss"

export default class AddStudent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            matriculationNo: "",
            name: "",
            username: "",
            password: "",
            image: null
        };
        this.webcamRef = React.createRef();
    }

    render() {
        const {matriculationNo, name, username, password} = this.state
        return (
            <div className="class-container">
                <div className="class-landing-msg">Student Information</div>
                <div className="class-form">
                    <div className="class-form__header">Name</div>
                    <input className="class-form__input" type="text" value={name}
                           onChange={(e) => this.setState({name: e.currentTarget.value})}/>
                    <div className="class-form__header">Matriculation Number</div>
                    <input className="class-form__input" type="text" value={matriculationNo}
                           onChange={(e) => this.setState({matriculationNo: e.currentTarget.value})}/>
                    <div className="class-form__header">Username</div>
                    <input className="class-form__input" type="text" value={username}
                           onChange={(e) => this.setState({username: e.currentTarget.value})}/>
                    <div className="class-form__header">Password</div>
                    <input className="class-form__input" type="password" value={password}
                           onChange={(e) => this.setState({password: e.currentTarget.value})}/>
                    <Webcam
                        audio={false}
                        height={720}
                        ref={this.webcamRef}
                        screenshotFormat="image/jpeg"
                        width={1280}
                        videoConstraints={{width: 1280, height: 720, facingMode: "user"}}
                    />
                    <div className="class-form__btn" onClick={this.webcamCapture}>Take Photo</div>
                    <div className="class-form__btn" onClick={this.onBtnClick}>Submit</div>
                </div>
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
        this.setState({image: imageSrc});
    }
}
