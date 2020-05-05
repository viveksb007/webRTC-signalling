import React from 'react';
import { MESSAGE_RECEIVED } from '../service/events.js';
import Emitter from '../service/emitter.js';
import { List, ListItem, ListItemText } from '@material-ui/core';

class Messages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: []
        };
    }
    componentDidMount() {
        Emitter.on(MESSAGE_RECEIVED, payload => {
            this.setState({ messages: [...this.state.messages, payload] });
        });
    }

    render() {
        let newMessages = this.state.messages;
        return (
            <List>
                {
                    newMessages.map((message) =>
                        <ListItem>
                            <ListItemText
                                primary={message.message}
                                secondary={message.user}
                            />
                        </ListItem>
                    )
                }
            </List>
        );
    }
}

export default Messages;