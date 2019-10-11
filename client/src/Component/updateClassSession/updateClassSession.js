import React from "react";
import "./styles.scss";

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
      <div className="class-container">
        <div className="class-form-wrapper">
          <div className="class-form">
            <div className="class-form__field">
              <div className="class-form__header">Course Index</div>
              <input
                className="class-form__input"
                type="text"
                value={courseIndex}
                onChange={e =>
                  this.setState({ courseIndex: e.currentTarget.value })
                }
              />
            </div>
            <div className="class-form__field">
              <div className="class-form__header">Course Name</div>
              <input
                className="class-form__input"
                type="text"
                value={courseName}
                onChange={e =>
                  this.setState({ courseName: e.currentTarget.value })
                }
              />
            </div>
            <div className="class-form__field">
              <div className="class-form__header">Class Index</div>
              <input
                className="class-form__input"
                type="text"
                value={classIndex}
                onChange={e =>
                  this.setState({ classIndex: e.currentTarget.value })
                }
              />
            </div>
            <div className="class-form__field">
              <div className="class-form__header">Starting Time</div>
              <input
                className="class-form__input"
                type="text"
                value={startingTime}
                onChange={e =>
                  this.setState({ startingTime: e.currentTarget.value })
                }
              />
            </div>
            <div className="class-form__field">
              <div className="class-form__header">Ending Time</div>
              <input
                className="class-form__input"
                type="text"
                value={endingTime}
                onChange={e =>
                  this.setState({ endingTime: e.currentTarget.value })
                }
              />
            </div>
            <div className="class-form__field">
              <div className="class-form__header">Date (MM/DD/YYYY)</div>
              <input
                className="class-form__input"
                type="text"
                value={date}
                onChange={e => this.setState({ date: e.currentTarget.value })}
              />
            </div>
            <div className="class-form__field">
              <div className="class-form__header">Supervisor</div>
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
        </div>
        <div className="class-form__btn" onClick={this.onEditClick}>
          Update
        </div>
      </div>
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
        res ? alert("class has been updated") : alert("Class update failed")
      );
  };
}
