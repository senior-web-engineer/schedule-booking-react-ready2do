import log from 'loglevel'
import React, { Fragment } from 'react'
import { Paper, makeStyles } from '@material-ui/core'
import UtenteProfiloEdit from './UtenteProfiloEdit'
import UtenteStruttureSeguite from './UtenteStruttureSeguite'

const _logger = log.getLogger('UtenteProfiloEdit');

const useStyles = makeStyles(theme => ({

}));


export default (props) =>{
    const classes = useStyles();

    return(
        <Fragment>
            <UtenteProfiloEdit/>
            <UtenteStruttureSeguite/>
        </Fragment>
    )

}