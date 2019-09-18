import React from "react";
import "./styles.scss";

export default class NavigationBar extends React.PureComponent {

    render() {
        const { username, takeAttendanceView, setTakeViewState } = this.props;
        const userText = username !== undefined ? "Logged in as " + username : "Not logged in";
        return (
            <div className="navigation-container">
                <div className="header-bar">
                    <div className="header-bar-name">AlphaPro</div>
                    <div className="header-bar-user">{userText}</div>
                </div>
                <div className="tab-bar">
                    <div
                        className={this.getTabClass(takeAttendanceView)}
                        onClick={setTakeViewState(true)}>Take Attendance
                    </div>
                    <div className={this.getTabClass(!takeAttendanceView)}
                         onClick={setTakeViewState(false)}>View Attendance Records
                    </div>
                </div>
            </div>
        );
    }

    getTabClass(active) {
        return active ? "tab-bar__btn--active" : "tab-bar__btn";
    }
}