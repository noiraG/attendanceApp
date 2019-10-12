import React from "react";
import "./styles.scss";
import Paper from "@material-ui/core/Paper";

export default class CreateClassSession extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startingTime: "",
      endingTime: "",
      classIndex: "",
      courseIndex: "",
      courseName: "",
      supervisor: "",
      studentCount: 1,
      students: [""]
    };
  }

  render() {
    const {
      startingTime,
      endingTime,
      classIndex,
      courseIndex,
      courseName,
      supervisor,
      studentCount,
      students
    } = this.state;
    const studentList = students.map((s, i) => (
      <input
        className="students-form__input"
        type="text"
        value={students[i]}
        onChange={e => {
          students[i] = e.currentTarget.value;
          this.setState({ students: students });
        }}
      />
    ));
    return (
      <div className="class-container1">
        <Paper
          style={{
            marginTop: "10px",
            padding: "10px 0px 50px 50px",
            margin: "0px 0 0 50px",
            width: "490px",
            height: "370px"
          }}
        >
          <div className="class-form-wrapper1">
            <div className="class-form1">
              <div className="class-form1__field">
                <div className="class-form1__header">Course Index</div>
                <input
                  className="class-form1__input"
                  type="text"
                  value={courseIndex}
                  onChange={e =>
                    this.setState({ courseIndex: e.currentTarget.value })
                  }
                />
              </div>
              <div className="class-form1__field">
                <div className="class-form1__header">Course Name</div>
                <input
                  className="class-form1__input"
                  type="text"
                  value={courseName}
                  onChange={e =>
                    this.setState({ courseName: e.currentTarget.value })
                  }
                />
              </div>
              <div className="class-form1__field">
                <div className="class-form1__header">Class Index</div>
                <input
                  className="class-form1__input"
                  type="text"
                  value={classIndex}
                  onChange={e =>
                    this.setState({ classIndex: e.currentTarget.value })
                  }
                />
              </div>
              <div className="class-form1__field">
                <div className="class-form1__header">Starting Time</div>
                <input
                  className="class-form1__input"
                  type="text"
                  value={startingTime}
                  onChange={e =>
                    this.setState({ startingTime: e.currentTarget.value })
                  }
                />
              </div>
              <div className="class-form1__field">
                <div className="class-form1__header">Ending Time</div>
                <input
                  className="class-form1__input"
                  type="text"
                  value={endingTime}
                  onChange={e =>
                    this.setState({ endingTime: e.currentTarget.value })
                  }
                />
              </div>
              <div className="class-form1__field">
                <div className="class-form1__header">Supervisor</div>
                <input
                  className="class-form__input"
                  type="text"
                  value={supervisor}
                  onChange={e =>
                    this.setState({ supervisor: e.currentTarget.value })
                  }
                />
              </div>
            </div>
            <div className="students-form1">
              <div className="students-form1__header">Students</div>
              <div className="students-form1__list">{studentList}</div>
              <div className="students-form1__btns">
                <div
                  className="students-form1__btn"
                  onClick={this.onAddStudent}
                >
                  +
                </div>
                <div
                  className="students-form1__btn"
                  onClick={this.onRemoveStudent}
                >
                  -
                </div>
              </div>
            </div>
          </div>
          <div className="class-form1__btn" onClick={this.onCreateClick}>
            Create Class
          </div>
        </Paper>
      </div>
    );
  }

  onAddStudent = () => {
    const { studentCount, students } = this.state;
    students.push("");
    this.setState({ studentCount: studentCount + 1, students: students });
  };

  onRemoveStudent = () => {
    const { studentCount, students } = this.state;
    if (studentCount > 1) {
      students.pop();
      this.setState({ studentCount: studentCount - 1, students: students });
    }
  };

  onCreateClick = () => {
    const {
      startingTime,
      endingTime,
      date,
      classIndex,
      courseIndex,
      courseName,
      supervisor,
      students
    } = this.state;

    if (courseIndex.length > 0) {
      if (courseName.length > 0) {
        if (classIndex.length > 0) {
          if (
            RegExp(/(([0][0-9])|([1][0-9])|([2][0-3]))\:([0-5][0-9])/).test(
              startingTime
            )
          ) {
            if (
              RegExp(/(([0][0-9])|([1][0-9])|([2][0-3]))\:([0-5][0-9])/).test(
                endingTime
              )
            ) {
              if (
                this.getTimeAsNumberOfMinutes(startingTime) <
                this.getTimeAsNumberOfMinutes(endingTime)
              ) {
                if (supervisor.length > 0) {
                  fetch("http://localhost:5000/api/class/add/", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
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
                    })
                  })
                    .then(res => res.json())
                    .then(res =>
                      res
                        ? alert("class has been added")
                        : alert("Class is not added")
                    );
                } else {
                  alert("Please enter a valid supervisor.");
                }
              } else {
                alert("Please check the time range and ensure it is correct.");
              }
            } else {
              alert("Please enter a valid ending time - 24hr format.");
            }
          } else {
            alert("Please enter a valid starting time - 24hr format.");
          }
        } else {
          alert("Please enter a class index.");
        }
      } else {
        alert("Please enter a course name.");
      }
    } else {
      alert("Please enter a course index.");
    }
  };

  getTimeAsNumberOfMinutes(time) {
    var timeParts = time.split(":");

    var timeInMinutes = timeParts[0] * 60 + timeParts[1];

    return timeInMinutes;
  }
}
