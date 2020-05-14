import React from "react";
import { Card, CardActions, CardMedia } from "@material-ui/core";
import { Mic, MicOff, Videocam, VideocamOff } from "@material-ui/icons";
import Container from "@material-ui/core/Container";

class VideoChat extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            audio: true,
            video: true,
            stream: null
        };
        this.videoRef = React.createRef();
    }

    componentDidMount() {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(this.handleVideo)
            .catch(this.videoError);
    }

    componentDidUpdate() {
        this.videoRef.current.srcObject = this.state.stream;
    }

    handleVideo = (src) => {
        this.setState({ stream: src }, () => {
            this.videoRef.current.srcObject = this.state.stream;
        });
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
        const { stream, video } = this.state
        this.setState({
            video: !video,
        }, () => {
            let tracks = stream.getTracks();
            if (!this.state.video) {
                tracks.filter(track => track.kind === "video").map(filteredTrack => filteredTrack.enabled = false);
            } else {
                tracks.filter(track => track.kind === "video").map(filteredTrack => filteredTrack.enabled = true);
            }
        });
    }

    render() {
        const videoStyle = {
            width: "100%",
            height: "100%"
        };
        return (
            <Container maxWidth="xs" style={{ float: "left" }}>
                <Card variant="outlined">
                    <CardMedia src="video">
                        <video id="video-chat" ref={this.videoRef} muted={!this.state.audio} autoPlay={true} style={videoStyle} />
                    </CardMedia>
                    <CardActions>
                        {this.state.audio ? <Mic fontSize="large" onClick={this.switchAudio} /> :
                            <MicOff fontSize="large" onClick={this.switchAudio} />}
                        {this.state.video ? <Videocam fontSize="large" onClick={this.switchVideo} /> :
                            <VideocamOff fontSize="large" onClick={this.switchVideo} />}
                    </CardActions>
                </Card>
            </Container>
        );
    }

}

export default VideoChat;