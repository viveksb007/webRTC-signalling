import React from "react";
import {Card, CardMedia} from "@material-ui/core";

class VideoChat extends React.Component {

    constructor(props) {
        super(props);
        this.videoRef = React.createRef();
    }

    componentDidMount() {
        navigator.mediaDevices.getUserMedia({video: true, audio: true})
            .then(this.handleVideo)
            .catch(this.videoError);
    }

    handleVideo = (stream) => {
        this.videoRef.current.srcObject = stream;
    }

    videoError = (err) => {
        alert(err.name);
    }

    render() {
        const videoStyle = {
            width: 300,
            height: 300
        };
        return (
            <Card style={videoStyle}>
                <CardMedia>
                    <video id="video-chat" ref={this.videoRef} autoPlay={true} style={videoStyle}/>
                </CardMedia>
            </Card>
        );
    }

}

export default VideoChat;