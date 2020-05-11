import React from 'react';
import {MESSAGE_RECEIVED} from '../service/events.js';
import Emitter from '../service/emitter.js';
import {List, ListItem, ListItemText} from '@material-ui/core';

class Messages extends React.Component {


    constructor(props) {
        super(props);
        this.messagesEnd = React.createRef();
        this.state = {
            messages: []
        };
    }

    componentDidMount() {
        Emitter.on(MESSAGE_RECEIVED, payload => {
            this.setState({ messages: [...this.state.messages, payload] });
        });
    }

    scrollToBottom = () => {
        this.messagesEnd.current.scrollIntoView({ behavior: "smooth" });
    }

    componentDidUpdate() {
        this.scrollToBottom();
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
                <div ref={this.messagesEnd}/>
            </List>
        );
    }
}

export default Messages;