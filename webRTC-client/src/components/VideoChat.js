import React from "react";
import {Card, CardActions, CardMedia} from "@material-ui/core";
import {Mic, MicOff, Videocam, VideocamOff} from "@material-ui/icons";
import Container from "@material-ui/core/Container";

class VideoChat extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            audio: true,
            video: true
        };
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

    switchAudio = () => {
        this.setState({
            audio: !this.state.audio,
        });
    }

    switchVideo = () => {
        this.setState({
            video: !this.state.video,
        });
    }

    render() {
        const videoStyle = {
            width: 300,
            height: 300
        };
        return (
            <Card variant="outlined">
                <Container maxWidth={"xs"}>
                    <CardMedia>
                        <video id="video-chat" ref={this.videoRef} autoPlay={true} style={videoStyle}/>
                    </CardMedia>
                    <CardActions>
                        {this.state.audio ? <Mic fontSize="large" onClick={this.switchAudio}/> :
                            <MicOff fontSize="large" onClick={this.switchAudio}/>}
                        {this.state.video ? <Videocam fontSize="large" onClick={this.switchVideo}/> :
                            <VideocamOff fontSize="large" onClick={this.switchVideo}/>}
                    </CardActions>
                </Container>
            </Card>
        );
    }

}

export default VideoChat;