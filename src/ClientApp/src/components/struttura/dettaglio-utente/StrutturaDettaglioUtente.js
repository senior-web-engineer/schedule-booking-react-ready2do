import { Box, Grid, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import log from 'loglevel';
import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { StruttureUtentiAPI } from '../../../api/strutture.utenti.api';
import AbbonamentiUtenteSection from './AbbonamentiUtenteSection';
import CertificatiUtenteSection from './CertificatiUtenteSection';
import PrenotazioniUtenteSection from './PrenotazioniUtenteSection';
import InfoIcon from '@material-ui/icons/Info';
import { Container } from '@material-ui/core';

const _logger = log.getLogger('StrutturaEditEvento')
const useStyles = makeStyles(theme => ({
    image:{
        marginTop: '8px',
        marginBottom: '8px',
        width: 'inherit'
    },
    paper:{
        marginTop: '16px',
    },
    grid:{
        padding: '12px'
    }
}));

const StrutturaDettaglioUtente = (props) => {
    const classes = useStyles();
    const idStruttura = props.idStruttura;
    //Recuperiamo i parametri dall'url
    let { idUtente } = useParams();
    const [utenteStrutturaIsLoading, setUtenteStrutturaIsLoading] = useState(true);
    const [utenteStruttura, setUtenteStruttura] = useState(null);
    const [utenteAssociazioneIsLoading, setUtenteAssociazioneIsLoading] = useState(true);
    const [utenteAssociazione, setUtenteAssociazione] = useState(null);
    const [reloadNeeded, setReloadNeeded] = useState(false);

    _logger.debug(`StrutturaDettaglioUtente -> idStruttura: ${idStruttura}, idUtente: ${idUtente}`);

    //Lettura profilo utente
    useEffect(() => {
        async function fetchProfiloUtente(idStruttura, idUtente) {
            const data = await StruttureUtentiAPI.FetchProfiloUtenteAsync(idStruttura, idUtente);
            _logger.debug(`StrutturaEditLocation->useEffect()->fetchProfiloUtente(${idStruttura}, ${idUtente}) => ${JSON.stringify(data)}`);
            setUtenteStruttura(data)
            setUtenteStrutturaIsLoading(false);
        }
        fetchProfiloUtente(idStruttura, idUtente);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idStruttura, idUtente]);

    //Lettura Associazione Utente
    useEffect(() => {
        async function fetchAssociazioneUtente(idStruttura, idUtente) {
            const data = await StruttureUtentiAPI.FetchDettagliAssociazioneUtenteAsync(idStruttura, idUtente);
            _logger.debug(`StrutturaEditLocation->useEffect()->fetchAssociazioneUtente(${idStruttura}, ${idUtente}) => ${JSON.stringify(data)}`);
            setUtenteAssociazione(data)
            setUtenteAssociazioneIsLoading(false);
            setReloadNeeded(false);
        }
        fetchAssociazioneUtente(idStruttura, idUtente);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idStruttura, idUtente, reloadNeeded]);
    

    //Quando vengono modificati i dati dell'associzione rileggiamo tutto dalle API
    const handleAssociazioneChange = () =>{
        _logger.debug(`StrutturaDettaglioUtente->handleAssociazioneChange(): setReloadNeeded = true`);
        setReloadNeeded(true);
    }

    return (
        <Fragment>
        {/* ads */}
        <Container>
            <img className={classes.image} src="/images/tinto.png" alt="tinto" />
        </Container>
        {/* SEZIONE DATI UTENTE */}
        <Paper className={classes.paper}>
            <Box >
                <Grid container spacing={3} className={classes.grid}>
                    <Grid item xs={12} md={1} >
                    </Grid>
                    <Grid item xs={12} md={10}>
                        <Grid container alignItems="center" justify="center" direction="column">
                            <Grid item xs={12}>
                                <Typography variant="h5" fontWeight="Bold">Dati Utente</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={1}>
                        <InfoIcon style={{ fontSize: 40, color: 'grey' }} ></InfoIcon>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography component="div">
                            <Box component="span" fontWeight="fontWeightBold" mr={1}>Nome:</Box>
                            <Box component="span">{utenteStruttura?.nome}</Box>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography component="div">
                            <Box component="span" fontWeight="fontWeightBold" mr={1}>Cognome:</Box>
                            <Box component="span">{utenteStruttura?.cognome}</Box>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Typography component="div">
                            <Box component="span" fontWeight="fontWeightBold" mr={1}>Nickname:</Box>
                            <Box component="span">{utenteStruttura?.displayName}</Box>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography component="div">
                            <Box component="span" fontWeight="fontWeightBold" mr={1}>Telefono mobile:</Box>
                            <Box component="span">{utenteStruttura?.telephoneNumber}</Box>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography component="div">
                            <Box component="span" fontWeight="fontWeightBold" mr={1}>Email:</Box>
                            <Box component="span">{utenteStruttura?.email}</Box>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={12}></Grid>
                    <Grid item xs={12} md={12}></Grid>
                    <Grid item xs={12} md={12}></Grid>
                </Grid>
            </Box>
        </Paper>

        {/* SEZIONE Abbonamenti */}
        <AbbonamentiUtenteSection idStruttura={idStruttura} idUtente={idUtente} abbonamenti={utenteAssociazione?.abbonamenti} reloadHandler={handleAssociazioneChange}/>

        {/* SEZIONE Certificati */}
        <CertificatiUtenteSection idStruttura={idStruttura} idUtente={idUtente} certificati={utenteAssociazione?.certificati} reloadHandler={handleAssociazioneChange} />

        {/* SEZIONE Prenotazioni */}
        <PrenotazioniUtenteSection idStruttura={idStruttura} idUtente={idUtente} prenotazioniConfermate={utenteAssociazione?.appuntamenti} 
                                    prenotazioniNonConfermate={utenteAssociazione?.appuntamentiDaConfermare} waitList = {utenteAssociazione?.appuntamentiInCoda}
                                    abbonamenti={utenteAssociazione?.abbonamenti} reloadHandler={handleAssociazioneChange} />
        <Container>
            <img className={classes.image} src="/images/tinto.png" alt="tinto" />
        </Container>
    </Fragment>
    )
}


export default StrutturaDettaglioUtente;