import {
  Box,
  Button,
  CircularProgress,
  Grid,
  makeStyles,
  TextField,
  Tooltip,
  Input,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import {
  Autocomplete,
  GoogleMap,
  useLoadScript,
  Marker,
} from "@react-google-maps/api";
import * as EmailValidator from "email-validator";
import log from "loglevel";
import React, { useState } from "react";
import config from "../../config";
import { v4 as uuidv4 } from "uuid";
import { pl } from "date-fns/locale";

const _logger = log.getLogger("RegistrazioneStrutturaStep1");

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 15,
    padding: 20,
  },
  registrationField: {
    width: "90%",
  },
  tooltipIcon: {
    float: "right",
    color: "#6b6c6e",
    // paddingTop: 5,
    margin: "auto",
    height: "100%",
  },
  actionsRow: {
    textAlign: "center",
  },
  buttonBack: {
    minWidth: "120px",
    minHeight: "50px",
    marginTop: "60px",
    float: "left",
  },
  buttonNext: {
    float: "right",
    minWidth: "320px",
    minHeight: "50px",
    marginTop: "60px",
  },
  googleAutocomplete: {
    display: "inline",
  },
  googleAutocompleteInput: {
    "&::placeholder": {
      color: "red",
      opacity: 1,
    },
    "&::-ms-input-placeholder": {
      color: "red",
    },
  },
}));

export default (props) => {
  const MIN_NOME_STRUTTURA_LENGTH = 3;
  const MIN_DESCRIZIONE_LENGTH = 30;

  const onDataSubmittedHandler = props.onDataSubmittedHandler;
  const onBack = props.onBack;

  const classes = useStyles();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: config.GoogleAPI.MapsKey,
    language: "it-IT",
    libraries: config.GoogleAPI.Libraries,
  });

  const [email, setEmail] = React.useState(props?.datiStruttura?.email ?? "");
  const [phone, setPhone] = React.useState(props?.datiStruttura?.phon ?? "");
  const [ragSociale, setRagSociale] = React.useState(
    props?.datiStruttura?.ragSociale ?? ""
  );
  const [indirizzo, setIndirizzo] = React.useState(
    props?.datiStruttura?.indirizzo ?? ""
  );

  const [emailValid, setEmailValid] = React.useState(true);
  const [emailErrorMsg, setEmailErrorMsg] = React.useState("");
  const [telefonoValid, setTelefonoValid] = React.useState(true);
  const [telefonoErrorMsg, setTelefonoErrorMsg] = React.useState("");
  const [ragioneSocialeValid, setRagioneSocialeValid] = React.useState(true);
  const [ragioneSocialeErrorMsg, setRagioneSocialeErrorMsg] = React.useState(
    ""
  );
  const [indirizzoValid, setIndirizzoValid] = React.useState(true);
  const [indirizzoErrorMsg, setIndirizzoErrorMsg] = React.useState("");
  const [autocomplete, setAutocomplete] = useState(null);

  const [lat, setLat] = React.useState(null);
  const [lng, setLng] = React.useState(null);

  const randomName = uuidv4();

  const handleChange = async (syntEvent, fieldName) => {
    const newValue = syntEvent.target.value;
    switch (fieldName) {
      case "EMAIL_STRUTTURA":
        setEmail(newValue);
        break;
      case "TELEFONO_STRUTTURA":
        setPhone(newValue);
        break;
      case "RAGIONE_SOCIALE_STRUTTURA":
        setRagSociale(newValue);
        break;
      case "INDIRIZZO_STRUTTURA":
        setIndirizzo(newValue);
        break;
      default:
        throw new Error("INVALID FIELD NAME");
    }
    ValidateFields();
  };

  const ValidateFields = () => {
    if (!email) {
      setEmailValid(false);
      setEmailErrorMsg("E' necessario inserire l'email");
    } else if (!EmailValidator.validate(email)) {
      setEmailValid(false);
      setEmailErrorMsg("Indirizzo email non valido");
    } else {
      setEmailValid(true);
      setEmailErrorMsg(null);
    }

    if (!phone) {
      setTelefonoValid(false);
      setTelefonoErrorMsg(
        "E' necessario specificare il numero telefonico della struttura"
      );
    } else if (phone.length < 6 || !phone.match(/[+0-9]+/g)) {
      setTelefonoValid(false);
      setTelefonoErrorMsg(
        "Il numero telefonico della struttura non è in un formato valido"
      );
      return false;
    } else {
      setTelefonoValid(true);
      setTelefonoErrorMsg(null);
    }

    if (!ragSociale) {
      setRagioneSocialeValid(false);
      setRagioneSocialeErrorMsg(
        "E' necessario specificare la ragione sociale della struttura"
      );
    } else if (ragSociale.length < 3) {
      setRagioneSocialeValid(false);
      setRagioneSocialeErrorMsg("La ragione sociale specificata non è valida");
      return false;
    } else {
      setRagioneSocialeValid(true);
      setRagioneSocialeErrorMsg(null);
    }

    if (!indirizzo) {
      setIndirizzoValid(false);
      setRagioneSocialeErrorMsg(
        "E' necessario specificare la ragione sociale della struttura"
      );
    } else if (indirizzo.length < 3) {
      setIndirizzoValid(false);
      setRagioneSocialeErrorMsg("La ragione sociale specificata non è valida");
      return false;
    } else {
      setIndirizzoValid(true);
      setRagioneSocialeErrorMsg(null);
    }

    return true;
  };

  const handleOnNext = async (syntEvent) => {
    if (!ValidateFields()) {
      return;
    }
    if (onDataSubmittedHandler) {
     _logger.log(`RegisterStrutturaStep2 - handleOnNext -> RAW indirizzo: ${JSON.stringify(indirizzo)}`)
      const dati = {
        email,
        phone,
        ragSociale,
        indirizzo: indirizzo?.indirizzo,
        citta: indirizzo?.citta?.short_name,
        cap: indirizzo?.zipOrPostalCode?.short_name,
        country: indirizzo?.contry?.long_name,
        coordinate: {
            lat:lat,
            long: lng
        },
      };
      _logger.log(`RegisterStrutturaStep2 - handleOnNext -> dati: ${JSON.stringify(dati)}`)
      onDataSubmittedHandler(1, dati);
    }
  };

  const handleOnBack = (e) => {
    if (onBack) {
      onBack(1);
    }
  };

  const onGoogleAutocompleteLoad = (a) => {
    _logger.log(`Google Autocomplete loaded - ${a}`);
    setAutocomplete(a);
  };

  const onGoogleAutocompletePlaceChanged = () => {
    if (autocomplete !== null) {
      let place = autocomplete.getPlace();
      console.log(`Place: ${JSON.stringify(place)}`);
      //Se l'utente non ha selezionato una voce dalla lista proposta viene valorizzato solo il campo name (che altrimenti non esiste)
      if (!place || place.name) {
        setIndirizzoValid(false);
        setIndirizzoErrorMsg("Selezionare un indirizzo tra quelli proposti");
        setIndirizzo(null);
        return;
      } else {
        setIndirizzoValid(true);
        setIndirizzoErrorMsg(null);
        setIndirizzo({
          indirizzo: place.formatted_address,
          citta: place?.address_components?.find((c) =>
            c.types.find((t) => t === "administrative_area_level_3")
          ),
          zipOrPostalCode: place?.address_components?.find((c) =>
            c.types.find((t) => t === "postal_code")
          ),
          country: place?.address_components?.find((c) =>
            c.types.find((t) => t === "country")
          ),
          location: {
            lat: place?.geometry?.location?.lat,
            long: place?.geometry?.location?.lng,
          },
        });
        setLat(place?.geometry?.location?.lat);
        setLng(place?.geometry?.location?.lng);
      }
    }
    console.log(`Indirizzo: ${JSON.stringify(indirizzo)}`);
  };

  return (
    <Box className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            className={classes.registrationField}
            label="Indirizzo email della Struttura"
            error={!emailValid}
            helperText={emailErrorMsg}
            value={email}
            onChange={(e) => {
              handleChange(e, "EMAIL_STRUTTURA");
            }}
          />
          <Tooltip title="Inserire l'indirizzo email della struttura; sarà visualizzato nella sezione contatti del profilo">
            <InfoIcon className={classes.tooltipIcon} fontSize="large" />
          </Tooltip>
        </Grid>
        <Grid item xs={12}>
          <TextField
            className={classes.registrationField}
            label="Numero di telefono della Struttura"
            error={!telefonoValid}
            helperText={telefonoErrorMsg}
            value={phone}
            onChange={(e) => {
              handleChange(e, "TELEFONO_STRUTTURA");
            }}
          />
          <Tooltip title="Inserire il numero di telefono della struttura; sarà visualizzato nella sezione contatti del profilo">
            <InfoIcon className={classes.tooltipIcon} fontSize="large" />
          </Tooltip>
        </Grid>
        <Grid item xs={12}>
          <TextField
            className={classes.registrationField}
            label="Ragione Sociale della Struttura"
            error={!ragioneSocialeValid}
            helperText={ragioneSocialeErrorMsg}
            value={ragSociale}
            onChange={(e) => {
              handleChange(e, "RAGIONE_SOCIALE_STRUTTURA");
            }}
          />
          <Tooltip title="Inserire la Ragione Sociale completa della Struttura">
            <InfoIcon className={classes.tooltipIcon} fontSize="large" />
          </Tooltip>
        </Grid>
        <Grid item xs={12}>
          <Box style={{ display: "inline" }}>
            {isLoaded ? (
              <Autocomplete
                onLoad={onGoogleAutocompleteLoad}
                onPlaceChanged={onGoogleAutocompletePlaceChanged}
                fields={["address_components", "formatted_address", "geometry"]}
                className={classes.googleAutocomplete}
              >
                <FormControl className={classes.registrationField}>
                  <InputLabel htmlFor={randomName}>
                    Localizzazione della struttura
                  </InputLabel>
                  <Input
                    id={randomName}
                    type="text"
                    placeholder="Es: Via Giuseppe Verdi, 32, Firenze, FI"
                    className={classes.googleAutocompleteInput}
                  />
                  {/* {indirizzoValid ?  <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText> : ''} */}
                </FormControl>
              </Autocomplete>
            ) : (
              <CircularProgress></CircularProgress>
            )}
            <Tooltip title="Iniziare a digitare l'indirizzo della Struttura e selezionare una delle voci proposte">
              <InfoIcon className={classes.tooltipIcon} fontSize="large" />
            </Tooltip>
          </Box>
        </Grid>
        <Grid item xs={12} className={classes.mapRow}>
          {isLoaded && lat && lng && indirizzoValid ? (
            <GoogleMap
              id="circle-example"
              mapContainerStyle={{
                height: "300px",
                width: "90%",
              }}
              zoom={15}
              center={{
                lat: lat,
                lng: lng,
              }}
            >
              <Marker
                label={ragSociale}
                position={{
                  lat: lat,
                  lng: lng,
                }}
              />
            </GoogleMap>
          ) : (
            ""
          )}
        </Grid>
        <Grid item xs={12} className={classes.actionsRow}>
          <Button
            variant="contained"
            color="secondary"
            className={classes.buttonBack}
            onClick={handleOnBack}
          >
            Indietro
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.buttonNext}
            onClick={handleOnNext}
          >
            Avanti
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
