import log from "loglevel";
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { makeStyles, CircularProgress, Grid, TextField, Button, Paper, InputAdornment } from "@material-ui/core";
import { useParams, useHistory } from "react-router-dom";
import { StruttureEventiAPI } from "../../api/strutture.eventi.api";
import { DateTimePicker, DatePicker } from "@material-ui/pickers";
import { useSnackbar } from "notistack";

const _logger = log.getLogger("StrutturaEditTipologiaAbbonamento");

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "400px",
  },
  form: {
    padding: "20px",
  },
  colorePickerLabel: {
    transform: "translate(0, 1.5px) scale(0.75)",
    transformOrigin: "top left",
  },
  colorePicker: {
    marginTop: "24px",
  },
  btnSalva: {
    marginTop: "50px",
    backgroundColor: "#E31F4F",
    color: "white",
    margin: "auto",
  },
  errorMessage: {
    color: "red",
    fontSize: "0.7rem",
  },
}));

export default (props) => {
  const idStruttura = props.idStruttura;
  let { idTipoAbbonamento } = useParams(); //Leggiamo l'idLocation dall'url
  let history = useHistory();
  const [tipoAbbonamentoIsLoading, setTipoAbbonamentoIsLoading] = useState(true);
  const [tipoAbbonamento, setTipoAbbonamento] = useState(null);

  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  _logger.debug(`StrutturaEditTipologiaAbbonamento - idStruttura:${idStruttura}, idTipoAbbonamento: ${idTipoAbbonamento}`);

  useEffect(() => {
    async function fetchAbbonamento(idStruttura, idTipoAbbonamento) {
      const data = await StruttureEventiAPI.FetchTipologiaAbbonamentoSingleAsync(idStruttura, idTipoAbbonamento);
      _logger.debug(`StrutturaEditTipologiaAbbonamento->useEffect()->fetchedAbbonamento(${idStruttura}, ${idTipoAbbonamento}) => ${JSON.stringify(data)}`);
      //facciamo l'override dei campi null per esigenze di Formik
      if (data) {
        data.durataMesi = data.durataMesi ?? "";
        data.numIngressi = data.numIngressi ?? "";
        data.costo = data.costo ?? "";
        data.maxLivCorsi = data.maxLivCorsi ?? "";
      }
      setTipoAbbonamento(data);
      setTipoAbbonamentoIsLoading(false);
    }
    if (idStruttura > 0 && !isNaN(idTipoAbbonamento) && idTipoAbbonamento > 0) {
      fetchAbbonamento(idStruttura, idTipoAbbonamento);
    } else if (idStruttura > 0 && isNaN(idTipoAbbonamento)) {
      //Inizializiamo un oggetto vuoto per gestire il caso di nuova location
      setTipoAbbonamento({
        id: -1,
        idCliente: idStruttura,
        nome: "",
        durataMesi: "",
        numIngressi: "",
        costo: "",
        maxLivCorsi: "",
      });
      setTipoAbbonamentoIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idStruttura, idTipoAbbonamento]);

  const handleFormSubmmit = async (values, actions) => {
    _logger.debug(`StrutturaEditTipologiaAbbonamento->FormSubmit() - values: ${JSON.stringify(values)}`);
    let payload = Object.assign({}, values);
    if (payload.durataMesi === "") {
      payload.durataMesi = null;
    }
    if (payload.numIngressi === "") {
      payload.numIngressi = null;
    }
    if (payload.costo === "") {
      payload.costo = null;
    }
    if (payload.maxLivCorsi === "") {
      payload.maxLivCorsi = 0;
    }
    const esito = await StruttureEventiAPI.SaveTipologiaAbbonamentoAsync(idStruttura, payload);
    actions.setSubmitting(false); //NOTA: essendo async non è tecnicamente necessaria questa chiamata, la fa Formik implicitamente
    if (esito) {
      enqueueSnackbar("Sala salvata", { variant: "success" });
      history.goBack();
    } else {
      enqueueSnackbar("Errore nel salvataggio", { variant: "error" });
    }
  };

  function isFetchingInProgress() {
    return tipoAbbonamentoIsLoading;
  }

  async function formValidateAsync(values) {
    const errors = {};
    if (!values.nome) {
      errors.nome = "E' necessario specificare il nome";
    }
    if (!(await StruttureEventiAPI.TipologiaAbbonamentoCheckNomeAsync(idStruttura, values.id, values.nome))) {
      errors.nome = "Esiste già un abbonamento con questo nome";
    }

    if ((!values.durataMesi || values.durataMesi <= 0) && (!values.numIngressi || values.numIngressi <= 0)) {
      errors.durataMesi = "E' necessario specificare almeno uno tra Durata e Numero Ingressi";
      errors.numIngressi = "E' necessario specificare almeno uno tra Durata e Numero Ingressi";
    }

    _logger.debug(`StrutturaEditTipologiaAbbonamento->formValidateAsync() - errors: ${JSON.stringify(errors)}`);
    return errors;
  }

  function renderForm() {
    return (
      <Formik initialValues={tipoAbbonamento} enableReinitialize={true} onSubmit={handleFormSubmmit} validateOnChange={false} validate={formValidateAsync}>
        {(props, form) => (
          <Form onSubmit={props.handleSubmit} autoComplete="off" className={classes.form}>
            <Grid container>
              <Grid item xs={8}>
                <TextField name="nome" label="Tipologia abbonamento" onChange={props.handleChange} onBlur={props.handleBlur} value={props.values.nome} fullWidth margin="normal" />
                <ErrorMessage className={classes.errorMessage} component="span" name="nome" />
              </Grid>
              <Grid item xs={4} />

              <Grid item xs={4}>
                <TextField name="durataMesi" label="Durata mesi" onChange={props.handleChange} onBlur={props.handleBlur} value={props.values.durataMesi} margin="normal" type="number" />
                <ErrorMessage className={classes.errorMessage} component="span" name="durataMesi" />
              </Grid>
              <Grid item xs={4}>
                <TextField name="numIngressi" label="Numero Ingressi" onChange={props.handleChange} onBlur={props.handleBlur} value={props.values.numIngressi} margin="normal" type="number" />
              </Grid>
              <Grid item xs={4} />
              {/* <Grid item xs={4}>
                                    <TextField name='maxLivCorsi'
                                        label='Livello Massimo Corsi'
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.maxLivCorsi}
                                        // InputProps={{endAdornment:<InputAdornment position="end">(minuti)</InputAdornment>}}
                                        margin='normal'
                                        type="number"
                                    />
                                </Grid> */}
              <Grid item xs={4}>
                <TextField
                  name="costo"
                  label="Prezzo"
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  value={props.values.costo}
                  InputProps={{ endAdornment: <InputAdornment position="end">(€)</InputAdornment> }}
                  margin="normal"
                  type="number"
                />
              </Grid>
              {/* <Grid item xs={4}>
                                    <Field name='validoDal'>
                                        {({ field, form }) =>
                                            (
                                                <DatePicker name={field.name}
                                                    margin="normal"
                                                    fullWidth
                                                    //minDate={new Date()}
                                                    label='Valido dal'
                                                    value={field.value}
                                                    onChange={dateTime => form.setFieldValue(field.name, dateTime, true)}
                                                    format="dd MMMM yyyy" />
                                            )}
                                    </Field>
                                </Grid> */}
              {/* <Grid item xs={12}>
                                    <TextField name='descrizione'
                                        label='Descrizione'
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.descrizione}
                                        fullWidth
                                        margin='normal'
                                        multiline
                                    />
                                </Grid> */}

              <Grid item xs={12} style={{ textAlign: "center" }}>
                <Button size="large" variant="contained" type="submit" className={classes.btnSalva}>
                  Salva
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    );
  }

  function renderLoading() {
    return <CircularProgress />;
  }

  return <Paper className={classes.root}>{!isFetchingInProgress() ? renderForm() : renderLoading()}</Paper>;
};
