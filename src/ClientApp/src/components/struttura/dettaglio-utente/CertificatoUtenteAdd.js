import {
    Box, Button, Grid, Hidden, makeStyles, TextField
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/Save';
import { DatePicker } from '@material-ui/pickers';
import log from 'loglevel';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StruttureUtentiAPI } from '../../../api/strutture.utenti.api';

const _logger = log.getLogger('AbbonamentiUtente');

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: "35px",
        paddingTop: "15px",
        paddingBottom: "15px"
    },
    gridContainer: {
        paddingLeft: 20,
        paddingRight: 20
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
 * Componente per l'aggiunta di un nuovo Certificato ad un Utente
 */
const CertificatoUtenteAdd = (props) => {
    const classes = useStyles();
    const idStruttura = props.idStruttura;
    const idUtente = props.idUtente;
    const certificatoUtente = props.certificatoUtente ?? {};
    const onChangeHandler = props.onChangeHandler;
    const onCancelHandler = props.onCancelHandler;

    const initialValues = {
        dataPresentazione: certificatoUtente?.dataPresentazione ?? null,
        dataScadenza: certificatoUtente?.dataScadenza ?? null,
        note: certificatoUtente?.note
    };

    _logger.debug(`initialValues: ${JSON.stringify(initialValues)}`);

    const { handleSubmit, control, reset, register } = useForm({
        defaultValues: initialValues
    });


    const submitForm = async (data) => {
        _logger.debug(`Submitting form: ${JSON.stringify(data)}`)
        data.id = certificatoUtente?.id;
        data.idCliente = idStruttura;
        data.userId = idUtente;
        _logger.debug(`Aggiunta Certificato Utente - idStruttura:${idStruttura}, idUtente: ${idUtente}, Certificato: ${JSON.stringify(data)}`);
        await StruttureUtentiAPI.AddUpdateCertificatoUtenteAsync(idStruttura, idUtente, data);
        reset();
        if (onChangeHandler) { onChangeHandler() };
    }

    const renderForm = () => {
        return (
            <form onSubmit={handleSubmit(submitForm)} noValidate>
                <Grid container className={classes.gridContainer} spacing={2}>
                    <Grid item xs={12} md={3}>
                        <Controller
                            render={(props)=>(
                                <DatePicker
                                    inputRef = {props.ref}
                                    onChange = {props.onChange}
                                    value = {props.value}
                                    margin="dense"
                                    required
                                    label='Data Presentazione'
                                    format="dd MMMM yyyy" />
                            )}
                            control={control}
                            name="dataPresentazione"
                            rules={{ required: "Inserire la data di Presentazione" }}
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
                            name="dataScadenza"
                            rules={{ required: "Inserire una data di Scadenza" }}
                        />
                    </Grid>
                    <Hidden mdDown>
                        <Grid item md={5} />
                    </Hidden>
                    <Grid item xs={12}>
                        <TextField 
                            name='note'
                            label='Note'
                            margin='dense'
                            fullWidth
                            multiline
                            inputRef={register}
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
            {renderForm()}
        </Box>
    )

}


export default CertificatoUtenteAdd;