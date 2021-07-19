import useState from 'react'
import { Paper, Box } from '@material-ui/core'
import clsx from 'clsx';
import PropTypes from 'prop-types';
import * as log from 'loglevel';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme=>({
    root:{
        width:"300px",
        height:"300px"
    }
}));


export default (props) =>{
    const mode = props.mode ?? 'View'
    const classes = useStyles();
    const 
    //La modalità View è quella usata nella Home della struttura
    const renderViewMode = ()=>{
        return (
            <Box>
                <img src={logoUrl}></img>
            </Box>)
    }

    const renderEditMode = ()=>{

    }

    return(
        <Paper className={classes.root}>
         mode === 'View' ? renderViewMode() : renderEditMode()
         </Paper>
    )
} 