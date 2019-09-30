import React from "react";
// import "./styles.scss"

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };
    }

    render() {
        return (
            <div className="login-container">
                <div className="login-landing-msg">Log in to proceed</div>
                <div className="login-form">
                    <div className="login-form__btn" onClick={this.onCreateClick}>Create Class</div>
                </div>
            </div>
        );
    }

    onCreateClick = () => {
        fetch("http://localhost:5000/api/class/add/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                class:{
                    startingTime: "10:00",
                    endingTime: "12:00",
                    date: new Date('2019-12-17'),
                    classIndex: "123",
                    courseIndex: "CZ3002",
                    courseName: "Advanced Software Engineering",
                    supervisor: "Garion Ng"
                },
                matriculationNo: ["U1234562B", "U1234561A"]
            }),
        }).then((res) => res.json()).then((res) => console.log(res));
    }
}
