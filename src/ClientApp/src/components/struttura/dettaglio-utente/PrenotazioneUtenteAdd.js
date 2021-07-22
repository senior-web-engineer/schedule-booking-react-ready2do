import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Hidden,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/Save";
import { Skeleton } from "@material-ui/lab";
import { DatePicker } from "@material-ui/pickers";
import add from "date-fns/add";
import isDate from "date-fns/isDate";
import parseISO from "date-fns/parseISO";
import format from "date-fns/format";
import isFuture from "date-fns/isFuture";
import log from "loglevel";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StruttureEventiAPI } from "../../../api/strutture.eventi.api";
import { StruttureUtentiAPI } from "../../../api/strutture.utenti.api";

const _logger = log.getLogger("PrenotazioneUtenteAdd");

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "35px",
    paddingTop: "15px",
    paddingBottom: "15px",
  },
  container: {
    paddingTop: 15,
  },
  gridContainer: {
    paddingLeft: 10,
  },
  formControlTipolezione: {
    // marginTop: "16px",
    // marginBottom: "8px",
    minWidth: "180px",
    width: "90%",
  },
  switchLabel: {
    paddingTop: 10,
  },
  gridButtons: {
    paddingTop: "20px",
  },
  btnSalva: {
    margin: "20px",
  },
  btnAnnulla: {
    margin: "20px",
  },
}));
/***
 * Componente per l'aggiunta di una preonotazione per conto di un utente
 */
const PrenotazioneUtenteAdd = (props) => {
  const classes = useStyles();
  const idStruttura = props.idStruttura;
  const idUtente = props.idUtente;
  const prenotazioneUtente = props.prenotazioneUtente ?? {};
  const abbonamenti = props.abbonamenti ?? [];
  const onChangeHandler = props.onChangeHandler;
  const onCancelHandler = props.onCancelHandler;
  //const idTipoLezioneSelezionata = -1;

  const initialValues = {
    idTipoLezioneSelezionata: "", 
    giornoAppuntamento: "",
    oraAppuntamento: "",
    location: "",
    abbonamentoUtente: ""
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
  } = useForm({
    defaultValues: initialValues,
  });


  const [tipologieLezioni, setTipologieLezioni] = useState([]);
  const [tipologieLezioniLoading, setTipologieLezioniLoading] = useState(true);

  const [eventi, setEventi] = useState([]);
  const [eventiLoading, setEventiLoading] = useState(true);

  const [idTipoLezioneSelezionata, setIdTipoLezione] = useState("");
  const [giornoAppuntamento,setGiornoAppuntamento] = useState("");
  const [oraAppuntamento, setOraAppuntamento] = useState("");
  const [location, setLocation] = useState("");
  const [abbonamentoUtente, setAbbonamentoUtente] = useState("");

  useEffect(() => {
    //Recuperiamo le Tipologie di Lezioni gestite dalla struttura
    async function fetchTipologieLezioni(idStruttura) {
      const data = await StruttureEventiAPI.FetchTipologieLezioniAsync(
        idStruttura,
        1,
        500
      );
      _logger.debug(
        `PrenotazioneUtenteAdd->useEffect()->FetchTipologieLezioniAsync(${idStruttura}) => ${JSON.stringify(
          data
        )}`
      );
      setTipologieLezioni(data ?? []);
      setTipologieLezioniLoading(false);
      setInitialValues();
      reset(initialValues);
    }
    fetchTipologieLezioni(idStruttura);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idStruttura, idUtente]);

  useEffect(() => {
    async function fetchLezioni(idStruttura, idTipoLezione) {
      const data = await StruttureEventiAPI.FetchEventiAsync(
        idStruttura,
        null,
        new Date(),
        add(new Date(), { months: 1 }),
        idTipoLezione,
        false,
        false,
        1,
        1000
      );
      _logger.debug(
        `PrenotazioneUtenteAdd->useEffect()->fetchLezioni(${idStruttura}, ${idTipoLezione}) => ${JSON.stringify(
          data
        )}`
      );
      setEventi(data ?? []);
      setEventiLoading(false);
    }
    if (idTipoLezioneSelezionata) {
      fetchLezioni(idStruttura, idTipoLezioneSelezionata);
    }
  }, [idStruttura, idTipoLezioneSelezionata]);

  const setInitialValues = ()=> {
    _logger.debug(`setInitialValues - PRENOTAZIONE: ${JSON.stringify(prenotazioneUtente)}`);
    if(prenotazioneUtente){

      initialValues.idTipoLezioneSelezionata =  prenotazioneUtente.idTipoLezione ?? "";
      initialValues.giornoAppuntamento = prenotazioneUtente.dataOraInizio?.substring(0,10) ?? "" ;
      initialValues.oraAppuntamento = prenotazioneUtente.dataOraInizio?.substring(11,5) ?? "";
      initialValues.location = prenotazioneUtente.idLocation ?? "";
      initialValues.abbonamentoUtente = prenotazioneUtente. idAbbonamento ?? "";
    }
  }

  const submitForm = async (data) => {
    _logger.debug(`Submitting form: ${JSON.stringify(data)}`);
    // data.id = abbonamentoUtente?.id;
    // data.idCliente = idStruttura;
    // data.userId = idUtente;
    // data.importoPagato = data.saldato ? data.importo : 0;
    // _logger.debug(`Aggiunta Abbonamento Utente - idStruttura:${idStruttura}, idUtente: ${idUtente}`);
    // await StruttureUtentiAPI.AddUpdateAbbonamentoUtenteAsync(idStruttura, idUtente, data);
    let eventoGiorno = eventi.filter((value, index, self)=> ((value.dataOraInizio.substring(0,16) === (giornoAppuntamento + 'T' + oraAppuntamento)) && (value?.location?.id )));
    let idEvento = eventoGiorno[0].id;
    let appuntamento = {
      user : idUtente,
      idAbbonamento : abbonamentoUtente,
      evento : idEvento,
      note : 'Appuntamento preso da BE'
    }
    await StruttureEventiAPI.PrenotaEventoAsync(idStruttura, idEvento, appuntamento)
     reset();
     onChangeHandler();
  };

  const renderDateEventi = () =>{
    if(eventi && eventi.length){
    //ATTENZIONE! Assumiamo chge la data sia in formato ISO e facciamo direttamente il substring senza parsarla
    _logger.debug(`renderDateEventi - EVENTI : ${JSON.stringify(eventi)}`);
    let date = eventi.filter((value, index, self) =>
                              self.map(x => x.dataOraInizio.substring(0,10))
                              .indexOf(value.dataOraInizio.substring(0,10)) == index);
      return date.map((d) => (<MenuItem key={d.dataOraInizio.substring(0,10)} value={d.dataOraInizio.substring(0,10)}>{d.dataOraInizio.substring(0,10)}</MenuItem>));
    }
  }

  const renderOraEventi = () =>{
    //ATTENZIONE! Assumiamo chge la data sia in formato ISO e facciamo direttamente il substring senza parsarla
    if(eventi && eventi.length && giornoAppuntamento){
      let eventiGiorno = eventi.filter((value, index, self)=>value.dataOraInizio.substring(0,10) === giornoAppuntamento); //Consideriamo solo gli eventi del giorno selezionato
      let orari= eventiGiorno.filter((value, index, self) =>
                              self.map(x => format(parseISO(x.dataOraInizio),'HH:mm'))
                                .indexOf(format(parseISO(value.dataOraInizio),'HH:mm')) == index);
      return orari.map((d) => (<MenuItem key={format(parseISO(d.dataOraInizio),'HH:mm')} value={format(parseISO(d.dataOraInizio),'HH:mm')}>{format(parseISO(d.dataOraInizio),'HH:mm')}</MenuItem>));
    }
  }

  const renderLocations = () =>{
    if(eventi && eventi.length && giornoAppuntamento){
      let eventiGiorno = eventi.filter((value, index, self)=>value.dataOraInizio.substring(0,10) === giornoAppuntamento); //Consideriamo solo gli eventi del giorno selezionato
      let eventiOra = eventiGiorno.filter((value, index, self) => format(parseISO(value.dataOraInizio),'HH:mm') === oraAppuntamento);
      let locations = eventiOra.filter((value, index, self) => 
                                        self.map(x => x.location?.id)
                                        .indexOf(value.location?.id) === index);
      return locations.map((d) => (<MenuItem key={d.location?.id} value={d.location?.id}>{d.location?.nome}</MenuItem>));
    }
  }

  const renderAbbonamenti = ()=>{
    return abbonamenti
                ?.filter((value, index, self) => isFuture(parseISO(value.scadenza)))
                ?.map((t) => (<MenuItem key={t.id} value={t.id}>{t.tipoAbbonamento?.nome}</MenuItem>))
  }
  
  const handleTipoLezioneChanged = (idTipoLezione) => {
    _logger.debug(`handleTipoLezioneChanged form: ${JSON.stringify(idTipoLezione)}`);
    setIdTipoLezione(idTipoLezione);
    setGiornoAppuntamento(''); //reset giorno
    setOraAppuntamento('');
    setLocation('');
  };

const handleGiornoAppuntamentoChanged = (newDate)=>{
  _logger.debug(`handleGiornoAppuntamentoChanged - newdate: ${JSON.stringify(newDate)}`);
  setGiornoAppuntamento(newDate);
}

const handleOraAppuntamentoChanged = (newTime)=>{
  _logger.debug(`handleOraAppuntamentoChanged - newTime: ${JSON.stringify(newTime)}`);
  setOraAppuntamento(newTime);
}

const handleLocationChanged = (location)=>{
  _logger.debug(`handleLocationChanged - location: ${JSON.stringify(location)}`);
  setLocation(location);
}

  const renderForm = () => {
    return (
      <form onSubmit={handleSubmit(submitForm)} noValidate>
        <Grid container className={classes.gridContainer}>
          <Grid item xs={12} md={5}>
            {/* TIPO LEZIONE */}
            <FormControl className={classes.formControlTipolezione} required>
              <InputLabel>Tipo Lezione</InputLabel>              
              <Controller
                render={({ onChange, onBlur, value, name, ref }) => (
                  <Select
                    onChange={(e) => {
                      const newValue = e.target.value;
                      handleTipoLezioneChanged(newValue);                      
                      onChange(newValue);
                    }}
                    inputRef={ref}
                    value={idTipoLezioneSelezionata}
                  >
                    {tipologieLezioni?.map((t) => (
                      <MenuItem key={t.id} value={t.id}>
                        {t.nome}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                control={control}
                name="idTipoLezioneSelezionata"
                rules={{
                  required: "E' necessario selezionare la tipologia di lezione",
                }}
              />
            </FormControl>
          </Grid>
          {/* DATA LEZIONE (DROPDOWN) */}
          <Grid item xs={12} md={3}>
            <FormControl className={classes.formControlTipolezione} required disabled={!(idTipoLezioneSelezionata)}>
              <InputLabel>Giorno</InputLabel>              
              <Controller
                render={({ onChange, onBlur, value, name, ref }) => (
                  <Select
                    onChange={(e) => {
                      const newValue = e.target.value;
                      handleGiornoAppuntamentoChanged(newValue);
                      onChange(newValue);
                    }}
                    inputRef={ref}
                    value={giornoAppuntamento}
                  >
                    {renderDateEventi()}
                    {/* ))} */}
                  </Select>
                )}
                control={control}
                value={giornoAppuntamento}
                name="giornoAppuntamento"
                rules={{
                  required: "Selezionare il giorno",
                }}
              />
            </FormControl>
          </Grid>
          <Hidden mdDown>
            <Grid item md={1} />
          </Hidden>
          {/* ORA LEZIONE (DROPDOWN) */}
          <Grid item xs={12} md={3}>
            <FormControl className={classes.formControlTipolezione} required disabled={!(giornoAppuntamento)}>
              <InputLabel>Ora</InputLabel>              
              <Controller
                render={({ onChange, onBlur, value, name, ref }) => (
                  <Select
                    onChange={(e) => {
                      const newValue = e.target.value;
                      handleOraAppuntamentoChanged(newValue);
                      onChange(newValue);
                    }}
                    inputRef={ref}
                    value={oraAppuntamento}
                  >
                    {renderOraEventi()}
                    {/* ))} */}
                  </Select>
                )}
                control={control}
                value={oraAppuntamento}
                name="oraAppuntamento"
                rules={{
                  required: "Selezionare l'ora",
                }}
              />
            </FormControl>
          </Grid>
          {/* LOCATION */}
          <Grid item xs={12} md={3}>
            <FormControl className={classes.formControlTipolezione} required disabled={!(giornoAppuntamento) || !(oraAppuntamento)}>
              <InputLabel>Sala</InputLabel>              
              <Controller
                render={({ onChange, onBlur, value, name, ref }) => (
                  <Select
                    onChange={(e) => {
                      const newValue = e.target.value;
                      handleLocationChanged(newValue);
                      onChange(newValue);
                    }}
                    inputRef={ref}
                    value={location}
                  >
                    {renderLocations()}
                    {/* ))} */}
                  </Select>
                )}
                control={control}
                value={location}
                name="location"
                rules={{
                  required: "Selezionare la sala",
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={5}>
            {/* ABBONAMENTO UTENE */}
            <FormControl className={classes.formControlTipolezione} required>
              <InputLabel>Abbonamento</InputLabel>              
              <Controller
                render={({ onChange, onBlur, value, name, ref }) => (
                  <Select
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setAbbonamentoUtente(newValue);
                      onChange(newValue);
                    }}
                    inputRef={ref}
                    value={abbonamentoUtente}
                  >
                    {renderAbbonamenti()}
                  </Select>
                )}
                control={control}
                name="abbonamentoUtente"
                rules={{
                  required: "E' necessario selezionare un'abbonamento",
                }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Box className={classes.gridButtons}>
              <Button
                size="small"
                variant="contained"
                type="submit"
                color="primary"
                startIcon={<SaveIcon />}
                className={classes.btnSalva}
              >
                Salva
              </Button>

              <Button
                size="small"
                variant="contained"
                onClick={(e) => {
                  reset();
                  if (onCancelHandler) {
                    onCancelHandler();
                  }
                }}
                color="secondary"
                startIcon={<ClearIcon />}
                className={classes.btnAnnulla}
              >
                Annulla
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    );
  };

  return (
    <Box className={classes.root} boxShadow={3}>
      {tipologieLezioniLoading ? (
        <Skeleton variant="text" height={200} />
      ) : (
        renderForm()
      )}
    </Box>
  );
};

export default PrenotazioneUtenteAdd;
