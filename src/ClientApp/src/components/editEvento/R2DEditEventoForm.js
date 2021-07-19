import log from "loglevel";
import React, { useState, useEffect, Fragment } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import {
  makeStyles,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  Box,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  Typography,
  FormControlLabel,
  AccordionDetails,
  Switch,
  RadioGroup,
  Radio,
  CircularProgress,
} from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import { DatePicker, DateTimePicker } from "@material-ui/pickers";
import parseISO from "date-fns/parseISO";
import differenceInHours from "date-fns/differenceInHours";
import subHours from "date-fns/subHours";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useHistory } from "react-router-dom";
import { StruttureEventiAPI } from "../../api/strutture.eventi.api";
import { useSnackbar } from 'notistack';

const _logger = log.getLogger("R2DEditEventoForm");

const useStyles = makeStyles((theme) => ({
  form: {
    padding: "20px",
  },
  gridContainer: {},
  fullWidth: {
    width: "100%",
  },
  flexDisplay: {
    display: "flex",
  },
  selectField: {
    alignSelf: "flex-end",
  },
  paddingRight: {
    paddingRight: "20px",
  },
  toggleDay: {
    backgroundColor: "#89C443",
    marginRight: "5px",
    minWidth: "110px",
  },
  btnSalva: {
    backgroundColor: "#E31F4F",
    color: "white",
    margin: "auto",
  },
}));

const R2DEditEventoForm = (props) => {
  const idStruttura = props.idStruttura;
  const idEvento = props.idEvento ?? -1;
  const dataEvento = props.dataEvento ? parseISO(props.dataEvento) : new Date();
  const idLocation = props.idLocation ?? "";
  const [tipologieLezioni, setTipologieLezioni] = useState([]);
  const [locations, setLocations] = useState([]);
  const [lezioniLoading, setLezioniLoading] = useState(true);
  const [locationsLoading, setLocationsLoading] = useState(true);
  //    const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
  const [evento, setEvento] = useState(null);
  const classes = useStyles();
  let history = useHistory();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  function buildArrayGiorniSettimana(daysOfWeek) {
    let result = [
      { id: 1, code: "Lun", nome: "lunedi", label: "Lunedì", selezionato: false },
      { id: 2, code: "Mar", nome: "martedi", label: "Martedì", selezionato: false },
      { id: 3, code: "Mer", nome: "mercoledi", label: "Mercoledì", selezionato: false },
      { id: 4, code: "Gio", nome: "giovedi", label: "Giovedì", selezionato: false },
      { id: 5, code: "Ven", nome: "venerdi", label: "Venerdì", selezionato: false },
      { id: 6, code: "Sab", nome: "sabato", label: "Sabato", selezionato: false },
      { id: 7, code: "Dom", nome: "domenica", label: "Domenica", selezionato: false },
    ];
    if (typeof daysOfWeek !== "undefined" && daysOfWeek !== null && Array.isArray(daysOfWeek)) {
      daysOfWeek.forEach((v) => {
        switch (v) {
          case "Lun": {
            result[0].selezionato = true;
            break;
          }
          case "Mar": {
            result[1].selezionato = true;
            break;
          }
          case "Mer": {
            result[2].selezionato = true;
            break;
          }
          case "Gio": {
            result[3].selezionato = true;
            break;
          }
          case "Ven": {
            result[4].selezionato = true;
            break;
          }
          case "Sab": {
            result[5].selezionato = true;
            break;
          }
          case "Dom": {
            result[6].selezionato = true;
            break;
          }
          default: {
            throw new Error("Giorno delle settimana non valido");
          }
        }
      });
    }
    return result;
  }

  //Carichiamo le tipologie di lezioni per la struttura
  //NOTA: la fetch dipende solo dalla struttura corrente
  useEffect(() => {
    async function fetchTipologieLezione() {
      _logger.debug("R2DEditEventoForm->fetchTipologieLezione()");
      const data = await StruttureEventiAPI.FetchTipologieLezioniAsync(idStruttura);
      _logger.debug(`R2DEditEventoForm->fetchTipologieLezione() - Retrieved lezioni: ${JSON.stringify(data)}`);
      setTipologieLezioni(data);
      setLezioniLoading(false);
    }
    if (idStruttura > 0) {
      setLezioniLoading(true);
      fetchTipologieLezione();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idStruttura]);

  //Carichiamo le locations  per la struttura
  //NOTA: la fetch dipende solo dalla struttura corrente
  useEffect(() => {
    async function fetchLocations() {
      _logger.debug("R2DEditEventoForm->FetchLocationsAsync()");
      const data = await StruttureEventiAPI.FetchLocationsAsync(idStruttura);
      _logger.debug(`R2DEditEventoForm->FetchLocationsAsync() - Retrieved locations: ${JSON.stringify(data)}`);
      setLocations(data);
      setLocationsLoading(false);
    }
    if (idStruttura > 0) {
      setLocationsLoading(true);
      fetchLocations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idStruttura]);

  useEffect(() => {
    //Non usiamo redux-saga per caricare l'evento perché non c'è necessita di salvarlo nello Store Redux
    async function fetchData() {
      _logger.debug(`R2DEditEventoForm->useEffect()->fetchData() - Fetching Event (${idStruttura}, ${idEvento})`);
      let data = await StruttureEventiAPI.FetchEventoAsync(idStruttura, idEvento);
      _logger.debug(`R2DEditEventoForm->useEffect->fetchData(): Event Fetched: ${JSON.stringify(data)}`);
      //Ci serve aggiungere la proprietà preavvisoCancellazione espressa come differenza in ore tra dataOraInizio e cancellabileFinoAl (se valorizzata)
      data.preavvisoCancellazione = data.cancellabileFinoAl ? differenceInHours(parseISO(data.dataOraInizio), parseISO(data.cancellabileFinoAl)) : "";
      //rimappiamo i giorni della settimana in una struttura più comoda per Formik
      data.giorniSettimanaRicorrenza = buildArrayGiorniSettimana(data?.recurrency?.daysOfWeek);
      data.tipoRicorrenza = data.recurrency?.recurrency ?? "None";
      data.tipoFineRecurrency = data.recurrency ? (data.recurrency.repeatUntil ? "data" : "ripetizioni") : "unknown";
      data.ripetiFinoAl = data?.recurrency?.repeatUntil ?? null;
      data.numeroRipezioni = data?.recurrency?.repeatFor ?? "";
      setEvento(data);
    }
    if (idStruttura) {
      if (idEvento && idEvento > 0) {
        fetchData();
      } else {
        //Iniziliziamo un nuovo evento
        let data = {
          id: null,
          idCliente: idStruttura,
          title: "",
          idTipoLezione: "",
          idLocation: !isNaN(idLocation) ? parseInt(idLocation) : "",
          dataOraInizio: dataEvento,
          postiDisponibili: "",
          note: "",
          cancellazioneConsentita: false,
          preavvisoCancellazione: "",
          waitListDisponibile: false,
          dataAperturaIscrizione: null,
          dataChiusuraIscrizione: null,
          istruttore: "",
          recurrency: {
            recurrency: "None",
            daysOfWeek: [],
            repeatUntil: "",
            repeatFor: -1,
          },
          //I campi sottostanti sono di ausilio per la compilazione dell aproprietà recurrency soprastante e non sono richiesti dalla API
          tipoRicorrenza: "None",
          giorniSettimanaRicorrenza: buildArrayGiorniSettimana(),
          tipoFineRecurrency: "",
          ripetiFinoAl: null,
          numeroRipezioni: "",
        };
        setEvento(data);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idStruttura, idEvento]);

  const isFetchingInProgress = () => {
    const result = lezioniLoading || locationsLoading || evento == null;
    _logger.debug(`isFetchingInProgress: ${result}`);
    return result;
  };
  const handleFormSubmmit = async (values, actions) => {
    //E' necessario fare un po' di reshaping dei values prima di inviarli al server, in particolare per la gestione degli eventi ricorrenti
    //Ci creiamo una copia (shallow) dei dati su cui apportare le modifiche con la proprietà recurrency vuota
    let schedule = Object.assign({}, values, { recurrency: { recurrency: null, daysOfWeek: null, repeatUntil: null, repeatFor: null } });
    if (schedule.tipoRicorrenza !== "None") {
      schedule.recurrency.recurrency = values.tipoRicorrenza;
      if (schedule.recurrency.recurrency === "Weekly") {
        schedule.recurrency.daysOfWeek = values.giorniSettimanaRicorrenza.filter((v) => v.selezionato).map((d) => d.code);
      } else {
        schedule.recurrency.DaysOfWeek = [];
      }

      if (values.tipoFineRecurrency === "data") {
        schedule.recurrency.repeatUntil = values.ripetiFinoAl;
        schedule.recurrency.repeatFor = null;
      } else if (values.tipoFineRecurrency === "ripetizioni") {
        schedule.recurrency.repeatUntil = null;
        schedule.recurrency.repeatFor = values.numeroRipezioni;
      }
    }
    //rimuoviamo le proprietà non necessarie
    delete schedule.tipoRicorrenza;
    delete schedule.giorniSettimanaRicorrenza;
    delete schedule.tipoFineRecurrency;
    delete schedule.ripetiFinoAl;
    delete schedule.numeroRipezioni;
    delete schedule.props;

    //aggiungiamo la proprietà cancellabileFinoAl come differenza tra la data inizio lezione ed il numero di ore minime di preavviso richieste
    //per la cancellazione
    let cancellabileFinoAl = subHours(schedule.dataOraInizio, isNaN(values.preavvisoCancellazione) ? 0 : values.preavvisoCancellazione);
    schedule.cancellabileFinoAl = cancellabileFinoAl;
    delete schedule.preavvisoCancellazione;

    _logger.debug(`SUBMITTING FORM - VALUES: ${JSON.stringify(schedule)}`);
    await StruttureEventiAPI.SaveEventoAsync(idStruttura, schedule);
    enqueueSnackbar('Lezione creata', {variant:'success'});
    history.goBack();
  };

  /**
   * Stop enter submitting the form.
   * @param keyEvent Event triggered when the user presses a key.
   */
  function onKeyDown(keyEvent) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  }

  _logger.debug(`R2DEditEventoForm->evento: ${JSON.stringify(evento)}`);

  const renderForm = () => {
    return (
      <Formik initialValues={evento} enableReinitialize={true} onSubmit={handleFormSubmmit}>
        {(props, form) => (
          <Form onSubmit={props.handleSubmit} autoComplete="off" className={classes.form} onKeyDown={onKeyDown}>
            <Grid container>
              <Grid item xs={12}>
                <Accordion defaultExpanded expanded={true} elevation={0}>
                  <AccordionSummary>
                    <Typography variant="h6">Dati Lezione</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container>
                      <Grid item xs={12}>
                        <TextField
                          name="title"
                          label="Nome Lezione"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          value={props.values.title}
                          fullWidth
                          margin="normal"
                          required
                          //className={classes.fullWidth}
                        />
                      </Grid>
                      <Grid item xs={6} className={classes.paddingRight}>
                        <FormControl fullWidth margin="normal" required>
                          <InputLabel id="editEventoTipoLezioneLbl">Tipo Lezione</InputLabel>
                          <Select name="idTipoLezione" labelId="editEventoTipoLezioneLbl" value={props.values.idTipoLezione} onChange={props.handleChange} onBlur={props.handleBlur}>
                            {(tipologieLezioni ?? []).map((tipoLezione, index) => {
                              return (
                                <MenuItem key={tipoLezione.id} value={tipoLezione.id}>
                                  {tipoLezione.nome}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={3}>
                        <Field name="dataOraInizio">
                          {({ field, form }) => (
                            <DateTimePicker
                              name={field.name}
                              margin="normal"
                              fullWidth
                              required
                              minDate={new Date()}
                              label="Data ed ora inizio lezione"
                              value={field.value}
                              onChange={(dateTime) => form.setFieldValue(field.name, dateTime, true)}
                              format="dd MMMM yyyy  ' alle'  HH:mm"
                            />
                          )}
                        </Field>
                      </Grid>

                      <Grid item xs={6} className={classes.paddingRight}>
                        <FormControl fullWidth margin="normal" required>
                          <InputLabel id="editEventoLocationLbl">Location</InputLabel>
                          <Select name="idLocation" labelId="editEventoLocationLbl" value={props.values.idLocation} onChange={props.handleChange} onBlur={props.handleBlur}>
                            {(locations ?? []).map((location, index) => {
                              return (
                                <MenuItem key={location.id} value={location.id}>
                                  {location.nome}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          name="postiDisponibili"
                          label="Posti disponibili"
                          type="number"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          value={props.values.postiDisponibili}
                          fullWidth
                          margin="normal"
                          required
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField name="note" label="Note" rows="3" onChange={props.handleChange} onBlur={props.handleBlur} value={props.values.note} fullWidth margin="normal" />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
              <Grid item xs={12}>
                <Accordion elevation={0}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Impostazioni Avanzate</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container>
                      <Grid item xs={6}>
                        <FormControl fullWidth margin="normal">
                          <FormControlLabel
                            control={
                              <Switch
                                name="cancellazioneConsentita"
                                checked={props.values.cancellazioneConsentita}
                                value={props.values.cancellazioneConsentita}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                            }
                            label="Cancellazione Consentita"
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          name="preavvisoCancellazione"
                          label="Preavviso minimo di cancellazione (in ore)"
                          type="number"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          value={props.values.preavvisoCancellazione}
                          disabled={!props.values.cancellazioneConsentita}
                          fullWidth
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl fullWidth margin="normal">
                          <FormControlLabel
                            control={
                              <Switch
                                name="waitListDisponibile"
                                checked={props.values.waitListDisponibile}
                                value={props.values.waitListDisponibile}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                            }
                            label="Lista d'attesa disponibile"
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                        <Field name="dataAperturaIscrizione">
                          {({ field, form }) => (
                            <DateTimePicker
                              name={field.name}
                              label="Data ed ora apertura iscrizioni"
                              value={props.values.dataAperturaIscrizione}
                              onChange={(dateTime) => form.setFieldValue(field.name, dateTime, true)}
                              format="dd/MM/yyyy HH:mm"
                              fullWidth
                              margin="normal"
                            />
                          )}
                        </Field>
                      </Grid>

                      <Grid item xs={6} className={classes.paddingRight}>
                        <TextField name="istruttore" label="Istruttore" onChange={props.handleChange} onBlur={props.handleBlur} value={props.values.istruttore} fullWidth margin="normal" />
                      </Grid>

                      <Grid item xs={6}>
                        <Field name="dataChiusuraIscrizione">
                          {({ field, form }) => (
                            <DateTimePicker
                              name={field.name}
                              label="data ed ora chiusura iscrizioni"
                              value={field.value}
                              onChange={(dateTime) => form.setFieldValue(field.name, dateTime, true)}
                              format="dd/MM/yyyy HH:mm"
                              fullWidth
                              margin="normal"
                            />
                          )}
                        </Field>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>

              <Grid item xs={12}>
                <Accordion elevation={0}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Lezione Ricorrente</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container>
                      <Grid item xs={12}>
                        <FormControl fullWidth margin="normal">
                          <InputLabel id="editEventoTipoRicorrenzaLbl">Ricorrenza lezione</InputLabel>
                          <Select name="tipoRicorrenza" labelId="editEventoTipoRicorrenzaLbl" value={props.values.tipoRicorrenza} onChange={props.handleChange} onBlur={props.handleBlur}>
                            <MenuItem value="None">Non si ripete</MenuItem>
                            <MenuItem value="Daily">Tutti i giorni</MenuItem>
                            <MenuItem value="Weekly">Ogni Settimana</MenuItem>
                            <MenuItem value="Monthly">Ogni Mese</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      {props.values.tipoRicorrenza === "Weekly" ? (
                        <Grid item xs={12}>
                          <FieldArray name="recurrency.giorniSettimanaRicorrenza">
                            {({ move, swap, push, insert, unshift, pop, form }) => {
                              return (
                                <ToggleButtonGroup
                                  margin="normal"
                                  name="recurrency.giorniSettimanaRicorrenza"
                                  value={props.values.giorniSettimanaRicorrenza}
                                  //onChange={dateTime => form.setFieldValue(field.name, dateTime, true)}
                                  onChange={props.handleChange}
                                >
                                  {props.values.giorniSettimanaRicorrenza.map((dow, index) => (
                                    <Field name={`recurrency.giorniSettimanaRicorrenza.${index}`} key={dow.id}>
                                      {() => (
                                        <ToggleButton
                                          value={dow.nome}
                                          selected={props.values.giorniSettimanaRicorrenza[index].selezionato}
                                          className={classes.toggleDay}
                                          onChange={() => {
                                            const newValues = props.values.giorniSettimanaRicorrenza;
                                            newValues[index].selezionato = !newValues[index].selezionato;
                                            _logger.debug(`ToggleButton[${index} - ${dow.nome}] -> Selected: ${newValues[index].selezionato}`);
                                            form.setFieldValue(`props.values.giorniSettimanaRicorrenza`, newValues);
                                          }}
                                        >
                                          <Typography>{dow.label}</Typography>
                                        </ToggleButton>
                                      )}
                                    </Field>
                                  ))}
                                </ToggleButtonGroup>
                              );
                            }}
                          </FieldArray>
                        </Grid>
                      ) : (
                        ""
                      )}
                      {props.values.tipoRicorrenza !== "None" ? (
                        <Field name="tipoFineRecurrency">
                          {({ field, form }) => (
                            <Fragment>
                              <Grid item xs={12}>
                                <Typography style={{ marginTop: "10px", fontWeight: 700 }}>Fine ricorrenza:</Typography>
                              </Grid>
                              <Grid item xs={3}>
                                <FormControl>
                                  <FormControlLabel
                                    value="data"
                                    label="Data fine ricorrenza"
                                    labelPlacement="end"
                                    checked={props.values.tipoFineRecurrency === "data"}
                                    control={
                                      <Radio
                                        onChange={(event) => {
                                          //_logger.debug(`tipoFineRecurrency-> endType: ${JSON.stringify(endType)}`)
                                          console.log(event.target.value);
                                          form.setFieldValue(field.name, event.target.value);
                                        }}
                                      />
                                    }
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item xs={3}>
                                <Field name="ripetiFinoAl">
                                  {({ field, form }) => (
                                    <DatePicker
                                      name={field.name}
                                      disabled={props.values.tipoFineRecurrency !== "data"}
                                      value={field.value}
                                      onChange={(dateTime) => form.setFieldValue(field.name, dateTime, true)}
                                      format="dd/MM/yyyy"
                                    />
                                  )}
                                </Field>
                              </Grid>
                              <Grid item xs={6}></Grid>
                              <Grid item xs={3}>
                                <FormControl>
                                  <FormControlLabel
                                    value="ripetizioni"
                                    checked={props.values.tipoFineRecurrency === "ripetizioni"}
                                    label="Numero Ripetizioni"
                                    labelPlacement="end"
                                    control={
                                      <Radio
                                        onChange={(event) => {
                                          //_logger.debug(`tipoFineRecurrency-> endType: ${JSON.stringify(endType)}`)
                                          console.log(event.target.value);
                                          form.setFieldValue(field.name, event.target.value);
                                        }}
                                      />
                                    }
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item xs={3}>
                                <TextField
                                  disabled={props.values.tipoFineRecurrency !== "ripetizioni"}
                                  name="numeroRipezioni"
                                  value={props.values.numeroRipezioni}
                                  type="number"
                                  onChange={props.handleChange}
                                />
                              </Grid>
                            </Fragment>
                          )}
                        </Field>
                      ) : (
                        ""
                      )}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>

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
  };

  return !isFetchingInProgress() ? renderForm() : <CircularProgress />;
};

export default R2DEditEventoForm;
