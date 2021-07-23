import log from "loglevel";
import React, { Fragment } from "react";
import { Paper, makeStyles } from "@material-ui/core";
import UtenteProfiloEdit from "./UtenteProfiloEdit";
import UtenteStruttureSeguite from "./UtenteStruttureSeguite";
import UtentePrenotazioniList from "./UtentePrenotazioniList";
import { Container } from "@material-ui/core";

const _logger = log.getLogger("UtenteProfiloEdit");

const useStyles = makeStyles((theme) => ({
  image: {
    marginTop: "8px",
    marginBottom: "8px",
    width: "inherit",
  },
}));

export default (props) => {
  const classes = useStyles();

  return (
    <Fragment>
      {/* ads */}
      <Container>
        <img className={classes.image} src="/images/tinto.png" alt="tinto" />
      </Container>
      <UtenteProfiloEdit />
      <UtenteStruttureSeguite />
      <UtentePrenotazioniList />
      {/* ads */}
      <Container>
        <img className={classes.image} src="/images/tinto.png" alt="tinto" />
      </Container>
    </Fragment>
  );
};
