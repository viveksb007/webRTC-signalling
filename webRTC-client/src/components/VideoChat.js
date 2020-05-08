import React from "react"

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
        return (<video id="video-chat" ref={this.videoRef} autoPlay={true}/>);
    }

}

export default VideoChat;