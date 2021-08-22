/* eslint-disable import/no-anonymous-default-export */
import log from 'loglevel';
import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { makeStyles, Grid, TextField, Button, Paper, InputAdornment, Select, MenuItem } from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';
import { StruttureEventiAPI } from '../../api/strutture.eventi.api'
import R2DLoader from '../commons/R2DLoader'
import { useSnackbar } from 'notistack';

const _logger = log.getLogger('StrutturaEditTipologiaLezione');

const useStyles = makeStyles(theme => ({
    root: {
        minHeight: '400px',
        position: "relative"
    },
    form: {
        padding: '20px'
    },
    colorePickerLabel: {
        transform: 'translate(0, 1.5px) scale(0.75)',
        transformOrigin: 'top left'
    },
    colorePicker: {
        marginTop: '24px'
    },
    btnSalva: {
        marginTop: "50px",
        backgroundColor: "#E31F4F",
        color: "white",
        margin: 'auto',
    },
    errorMessage: {
        color: "red",
        fontSize: "0.7rem"
    }
}));


export default (props) => {
    const idStruttura = props.idStruttura;
    const urlRoute = props.urlRoute;

    let { idTipoLezione } = useParams(); //Leggiamo l'idLocation dall'url
    let history = useHistory();
    const [tipoLezioneIsLoading, setTipoLezioneIsLoading] = useState(true);
    const [tipoLezione, setTipoLezione] = useState(null);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const classes = useStyles();
    _logger.debug(`StrutturaEditTipologiaLezione - idStruttura:${idStruttura}, idTipoLezione: ${idTipoLezione}`);

    useEffect(() => {
        async function fetchLocation(idStruttura, idLocation) {
            const data = await StruttureEventiAPI.FetchTipologiaLezioneSingleAsync(idStruttura, idLocation);
            _logger.debug(`StrutturaEditTipologiaLezione->useEffect()->fetchedLocation(${idStruttura}, ${idLocation}) => ${JSON.stringify(data)}`);
            //facciamo l'override dei campi null per esigenze di Formik 
            if (data && (!data?.colore || data?.colore === '')) {
                data.maxPartecipanti = data.maxPartecipanti ?? '';
                data.limiteCancellazioneMinuti = data.limiteCancellazioneMinuti ?? '';
                data.prezzo = data.prezzo ?? '';
                data.descrizione = data.descrizione ?? '';
            }
            if (data.limiteCancellazioneMinuti >= 1440 &&
                Number.isInteger(data.limiteCancellazioneMinuti / (60 * 24))) {
                data.limiteCancellazioneUM = 'd';
                data.limiteCancellazioneMinuti = data.limiteCancellazioneMinuti / (60 * 24);
            }
            else if ((data.limiteCancellazioneMinuti > 60) &&
                Number.isInteger(data.limiteCancellazioneMinuti / 60)) {
                data.limiteCancellazioneUM = 'h';
                data.limiteCancellazioneMinuti = data.limiteCancellazioneMinuti / 60;
            } else {
                data.limiteCancellazioneUM = 'm';
            }
            setTipoLezione(data)
            setTipoLezioneIsLoading(false);
        }
        if (idStruttura > 0 && !isNaN(idTipoLezione) && idTipoLezione > 0) {
            fetchLocation(idStruttura, idTipoLezione);
        } else if (idStruttura > 0 && isNaN(idTipoLezione)) {
            //Inizializiamo un oggetto vuoto per gestire il caso di nuova location
            setTipoLezione({
                id: -1,
                idCliente: idStruttura,
                nome: '',
                descrizione: '',
                durata: '',
                maxPartecipanti: '',
                limiteCancellazioneMinuti: '',
                limiteCancellazioneUM: 'h', //Campo fittizio 
                livello: '',
                prezzo: ''
            });
            setTipoLezioneIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idStruttura, idTipoLezione]);

    const handleFormSubmmit = async (values, actions) => {
        _logger.debug(`StrutturaEditTipologiaLezione->FormSubmit() - values: ${JSON.stringify(values)}`);
        let payload = Object.assign({}, values);
        if (payload.maxPartecipanti === '') { payload.maxPartecipanti = null; }
        if (payload.limiteCancellazioneMinuti === '') { payload.limiteCancellazioneMinuti = null; }
        if (payload.prezzo === '') { payload.prezzo = null; }
        if (payload.livello === '') { payload.livello = 0; }
        if (payload.limiteCancellazioneMinuti > 0) {
            switch (payload.limiteCancellazioneUM) {
                case 'h':
                    payload.limiteCancellazioneMinuti = payload.limiteCancellazioneMinuti * 60;
                    break;
                case 'd':
                    payload.limiteCancellazioneMinuti = payload.limiteCancellazioneMinuti * 60 * 24;
                    break;
                default: // Già minuti
                    break;
            }
        }
        delete payload.limiteCancellazioneUM;
        delete payload.dataCreazione;

        const esito = await StruttureEventiAPI.SaveTipologiaLezioneAsync(idStruttura, payload);
        actions.setSubmitting(false); //NOTA: essendo async non è tecnicamente necessaria questa chiamata, la fa Formik implicitamente
        if (esito) {
            enqueueSnackbar('Tipologia lezione salvata', {variant:'success'});
            history.goBack(`/${urlRoute}/locations`);
        }else{
            enqueueSnackbar('Errore nel salvataggio', {variant:'error'});
        }
    }


    function isFetchingInProgress() {
        return tipoLezioneIsLoading;
    }

    async function formValidateAsync(values) {
        const errors = {}
        if (!values.nome) {
            errors.nome = "E' necessario specificare il nome";
        }
        else if (!await StruttureEventiAPI.TipologiaLezioneCheckNomeAsync(idStruttura, values.id, values.nome)) {
            errors.nome = "Esiste già una tipologia lezione con questo nome";
        }
        if (!values.durata && values.durata !== 0) {
            errors.durata = "Campo obbligatorio";
        } else if (values.durata <= 0) {
            errors.durata = "Durata non valida"
        }

        if (values.maxPartecipanti === 0 || values.maxPartecipanti < 0) {
            errors.maxPartecipanti = "Valore non valido"
        }
        _logger.debug(`StrutturaEditTipologiaLezione->formValidateAsync() - errors: ${JSON.stringify(errors)}`);
        return errors;
    }

    function renderForm() {
        return (
            <Formik
                initialValues={tipoLezione}
                enableReinitialize={true}
                validateOnChange={false}
                onSubmit={handleFormSubmmit}
                validate={formValidateAsync}
            >
                {
                    (props, form) => (
                        <Form onSubmit={props.handleSubmit} autoComplete="off" className={classes.form}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <TextField name='nome'
                                        label='Tipologia lezione *'
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.nome}
                                        fullWidth
                                        margin='normal'
                                    />
                                    <ErrorMessage className={classes.errorMessage} component="div" name="nome" />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField name='durata'
                                        label='Durata *'
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.durata}
                                        InputProps={{ endAdornment: <InputAdornment position="end">(minuti)</InputAdornment> }}
                                        margin='normal'
                                        type="number"
                                    />
                                    <ErrorMessage className={classes.errorMessage} component="div" name="durata" />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField name='maxPartecipanti'
                                        label='Limite partecipanti'
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.maxPartecipanti}

                                        margin='normal'
                                        type="number"
                                    />
                                    <ErrorMessage className={classes.errorMessage} component="div" name="maxPartecipanti" />
                                </Grid>
                                <Grid item xs={4} />
                                <Grid item xs={4}>
                                    <TextField name='limiteCancellazioneMinuti'
                                        label='Preavviso Cancellazione'
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.limiteCancellazioneMinuti}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">
                                                <Select name='limiteCancellazioneUM'
                                                    value={props.values.limiteCancellazioneUM}
                                                    onChange={props.handleChange}
                                                >
                                                    <MenuItem value="m">Minuti</MenuItem>
                                                    <MenuItem value="h">Ore</MenuItem>
                                                    <MenuItem value="d">Giorni</MenuItem>
                                                </Select>
                                            </InputAdornment>
                                        }}
                                        margin='normal'
                                        type="number"
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField name='prezzo'
                                        label='Prezzo'
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.prezzo}
                                        InputProps={{ endAdornment: <InputAdornment position="end">(€)</InputAdornment> }}
                                        margin='normal'
                                        type="number"
                                    />
                                </Grid>
                                <Grid item xs={4} />
                                <Grid item xs={12}>
                                    <TextField name='descrizione'
                                        label='Descrizione'
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.descrizione}
                                        fullWidth
                                        margin='normal'
                                        multiline
                                    />
                                </Grid>

                                <Grid item xs={12} style={{ textAlign: "center" }}>
                                    <Button size="large" variant="contained"
                                        type="submit"
                                        className={classes.btnSalva}>Salva</Button>
                                </Grid>
                            </Grid>
                        </Form>
                    )
                }
            </Formik>
        )
    }

    function renderLoading() {
        return (
            <R2DLoader/>
        )
    }

    return (
        <Paper className={classes.root}>
            {!isFetchingInProgress() ? renderForm() : renderLoading()}
        </Paper>
    );

}