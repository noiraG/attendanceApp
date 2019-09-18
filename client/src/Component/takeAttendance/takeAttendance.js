import React from "react";
import "./styles.scss"

class TakeAttendance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            course: ""
        };
    }

    componentWillMount() {
        if (navigator.getUserMedia) {
            navigator.getUserMedia({video: true}, ((stream)=> {
                const video = document.getElementById('vid')
                video.srcObject=stream
            }), (function (e) {
                console.log("Something went wrong!");
            }))
        }
    }

    render() {
        return (
            <div>
                <div>Input your Course Code</div>
                <input type="text" value={this.state.course} onChange={(e) => this.setState({course: e.target.value})}/>
                <video className="video-feed" id="vid" autoPlay muted/>
                {/*<canvas id="overlay"/>*/}
                {/*<input type="file" onChange={this.fileSelectedHandler}></input>*/}
                {/*<button>Upload</button>*/}
            </div>
        );
    }
}

export default TakeAttendance;
