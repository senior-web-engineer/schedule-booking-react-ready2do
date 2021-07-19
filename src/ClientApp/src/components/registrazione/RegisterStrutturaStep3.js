import log from "loglevel";
import React from "react";
import { Redirect, useHistory } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Grid, Button } from "@material-ui/core";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { StruttureAPI } from "../../api/strutture.api";
import { authProvider } from '../../authProvider'

const _logger = log.getLogger("RegistrazioneStruttura");

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  rootPaper: {
    padding: 30,
  },
  title: {
    textAlign: "center",
    fontSize: "1.5rem",
    fontWeight: 500,
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  label: {},
  text: {},
}));

export default (props) => {
  const classes = useStyles();
  const history = useHistory();
  const onBack = props.onBack;
  const datiStruttura = props.datiStruttura ?? {};

  const handleOnBack = (e) => {
    if (onBack) {
      onBack(2);
    }
  };

  const handleRegistration = async (e) => {
    _logger.debug(`handleRegistration - datiStruttura: ${datiStruttura}`);
    await StruttureAPI.RegistraNuovoClienteAsync(datiStruttura);
    authProvider.logout();
    history.push(`/${datiStruttura?.urlRoute}`);
  };

  return (
    <Box className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <div className={classes.label}>Nome della struttura</div>
          <div className={classes.text}>{datiStruttura.nomeStruttura}</div>
        </Grid>
        <Grid item xs={12}>
          <div className={classes.label}>Descrizione della struttura</div>
          <div className={classes.text}>
            {datiStruttura.descrizione}
          </div>
        </Grid>
        <Grid item xs={12}>
          <div className={classes.label}>
            Identificativo WEB della struttura
          </div>
          <div className={classes.text}>{datiStruttura?.urlRoute
          }</div>
        </Grid>
        <Grid item xs={12}>
          <div className={classes.label}>Indirizzo e-mail della struttura</div>
          <div className={classes.text}>{datiStruttura?.email}</div>
        </Grid>
        <Grid item xs={12}>
          <div className={classes.label}>
            Numero di telefono della struttura
          </div>
          <div className={classes.text}>{datiStruttura?.phone}</div>
        </Grid>
        <Grid item xs={12}>
          <div className={classes.label}>Ragione sociale</div>
          <div className={classes.text}>{datiStruttura?.ragSociale}</div>
        </Grid>
        <Grid item xs={12}>
          <div className={classes.label}>Indirizzo</div>
          <div className={classes.text}>
            {datiStruttura?.indirizzo}
          </div>
        </Grid>
        <Grid item xs={12} className={classes.mapRow}>
          <GoogleMap
            id="circle-example"
            mapContainerStyle={{
              height: "300px",
              width: "90%",
            }}
            zoom={15}
            center={{
              lat: datiStruttura?.coordinate?.lat,
              lng: datiStruttura?.coordinate?.long
              ,
            }}
          >
            <Marker
              label={datiStruttura.ragSociale}
              position={{
                lat: datiStruttura?.coordinate?.lat,
                lng: datiStruttura?.coordinate?.long,
              }}
            />
          </GoogleMap>
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
            onClick={handleRegistration}
          >
            Avanti
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
