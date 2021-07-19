import log from 'loglevel';
import React, { useState, useEffect, Fragment } from 'react'
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import { makeStyles, Grid, TextField, InputAdornment, FormControl, InputLabel, Button, Paper } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { StruttureEventiAPI } from '../../api/strutture.eventi.api'
import { CirclePicker } from 'react-color';
import R2DLoader from '../commons/R2DLoader'
import { useHistory } from "react-router-dom";
import { useSnackbar } from 'notistack';

const _logger = log.getLogger('StrutturaEditLocation');

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
    let { idLocation } = useParams(); //Leggiamo l'idLocation dall'url
    const [locationIsLoading, setLocationIsLoading] = useState(true);
    const [location, setLocation] = useState(null);

    const classes = useStyles();
    let history = useHistory();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    useEffect(() => {
        async function fetchLocation(idStruttura, idLocation) {
            const data = await StruttureEventiAPI.FetchLocationSingleAsync(idStruttura, idLocation);
            _logger.debug(`StrutturaEditLocation->useEffect()->fetchedLocation(${idStruttura}, ${idLocation}) => ${JSON.stringify(data)}`);
            //facciamo l'override dei campi null per esigenze di Formik 
            if (data && (!data?.colore || data?.colore === '')) {
                data.colore = 'transparent';
                data.capienzaMax = data.capienzaMax ?? '';
                data.descrizione = data.descrizione ?? '';
                data.urlImage = data.urlImage ?? '';
                data.urlIcon = data.urlIcon ?? '';
            }
            setLocation(data)
            setLocationIsLoading(false);
        }
        if (idStruttura > 0 && !isNaN(idLocation) && idLocation > 0) {
            fetchLocation(idStruttura, idLocation);
        } else if (idStruttura > 0 && isNaN(idLocation)) {
            //Inizializiamo un oggetto vuoto per gestire il caso di nuova location
            setLocation({
                id: -1,
                idCliente: idStruttura,
                nome: '',
                descrizione: '',
                capienzaMax: '',
                colore: 'transparent',
                urlImage: '',
                urlIcon: ''
            });
            setLocationIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idStruttura, idLocation]);

    const handleFormSubmmit = async (values, actions) => {
        _logger.debug(`StrutturaEditLocation->FormSubmit() - values: ${JSON.stringify(values)}`);
        let payload = Object.assign({}, values);
        if (payload.capienzaMax === '') { payload.capienzaMax = null; }
        await StruttureEventiAPI.SaveLocationAsync(idStruttura, payload);
        actions.setSubmitting(false); //NOTA: essendo async non è tecnicamente necessaria questa chiamata, la fa Formik implicitamente
        enqueueSnackbar('Sala salvata', {variant:'success'});
        history.goBack();
    }


    function isFetchingInProgress() {
        return locationIsLoading;
    }

    async function formValidateAsync(values) {
        const errors = {}
        if (!values.nome) {
            errors.nome = "E' necessario specificare il nome";
        }

        _logger.debug(`StrutturaEditLocation->formValidateAsync() - errors: ${JSON.stringify(errors)}`);
        return errors;
    }

     /**
   * Stop enter submitting the form.
   * @param keyEvent Event triggered when the user presses a key.
   */
  function onKeyDown(keyEvent) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  }

    function renderForm() {
        return (
            <Formik
                initialValues={location}
                enableReinitialize={true}
                onSubmit={handleFormSubmmit}
                validate={formValidateAsync}
            >
                {
                    (props, form) => (
                        <Form onSubmit={props.handleSubmit} autoComplete="off" className={classes.form} onKeyDown={onKeyDown}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <TextField name='nome'
                                        label='Nome Location'
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.nome}
                                        fullWidth
                                        margin='normal'
                                    />
                                    <ErrorMessage className={classes.errorMessage} component="span" name="nome" />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField name='capienzaMax'
                                        label='Capienza'
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.capienzaMax}
                                        fullWidth
                                        margin='normal'
                                        type="number"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field name='colore'
                                        label='Colore Location'
                                    >
                                        {({ field, form }) =>
                                            (
                                                <FormControl fullWidth margin='normal'>
                                                    <InputLabel className={classes.colorePickerLabel}>{'Colore Location'}</InputLabel>
                                                    <CirclePicker className={classes.colorePicker} name={field.name}
                                                        color={field.value}
                                                        minDate={new Date()}
                                                        label='Colore Sala'
                                                        value={field.value}
                                                        width="100%"
                                                        onChangeComplete={(colore, event) => form.setFieldValue(field.name, colore.hex, true)}
                                                    />
                                                </FormControl>
                                            )
                                        }
                                    </Field>
                                </Grid>
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
            <R2DLoader />
        )
    }

    return (
        <Paper className={classes.root}>
            {!isFetchingInProgress() ? renderForm() : renderLoading()}
        </Paper>
    );

}