import {
    Box, Button, FormControl, FormControlLabel, Grid, Hidden, InputLabel, makeStyles,
    MenuItem, Select, Switch,
    TextField
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/Save';
import { Skeleton } from '@material-ui/lab';
import { DatePicker } from '@material-ui/pickers';
import add from 'date-fns/add';
import isDate from 'date-fns/isDate';
import parseISO from 'date-fns/parseISO';
import log from 'loglevel';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StruttureEventiAPI } from '../../../api/strutture.eventi.api';
import { StruttureUtentiAPI } from '../../../api/strutture.utenti.api';

const _logger = log.getLogger('AbbonamentiUtente');

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: "35px",
        paddingTop: "15px",
        paddingBottom: "15px"
    },
    container: {
        paddingTop: 15
    },
    gridContainer: {
        paddingLeft: 10
    },
    formControlTipoAbbonamento: {
        // marginTop: "16px",
        // marginBottom: "8px",
        minWidth: "180px",
        width: "90%"
    },
    switchLabel: {
        paddingTop: 10
    },
    gridButtons: {
        paddingTop: "20px"
    },
    btnSalva: {
        margin: '20px'
    },
    btnAnnulla: {
        margin: '20px'
    }
}));
/***
 * Componente per l'aggiunta di un nuovo abbonamento ad un Utente
 */
const AbbonamentiUtenteAdd = (props) => {
    const classes = useStyles();
    const idStruttura = props.idStruttura;
    const idUtente = props.idUtente;
    const abbonamentoUtente = props.abbonamentoUtente ?? {};
    const onChangeHandler = props.onChangeHandler;

    _logger.debug(`onChangeHandler: ${onChangeHandler}`);

    const onCancelHandler = props.onCancelHandler;

    const initialValues = {
        idTipoAbbonamento: '', //Lo valoriziamo dopo che ritorna la chiamata all'API altrimenti otteniamo un warning perché non sono ancora stati caricati i valori della select
        dataInizioValidita: abbonamentoUtente?.dataInizioValidita ?? null,
        scadenza: abbonamentoUtente?.scadenza ?? null,
        ingressiIniziali: abbonamentoUtente?.ingressiIniziali ?? '',
        ingressiResidui: abbonamentoUtente?.ingressiResidui ?? '',
        importo: abbonamentoUtente?.importo ?? '',
        saldato: (abbonamentoUtente?.importo ?? 0) === (abbonamentoUtente?.importoPagato ?? 0)
    };

    _logger.debug(`initialValues: ${JSON.stringify(initialValues)}`);

    const { register, handleSubmit, control, reset, setValue, getValues } = useForm({
        defaultValues: initialValues
    });

    const [tipologieAbbonamenti, setTipologieAbbonamenti] = useState([]);
    const [tipologieAbbonamentiLoading, setTipologieAbbonamentiLoading] = useState(true);

    const [tipoAbbonamento, setTipoAbbonamento] = useState(abbonamentoUtente?.tipoAbbonamento ?? -1);
    const [minDataInizioValidita, setMinDataInizioValidita] = useState(abbonamentoUtente?.dataInizioValidita ?? new Date());


    useEffect(() => {
        //Recuperiamo le Tipologie di Abbonamento previsti
        async function fetchTipiAbbonamenti(idStruttura) {
            const data = await StruttureEventiAPI.FetchTipologieAbbonamentiAsync(idStruttura, 1, 50);
            _logger.debug(`AbbonamentiUtente->useEffect()->fetchTipiAbbonamenti(${idStruttura}) => ${JSON.stringify(data)}`);
            setTipologieAbbonamenti(data ?? []);
            setTipologieAbbonamentiLoading(false);
            initialValues.idTipoAbbonamento = abbonamentoUtente?.tipoAbbonamento?.id ?? '';
            reset(initialValues);
        }
        fetchTipiAbbonamenti(idStruttura);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idStruttura, idUtente])

    _logger.debug(`abbonamentoUtente: ${JSON.stringify(abbonamentoUtente)}`);

    const submitForm = async (data) => {
        _logger.debug(`Submitting form: ${JSON.stringify(data)}`)
        data.id = abbonamentoUtente?.id;
        data.idCliente = idStruttura;
        data.userId = idUtente;
        data.importoPagato = data.saldato ? data.importo : 0;
        _logger.debug(`Aggiunta Abbonamento Utente - idStruttura:${idStruttura}, idUtente: ${idUtente}`);
        await StruttureUtentiAPI.AddUpdateAbbonamentoUtenteAsync(idStruttura, idUtente, data);
        reset();
        onChangeHandler();
    }

    const handleTipoAbbonamentChanged = (event) => {
        const idTipoAbb = event.target.value;
        let tipoAbbonamento = tipologieAbbonamenti.find(item => item.id === idTipoAbb);
        if (!tipoAbbonamento) {
            _logger.warn(`Impossibile trovare il Tipo Abbonamento con Id: ${idTipoAbb}`);
        }
        const formDataInizio = getValues('inizioValidita');
        let localDataInizio = formDataInizio ? (isDate(formDataInizio) ? formDataInizio : parseISO(formDataInizio)) : new Date();
        setTipoAbbonamento(tipoAbbonamento);
        if (!formDataInizio) {
            setValue('inizioValidita', localDataInizio);
        }
        setValue('scadenza', add(localDataInizio, { months: tipoAbbonamento.durataMesi }));
    }

    const renderForm = () => {
        return (
            <form onSubmit={handleSubmit(submitForm)} noValidate>
                <Grid container className={classes.gridContainer}>
                    <Grid item xs={12} md={5}>
                        <FormControl className={classes.formControlTipoAbbonamento} required>
                            <InputLabel>Tipo Abbonamento</InputLabel>
                            <Controller
                                as={
                                    <Select
                                        onChange={handleTipoAbbonamentChanged}
                                    >
                                        {
                                            tipologieAbbonamenti?.map(t => (<MenuItem key={t.id} value={t.id}>{t.nome}</MenuItem>))
                                        }
                                    </Select>
                                }
                                control={control}
                                name="idTipoAbbonamento"
                                rules={{ required: "E' necessario selezionare un tipo abbonamento" }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>                      
                        <Controller
                                render={(props)=>(
                                        <DatePicker
                                            inputRef = {props.ref}
                                            onChange = {props.onChange}
                                            value = {props.value}
                                            margin="dense"
                                            required
                                            label='Inizio Validità'
                                            format="dd MMMM yyyy" />
                                )}
                                control={control}
                                name="dataInizioValidita"
                                rules={{required:"Inserire una data di Scadenza"}} 
                        />
                    </Grid>
                    <Hidden mdDown>
                        <Grid item md={1} />
                    </Hidden>
                    <Grid item xs={12} md={3}>
                         <Controller
                            render={(props)=>(
                                    <DatePicker
                                        inputRef = {props.ref}
                                        onChange = {props.onChange}
                                        value = {props.value}
                                        margin="dense"
                                        required
                                        label='Scadenza'
                                        format="dd MMMM yyyy" />
                            )}
                            control={control}
                            name="scadenza"
                            onChange={([selected]) => selected}
                            rules={{required:"Inserire una data di Scadenza"}} 
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField name='ingressiIniziali'
                            required
                            label='Numero Ingressi'
                            margin='dense'
                            type="number"
                            inputRef={register({required:"Inserire il numero di ingressi massimo (0 se non c'è un massimo)"})}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField name='ingressiResidui'
                            label='Ingressi Residui'
                            margin='dense'
                            type="number"
                            inputRef={register({required:"Inserire il numero di ingressi residui (0 se non c'è un massimo)"})}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField name='importo'
                            label='Prezzo'
                            margin='dense'
                            type="number"
                            inputRef={register({required:"Inserire il prezzo applicato per l'abbonamento"})}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControlLabel
                            className={classes.switchLabel}
                            margin="dense"
                            control={
                                <Switch
                                    name="saldato"
                                    color="primary"
                                    inputRef={register}
                                    //Il default value non funziona con gli switch, bisogna impostare esplicitamente il defaultChecked
                                    defaultChecked={initialValues.saldato}
                                />
                            }
                            label="Saldato"
                        />
                    </Grid>
                    <Grid item xs={12} style={{ textAlign: "center" }}>
                        <Box className={classes.gridButtons}>
                            <Button size="small" variant="contained"
                                type="submit"
                                color="primary"
                                startIcon={<SaveIcon />}
                                className={classes.btnSalva}>Salva</Button>

                            <Button size="small" variant="contained"
                                onClick={(e) => { reset(); if (onCancelHandler) { onCancelHandler() } }}
                                color="secondary"
                                startIcon={<ClearIcon />}
                                className={classes.btnAnnulla}>Annulla</Button>

                        </Box>
                    </Grid>
                </Grid>
            </form>
        )
    }
    return (
        <Box className={classes.root} boxShadow={3}>
            {tipologieAbbonamentiLoading ? <Skeleton variant="text" height={200} /> : renderForm()}
        </Box>
    )

}


export default AbbonamentiUtenteAdd;