import React from "react";
import "./styles.scss";
import { TAB_CONSTANTS } from "../../constants";

export default class NavigationBar extends React.PureComponent {
  render() {
    const { username, selectedTab, setTabSelected, authenticated } = this.props;
    const userText = authenticated
      ? "Logged in as " + username
      : "Not logged in";
    return (
      <div className="navigation-container">
        <div className="header-bar">
          <div className="header-bar-name">AlphaPro</div>
          <div className="header-bar-user">{userText}</div>
        </div>
        {authenticated && (
          <div className="tab-bar">
            <div
              className={this.getTabClass(
                selectedTab === TAB_CONSTANTS.TAKE_ATTENDANCE
              )}
              onClick={setTabSelected(TAB_CONSTANTS.TAKE_ATTENDANCE)}
            >
              Take Attendance
            </div>
            <div
              className={this.getTabClass(
                selectedTab === TAB_CONSTANTS.VIEW_ATTENDANCE
              )}
              onClick={setTabSelected(TAB_CONSTANTS.VIEW_ATTENDANCE)}
            >
              View Attendance Records
            </div>
            {this.props.admin && (
              <div
                className={this.getTabClass(
                  selectedTab === TAB_CONSTANTS.VIEW_SESSION
                )}
                onClick={setTabSelected(TAB_CONSTANTS.VIEW_SESSION)}
              >
                View Class Session
              </div>
            )}
            {this.props.admin && (
              <div
                className={this.getTabClass(
                  selectedTab === TAB_CONSTANTS.VIEW_STUDENT
                )}
                onClick={setTabSelected(TAB_CONSTANTS.VIEW_STUDENT)}
              >
                View Student Account
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  getTabClass(active) {
    return active ? "tab-bar__btn--active" : "tab-bar__btn";
  }
}
