import { createMuiTheme } from '@material-ui/core/styles';
import { lightBlue } from "@material-ui/core/colors";

export const theme = createMuiTheme({
    palette: {
        primary: {
            main: lightBlue[100]
        },
        secondary: {
            main: '#f44336',
        },
    },
});

export const cardStyle = ({
    cardcontent: {
        height: "40vh",
        width: "auto",
        overflow: "scroll",
        backgroundColor: lightBlue[100]
    },
});