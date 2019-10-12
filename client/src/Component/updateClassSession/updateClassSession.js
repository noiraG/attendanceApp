import React from "react";
import "./styles.scss";
import Paper from "@material-ui/core/Paper";

export default class UpdateClassSession extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startingTime: props.startingTime,
      endingTime: props.endingTime,
      classIndex: props.classIndex,
      courseIndex: props.courseIndex,
      courseName: props.courseName,
      supervisor: props.supervisor,
      date: props.date,
      key: props.referenceKey
    };
  }

  render() {
    const {
      startingTime,
      endingTime,
      classIndex,
      courseIndex,
      courseName,
      date,
      supervisor,
      key
    } = this.state;
    return (
      <Paper
        style={{
          marginTop: "2px",
          padding: "10px 0px 50px 50px",
          width: "350px",
          height: "450px"
        }}
      >
        <div className="class-form-wrapper2">
          <div className="class-form2">
            <div className="class-form2__field">
              <div className="class-form2__header">Course Index</div>
              <input
                className="class-form2__input"
                type="text"
                value={courseIndex}
                onChange={e =>
                  this.setState({ courseIndex: e.currentTarget.value })
                }
              />
            </div>
            <div className="class-form2__field">
              <div className="class-form2__header">Course Name</div>
              <input
                className="class-form2__input"
                type="text"
                value={courseName}
                onChange={e =>
                  this.setState({ courseName: e.currentTarget.value })
                }
              />
            </div>
            <div className="class-form2__field">
              <div className="class-form2__header">Class Index</div>
              <input
                className="class-form2__input"
                type="text"
                value={classIndex}
                onChange={e =>
                  this.setState({ classIndex: e.currentTarget.value })
                }
              />
            </div>
            <div className="class-form2__field">
              <div className="class-form2__header">Starting Time</div>
              <input
                className="class-form2__input"
                type="text"
                value={startingTime}
                onChange={e =>
                  this.setState({ startingTime: e.currentTarget.value })
                }
              />
            </div>
            <div className="class-form2__field">
              <div className="class-form2__header">Ending Time</div>
              <input
                className="class-form2__input"
                type="text"
                value={endingTime}
                onChange={e =>
                  this.setState({ endingTime: e.currentTarget.value })
                }
              />
            </div>
            <div className="class-form2__field">
              <div className="class-form2__header">Date (MM/DD/YYYY)</div>
              <input
                className="class-form2__input"
                type="text"
                value={date}
                onChange={e => this.setState({ date: e.currentTarget.value })}
              />
            </div>
            <div className="class-form2__field">
              <div className="class-form2__header">Supervisor</div>
              <input
                className="class-form2__input"
                type="text"
                value={supervisor}
                onChange={e =>
                  this.setState({ supervisor: e.currentTarget.value })
                }
              />
            </div>
          </div>
        </div>
        <div
          className="class-form2__btn"
          onClick={this.onEditClick}
          style={{ margin: "10px 50px 0 50px" }}
        >
          Update
        </div>
      </Paper>
    );
  }

  onEditClick = () => {
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
                  fetch("http://localhost:5000/api/class/update/", {
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
                        ? alert("class has been updated")
                        : alert("Class update failed")
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
        alert("Please enter a course name");
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
