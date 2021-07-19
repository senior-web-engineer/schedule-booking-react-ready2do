import React from 'react'
import { Paper, Typography, makeStyles, TextField, Grid, Card, Tooltip, Box, Button } from '@material-ui/core'
import InfoIcon from '@material-ui/icons/Info';
import { StruttureAPI } from '../../api/strutture.api';
import log from 'loglevel';

const _logger = log.getLogger('RegistrazioneStrutturaStep1');

const useStyles = makeStyles(theme => ({
    root: {
        margin: 15,
        padding: 20
    },
    registrationField: {
        width: '90%'
    },
    tooltipIcon: {
        float: "right",
        color: '#6b6c6e',
        // paddingTop: 5,
        margin: 'auto',
        height: '100%'
    },
    actionsRow: {
        textAlign: "center"
    },
    buttonBack: {
        minWidth: '120px',
        minHeight: '50px',
        marginTop: '60px',
        float:'left'
    },
    buttonNext: {
        minWidth: '320px',
        minHeight: '50px',
        marginTop: '60px',
        float:'right'
    }

}));

export default (props) => {
    const MIN_URLROUTE_LENGTH = 4;
    const MIN_NOME_STRUTTURA_LENGTH = 3;
    const MIN_DESCRIZIONE_LENGTH = 30;

    const classes = useStyles();

    const onDataSubmittedHandler = props.onDataSubmittedHandler;
    const onBack = props.onBack;

    const [nomeStruttura, setNomeStruttura] = React.useState(props?.datiStruttura?.nomeStruttura ?? '');
    const [urlRoute, seturlRoute] = React.useState(props?.datiStruttura?.urlRoute ?? '');
    const [descrizione, setDescrizione] = React.useState(props?.datiStruttura?.descrizione ?? '');

    const [urlRouteValid, seturlRouteValid] = React.useState(true);
    const [urlRouteErrorMessage, seturlRouteErrorMessage] = React.useState('');
    const [nomeStrutturaValid, setNomeStrutturaValid] = React.useState(true);
    const [nomeStrutturaErrorMessage, setNomeStrutturaErrorMessage] = React.useState('');
    const [descrizioneValid, setDescrizioneValid] = React.useState(true);
    const [descrizioneErrorMessage, setDescrizioneErrorMessage] = React.useState('');

    React.useEffect(() => {
        async function checkurlRoute(urlRoute) {
            _logger.debug(`Verifica Url: ${urlRoute}`);
            const esito = await StruttureAPI.CheckUrlStruttura(urlRoute);
            _logger.debug(`Esito verifica Url: ${urlRoute} = ${esito}`);
            seturlRouteValid(esito);
            if (!esito) {
                _logger.debug(`Esito non valido, imposto il messaggio di errore`);
                seturlRouteErrorMessage("L'identitificativo inserito non è valido oppure risulta già utilizzato");
            } else {
                _logger.debug(`Esito valido.`);
                seturlRouteErrorMessage(""); //reset messaggio d'errore
            }
        }
        if (urlRoute && urlRoute.length >= MIN_URLROUTE_LENGTH) {
            checkurlRoute(urlRoute);
        }
    }, [urlRoute]);


    const handleChange = async (syntEvent, fieldName) => {
        const newValue = syntEvent.target.value;
        switch (fieldName) {
            case 'NOME_STRUTTURA':
                setNomeStruttura(newValue);
                break;
            case 'urlRoute_STRUTTURA':
                seturlRoute(newValue);
                break;
            case 'DESCRIZIONE_STRUTTURA':
                setDescrizione(newValue);
                break;
            default:
                throw new Error('INVALID FIELD NAME');
        }
        ValidateFields();
    }

    const ValidateFields = () => {
        _logger.debug(`Inizio validazione form. urlRouteValid: ${urlRouteValid}, nomeStrutturaValid: ${nomeStrutturaValid}, descrizioneValid: ${descrizioneValid}`)
        if (!(nomeStruttura && nomeStruttura.length >= MIN_NOME_STRUTTURA_LENGTH)) {
            setNomeStrutturaValid(false);
            setNomeStrutturaErrorMessage(`Inserire un nome di almento ${MIN_NOME_STRUTTURA_LENGTH} caratteri`);
            return false;
        }else{
            setNomeStrutturaValid(true);
            setNomeStrutturaErrorMessage(null);
        }
        if (!(urlRoute && urlRoute.length >= MIN_URLROUTE_LENGTH)) {
            seturlRouteValid(false);
            seturlRouteErrorMessage(`Inserire un identificativo di almeno ${MIN_URLROUTE_LENGTH} caratteri`);
            return false;
        }else{
            seturlRouteValid(true);
            seturlRouteErrorMessage(null);
        }
        if (!(descrizione && descrizione.length >= MIN_DESCRIZIONE_LENGTH)) {
            setDescrizioneValid(false);
            setDescrizioneErrorMessage("La descrizione della struttura risulta troppo breve")
            return false;
        }else{
            setDescrizioneValid(true);
            setDescrizioneErrorMessage(null)
        }

        return true;
    }

    const handleOnNext = async (syntEvent) => {
        if (!ValidateFields()) { return; }
        if (onDataSubmittedHandler) {
            onDataSubmittedHandler(0, 
                {
                nome: nomeStruttura,
                urlRoute,
                descrizione
            });
        }
    }

    const handleOnBack = (e) => {
        if (onBack) { onBack(0); }
    }

    return (
        <Box className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        className={classes.registrationField}
                        label="Nome della Struttura"
                        error={!nomeStrutturaValid}
                        helperText={nomeStrutturaErrorMessage}
                        value={nomeStruttura}
                        onChange={(e) => { handleChange(e, 'NOME_STRUTTURA') }}
                    />
                    <Tooltip title="Inserire il nome della struttura così come sarà visualizzato nel profilo">
                        <InfoIcon className={classes.tooltipIcon} fontSize="large" />
                    </Tooltip>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        className={classes.registrationField}
                        label="Identificativo WEB della Struttura"
                        error={!urlRouteValid}
                        helperText={urlRouteErrorMessage}
                        value={urlRoute}
                        onChange={(e) => { handleChange(e, 'urlRoute_STRUTTURA') }}
                    />
                    <Tooltip title="Inserire l'identificativo utilizzato per costrutire l'indirizzo web a cui sarà raggiungibile la struttura. Ad esempio, inserendo l'identificato palestra-prova, l'indirizzo della struttura sarà https://www.ready2do/palestra-prova">
                        <InfoIcon className={classes.tooltipIcon} fontSize="large" />
                    </Tooltip>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        className={classes.registrationField}
                        label="Descrizione della Struttura"
                        error={!descrizioneValid}
                        helperText={descrizioneErrorMessage}
                        value={descrizione}
                        multiline
                        rows= {4}
                        onChange={(e) => { handleChange(e, 'DESCRIZIONE_STRUTTURA') }}
                    />
                    <Tooltip title="Inserire un testo descrittivo della struttura che sarà visulizzato nel profilo.">
                        <InfoIcon className={classes.tooltipIcon} fontSize="large" />
                    </Tooltip>
                </Grid>
                <Grid item xs={12} className={classes.actionsRow}>
                <Button variant="contained" color="secondary" className={classes.buttonBack}
                        onClick={handleOnBack}
                    >Annulla</Button>
                    <Button variant="contained" color="primary" className={classes.buttonNext}
                        onClick={handleOnNext}
                    >Avanti</Button>
                </Grid>
            </Grid>
        </Box>
    )
}