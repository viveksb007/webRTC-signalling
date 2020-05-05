import React from 'react';
import { SET_CHANNELS, MESSAGE_RECEIVED } from '../service/events.js';
import Emitter from '../service/emitter.js';
import { TextField, Button } from '@material-ui/core';

class Form extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataChannels: [],
            input: ""
        };
    }

    componentDidMount() {
        Emitter.on(SET_CHANNELS, (channels) => {
            this.setState({ dataChannels: channels })
        });
    }

    handleInputChange = e => {
        this.setState({ input: e.target.value });
    }

    sendMessage = () => {
        let value = this.state.input;
        let payload = {
            user: "me",
            message: value
        }

        this.state.dataChannels.forEach(channel => {
            channel.send(value);
        });

        this.setState({ input: "" }
            , () => Emitter.emit(MESSAGE_RECEIVED, payload));
    }

    render() {
        return (
            <form onSubmit={(e) => {
                e.preventDefault();
                this.sendMessage();
            }}>
                <TextField id="filled-full-width" label="Message" style={{ margin: 8 }}
                    placeholder="type here" fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    variant="outlined"
                    value={this.state.input} onChange={this.handleInputChange}
                />
                <Button variant="contained" color="secondary" type="button" onClick={this.sendMessage}> Send </Button>
            </form>
        );
    }
}

export default Form;