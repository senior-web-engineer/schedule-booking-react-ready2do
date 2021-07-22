import {
    Box,
    Fab,
    Fade,
    makeStyles,
    Paper,
    Typography,
    Button,
    Grid
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import log from 'loglevel';
import React, { Fragment, useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import AbbonamentiUtenteList from './AbbonamentiUtenteList';
import AbbonamentiUtenteAdd from './AbbonamentoUtenteAdd';
import { grey } from '@material-ui/core/colors';

const _logger = log.getLogger('AbbonamentiUtenteSection');

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(1),
        margin: theme.spacing(4, 0, 0, 0),
        minHeight: 130
    },
    headerTitle: {
        flexGrow: 1,
        justifyContent: 'center',
        textAlign: 'center',
        display: 'flex'
    },
    headerButton: {
        backgroundColor: 'grey',
        color: 'white'
    },
    fabAdd:{
        float: 'right',
        marginRight: '20px'
        // right:'10px'
    }
}));

const AbbonamentiUtenteSection = (props) => {
    const idStruttura = props.idStruttura;
    const idUtente = props.idUtente;
    const abbonamenti = props.abbonamenti;
    const reloadHandler = props.reloadHandler;
    const classes = useStyles();

    const [editMode, setEditMode] = useState(false);
    const [abbonamentoSelezionato, setAbbonamentoSelezionato] = useState(null);

    _logger.debug(`AbbonamentiUtenteSection -> idStruttura: ${idStruttura}, idUtente: ${idUtente}`);

    const handleEditAbbonamento = (idAbbonamento) => {
        if (!idAbbonamento) { return; }
        let abbonamento = abbonamenti?.find(a => a.id === idAbbonamento);
        setAbbonamentoSelezionato(abbonamento);
        setEditMode(true);
    }

    const handleAbbonamentiChange = ()=>{
        setEditMode(false);
        if(reloadHandler){reloadHandler();}
    }

    return (
        <Paper className={classes.root}>
             <Box container className={classes.headerTitle}>
                <Grid xs={12} md={1}>
                <Button className={classes.headerButton}>
                    STORICO
                </Button></Grid>
                <Grid xs={12} md={10}>
                <Typography variant="h6">Abbonamenti</Typography></Grid>
                {/* {!editMode ? 
                    <Fab color="primary" size="small" aria-label="add"
                        className={classes.fabAdd}
                        onClick={(e)=>{setAbbonamentoSelezionato(null); setEditMode(!editMode); _logger.debug(`editMode: ${editMode}`)}}>  
                        <AddIcon />
                        </Fab> : "" } */}
                <Grid xs={12} md={1}><InfoIcon style={{ fontSize: 40, color: 'grey' }} ></InfoIcon></Grid>
            </Box>
            
            
            {!editMode ? 
                <AbbonamentiUtenteList idStruttura={idStruttura} idUtente={idUtente} abbonamenti={abbonamenti} abbonamentoUtente={abbonamentoSelezionato}
                    onChangeHandler={handleAbbonamentiChange} onEditAbbonamento={handleEditAbbonamento}/> :
                <AbbonamentiUtenteAdd idStruttura={idStruttura} idUtente={idUtente} abbonamentoUtente={abbonamentoSelezionato} 
                                    onCancelHandler={()=>{setEditMode(false);}}
                                    onChangeHandler={handleAbbonamentiChange}/>
            }              
        </Paper>
    )

}

export default AbbonamentiUtenteSection;