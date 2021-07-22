import {
    Box,
    Fab,
    makeStyles,
    Paper,
    Typography, Button, Grid
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import InfoIcon from '@material-ui/icons/Info';
import log from 'loglevel';
import React, { useState } from 'react';
import CertificatiUtenteList from './CertificatiUtenteList';
import CertificatiUtenteAdd from './CertificatoUtenteAdd';

const _logger = log.getLogger('AbbonamentiUtenteSection');

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(1),
        margin: theme.spacing(3, 0, 0, 0),
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

const CertificatiUtenteSection = (props) => {
    const idStruttura = props.idStruttura;
    const idUtente = props.idUtente;
    const certificati = props.certificati;
    const reloadHandler = props.reloadHandler;
    const classes = useStyles();

    const [editMode, setEditMode] = useState(false);
    const [certificatoSelezionato, setCertificatoSelezionato] = useState(null);

    _logger.debug(`CertificatiUtenteSection -> idStruttura: ${idStruttura}, idUtente: ${idUtente}`);

    const handleEditCertificato = (idCertificato) => {
        if (!idCertificato) { return; }
        let certificato = certificati?.find(a => a.id === idCertificato);
        _logger.debug(`handleEditCertificato - idCertificato: ${idCertificato}, Certificato: ${JSON.stringify(certificato)}`);
        setCertificatoSelezionato(certificato);
        setEditMode(true);
    }

    const handleCertificatiChange = ()=>{
        if(reloadHandler){reloadHandler();}
        setEditMode(false);
    }

    return (
        <Paper className={classes.root}>
             <Box container className={classes.headerTitle}>
             <Grid xs={12} md={1}>
                <Button className={classes.headerButton}>
                    STORICO
                </Button></Grid>
                <Grid xs={12} md={10}>
                <Typography variant="h6">Certificato medico</Typography></Grid>
                {/* {!editMode ? 
                    <Fab color="primary" size="small" aria-label="add"
                        className={classes.fabAdd}
                        onClick={(e)=>{setCertificatoSelezionato(null); setEditMode(!editMode); _logger.debug(`editMode: ${editMode}`)}}>  
                        <AddIcon />
                        </Fab> : "" } */}
                <Grid xs={12} md={1}><InfoIcon style={{ fontSize: 40, color: 'grey' }} ></InfoIcon></Grid>
            </Box>
            
            
            {!editMode ? 
                <CertificatiUtenteList idStruttura={idStruttura} idUtente={idUtente} certificati={certificati} certificatoUtente={certificatoSelezionato} 
                    onChangeHandler={handleCertificatiChange} onEditHandler={handleEditCertificato}/> :
                <CertificatiUtenteAdd idStruttura={idStruttura} idUtente={idUtente} certificatoUtente={certificatoSelezionato} 
                                    onCancelHandler={()=>{setEditMode(false);}}
                                    onChangeHandler={handleCertificatiChange}/>
            }              
        </Paper>
    )

}

export default CertificatiUtenteSection;