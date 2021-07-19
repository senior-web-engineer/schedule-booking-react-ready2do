import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardHeader, CardActions, CardContent } from '@material-ui/core';
// import CardActions from '@material-ui/core/CardActions';
// import CardContent from '@material-ui/core/CardContent';
// import CardHeader from '@material-ui/core/CardHeader';
import { Button } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import Fab from '@material-ui/core/Fab';

const useStyles = makeStyles(theme => ({
    card: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    cardHeaderTitle: {
        color: 'yellow',
    },   
    cardHeaderAction: {
        color: 'yellow',
    },  
    leftIcon: {
        marginRight: theme.spacing(1),
    },
}));

export default function R2DClienteStruttura() {
    const classes = useStyles();

    return (
        <Card className={classes.card}>
            <CardHeader classes={{ title: classes.cardHeaderTitle }}
                title="Nome della Struttura"
                avatar={
                    <Button variant="contained">
                        <EditIcon className={clsx(classes.leftIcon, classes.iconSmall)} />
                        Edit
                    </Button>
                }
                action={
                    <Fab size="small" color="default" className={classes.margin}>
                        <InfoIcon />
                    </Fab>
                }
            >
                    Header
            </CardHeader>
            <CardContent>
                Content
            </CardContent>
            <CardActions>
                <Button size="small">Learn More</Button>
            </CardActions>
        </Card>
    );
}