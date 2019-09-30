import React from "react";
// import "./styles.scss"

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startingTime: "",
            endingTime: "",
            date: null,
            classIndex: "",
            courseIndex: "",
            courseName: "",
            supervisor: "",
            studentCount: 1,
            students: [""]
        };
    }

    render() {
        const {startingTime, endingTime, date, classIndex, courseIndex, courseName, supervisor, studentCount, students} = this.state
        const studentList = students
            .map((s, i) => <input
                className="class-form__input"
                type="text" value={students[i]}
                onChange={(e) => {
                    students[i] = e.currentTarget.value;
                    this.setState({students: students});
                }}/>)
        return (
            <div className="class-container">
                <div className="class-landing-msg">Log in to proceed</div>
                <div className="class-form">
                    <div className="class-form__header">Course Index</div>
                    <input className="class-form__input" type="text" value={courseIndex}
                           onChange={(e) => this.setState({courseIndex: e.currentTarget.value})}/>
                    <div className="class-form__header">Course Name</div>
                    <input className="class-form__input" type="text" value={courseName}
                           onChange={(e) => this.setState({courseName: e.currentTarget.value})}/>
                    <div className="class-form__header">Class Index</div>
                    <input className="class-form__input" type="text" value={classIndex}
                           onChange={(e) => this.setState({classIndex: e.currentTarget.value})}/>
                    <div className="class-form__header">date</div>
                    <input className="class-form__input" type="date" value={date}
                           onChange={(e) => this.setState({date: e.currentTarget.value})}/>
                    <div className="class-form__header">Starting Time</div>
                    <input className="class-form__input" type="text" value={startingTime}
                           onChange={(e) => this.setState({startingTime: e.currentTarget.value})}/>
                    <div className="class-form__header">Ending Time</div>
                    <input className="class-form__input" type="text" value={endingTime}
                           onChange={(e) => this.setState({endingTime: e.currentTarget.value})}/>
                    <div className="class-form__header">Supervisor</div>
                    <input className="class-form__input" type="text" value={supervisor}
                           onChange={(e) => this.setState({supervisor: e.currentTarget.value})}/>
                    <div className="class-form__header">Students</div>
                    <div>{studentList}</div>
                    <div className="class-form__btn" onClick={this.onAddStudent}>+</div>
                    <div className="class-form__btn" onClick={this.onRemoveStudent}>-</div>
                    <div className="class-form__btn" onClick={this.onCreateClick}>Create Class</div>
                </div>
            </div>
        );
    }

    onAddStudent = () => {
        const {studentCount, students} = this.state;
        students.push("");
        this.setState({studentCount: studentCount + 1, students: students})
    }

    onRemoveStudent = () => {
        const {studentCount, students} = this.state;
        if (studentCount > 1) {
            students.pop()
            this.setState({studentCount: studentCount - 1, students: students})
        }
    }

    onCreateClick = () => {
        const {startingTime, endingTime, date, classIndex, courseIndex, courseName, supervisor, students} = this.state;
        fetch("http://localhost:5000/api/class/add/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                class: {
                    startingTime: startingTime,
                    endingTime: endingTime,
                    date: date,
                    classIndex: classIndex,
                    courseIndex: courseIndex,
                    courseName: courseName,
                    supervisor: supervisor
                },
                matriculationNo: students
            }),
        }).then((res) => res.json()).then((res) => console.log(res));
    }
}
