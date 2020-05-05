import React from 'react';
import Messages from './Messages.js';
import Form from './Form.js';
import { Card, CardActions, CardContent } from '@material-ui/core';
class ChatBox extends React.Component {
    render() {
        return (<Card>
            <CardContent>
                <Messages />
            </CardContent>
            <CardActions>
                <Form />
            </CardActions>
        </Card>
        );
    }
}

export default ChatBox;