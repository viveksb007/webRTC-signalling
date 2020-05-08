import React from 'react';
import Messages from './Messages.js';
import Form from './Form.js';
import { Card, CardActions, CardContent } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { cardStyle } from '../styles.js';

class ChatBox extends React.Component {

    render() {
        const { classes } = this.props;
        return (<Card>
            <CardContent className={classes.cardcontent}>
                <Messages />
            </CardContent>
            <CardActions>
                <Form />
            </CardActions>
        </Card>
        );
    }
}

export default withStyles(cardStyle)(ChatBox);