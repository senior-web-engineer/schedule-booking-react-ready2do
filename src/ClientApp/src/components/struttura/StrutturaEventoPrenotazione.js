/* eslint-disable import/no-anonymous-default-export */
import log from "loglevel";
import React, { useEffect, useState } from "react";
import * as qs from "query-string";
import {
  Paper,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Button,
} from "@material-ui/core";
import format from "date-fns/format";
import { it } from "date-fns/locale";
import parseISO from "date-fns/parseISO";
import { StruttureEventiAPI } from "../../api/strutture.eventi.api";
import { StruttureUtentiAPI } from "../../api/strutture.utenti.api";
import AzureAD, { AuthenticationState } from "react-aad-msal";
import { authProvider } from "../../authProvider";
import { getStore } from "../../store/reduxStore";
import { useSelector } from "react-redux";
import { UserSelectors } from "../../store/selectors/user.selectors";
import { makeStyles } from "@material-ui/core/styles";

const _logger = log.getLogger("StrutturaEventoPrenotazione");

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "10px",
  },
  eventLoadBox: {
    minHeight: "300px",
  },
}));

export default (props) => {
  const idStruttura = props.idStruttura;
  const idEvento = props.idEvento;
  const [evento, setEvento] = useState(null);
  const [isLoadingEvento, setIsLoadingEvento] = useState(true);
  const [appuntamento, setAppuntamento] = useState(null);
  const [appuntamentoChanged, setAppuntamentoChanged] = useState(new Date());
  const [isLoadingAppuntamento, setIsLoadingAppuntamento] = useState(true);
  const [abbonamentiUtente, setAbbonamentiUtente] = useState(null);
  const [isLoadingAbbonamenti, setIsLoadingAbbonamenti] = useState(true);
  const currentUser = useSelector(UserSelectors.getUserInfo);

  const classes = useStyles();

  useEffect(() => {
    async function fetchEvento() {
      _logger.debug(
        `StrutturaEventoPrenotazione->useEffect()->fetchEvento() - Fetching Event (${idStruttura}, ${idEvento})`
      );
      let data = await StruttureEventiAPI.FetchEventoAsync(
        idStruttura,
        idEvento
      );
      _logger.debug(
        `StrutturaEventoPrenotazione->useEffect->fetchEvento(): Event Fetched: ${JSON.stringify(
          data
        )}`
      );
      setEvento(data);
      setIsLoadingEvento(false);
    }
    if (idStruttura > 0 && idEvento > 0) {
      fetchEvento();
    }
  }, [idStruttura, idEvento]);

  /**
   * Leggiamo gli abbonamenti dell'utente
   */
  useEffect(() => {
    async function fetchAbbonamenti(userId) {
      _logger.debug(
        `StrutturaEventoPrenotazione->useEffect()->fetchAbbonamenti() - Fetching Abbonamenti (${idStruttura}, ${userId})`
      );
      const data = await StruttureUtentiAPI.FetchAbbonamentiUtenteAsync(
        idStruttura,
        userId
      );
      _logger.debug(
        `StrutturaEventoPrenotazione->useEffect->fetchAbbonamenti(): Abbonamenti Fetched: ${JSON.stringify(
          data
        )}`
      );
      setAbbonamentiUtente(data);
      setIsLoadingAbbonamenti(false);
    }

    if (idStruttura > 0 && idEvento > 0 && currentUser) {
      if (!isLoadingAbbonamenti) {
        setIsLoadingAbbonamenti(true);
      }
      fetchAbbonamenti(currentUser.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, idEvento, idStruttura]);

  useEffect(() => {
    async function fetchAppuntamento() {
      _logger.debug(
        `StrutturaEventoPrenotazione->useEffect()->fetchAppuntamento() - Fetching Appuntamento (${idStruttura}, ${idEvento})`
      );
      let data = await StruttureEventiAPI.FetchAppuntamentiAsync(
        idStruttura,
        idEvento
      );
      _logger.debug(
        `StrutturaEventoPrenotazione->useEffect->fetchAppuntamento(): Appuntamento Fetched: ${JSON.stringify(
          data
        )}`
      );
      setAppuntamento(data);
      setIsLoadingAppuntamento(false);
    }
    if (idStruttura > 0 && idEvento > 0) {
      fetchAppuntamento();
    }
  }, [idStruttura, idEvento, appuntamentoChanged]);

  function isLoading() {
    return isLoadingEvento || isLoadingAbbonamenti || isLoadingAppuntamento;
  }

  function getIdFirstAbbonamentoValido() {
    _logger.debug(
      `StrutturaEventoPrenotazione->getIdFirstAbbonamentoValido() - abbonamentiUtente: ${JSON.stringify(
        abbonamentiUtente
      )} - evento: ${JSON.stringify(evento)}`
    );
    function findAbbonamentoValido(abbonamento) {
      if (
        abbonamento.ingressiResidui > 0
        //&& (abbonamento.tipoAbbonamento.maxLivCorsi >= evento.tipologiaLezione.livello) &&
      ) {
        return true;
      } else {
        return false;
      }
    }
    let idAbbonamento = -1;
    if (abbonamentiUtente && abbonamentiUtente.length > 0) {
      idAbbonamento = abbonamentiUtente.find(findAbbonamentoValido)?.id ?? -1;
    }
    _logger.debug(
      `StrutturaEventoPrenotazione->getIdFirstAbbonamentoValido() - return: ${idAbbonamento}`
    );
    return idAbbonamento;
  }

  async function handlePrenotazioneAsync(e) {
    _logger.debug(`StrutturaEventoPrenotazione->handlePrenotazioneAsync()`);
    const idAbbonamento = getIdFirstAbbonamentoValido();
    if (idAbbonamento >= 0) {
      const newAppuntamento = {
        user: currentUser.id,
        idAbbonamento: idAbbonamento,
        evento: idEvento,
        note: "", //Al momento non gestiamo le note
      };
      await StruttureEventiAPI.PrenotaEventoAsync(
        idStruttura,
        idEvento,
        newAppuntamento
      );
      setAppuntamentoChanged(new Date());
    }
  }

  async function handleDeletePrenotazione(e) {
    _logger.debug(`StrutturaEventoPrenotazione->handlePrenotazioneAsync()`);
    await StruttureEventiAPI.AnnullaPrenotazioneAsync(idStruttura, idEvento);
    setAppuntamento(null);
    setAppuntamentoChanged(new Date());
  }

  function renderEventDetails() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid
            container
            alignItems="center"
            justify="center"
            direction="column"
          >
            <Grid item xs={12}>
              <Typography variant="h5" fontWeight="Bold">
                Prenotazione lezione
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item fontWeight="fontWeightBold" xs={12}>
          <Typography variant="h6">{evento.title}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography component="div">
            <Box component="span" fontWeight="fontWeightBold" mr={1}>
              Tipo lezione:
            </Box>
            <Box component="span">{evento.tipologiaLezione?.nome}</Box>
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography component="div">
            <Box component="span" fontWeight="fontWeightBold" mr={1}>
              Data:
            </Box>
            <Box component="span">
              {format(parseISO(evento.dataOraInizio), "d MMMM yyyy", {
                locale: it,
              })}
            </Box>
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography component="div">
            <Box component="span" fontWeight="fontWeightBold" mr={1}>
              Ora inizio:
            </Box>
            <Box component="span">
              {format(parseISO(evento.dataOraInizio), "p", { locale: it })}
            </Box>
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography component="div">
            <Box component="span" fontWeight="fontWeightBold" mr={1}>
              Location:
            </Box>
            <Box component="span">{evento.location?.nome}</Box>
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography component="div">
            <Box component="span" fontWeight="fontWeightBold" mr={1}>
              Posti disponibili:
            </Box>
            <Box component="span">
              {evento.postiResidui} / {evento.postiDisponibili}
            </Box>
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography component="div">
            <Box component="span" fontWeight="fontWeightBold" mr={1}>
              Durata:
            </Box>
            <Box component="span">{evento.durata} min.</Box>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography component="div">
            <Box component="div" fontWeight="fontWeightBold" mr={1}>
              Note:
            </Box>
            <Box component="span">{evento.note}</Box>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid
            container
            alignItems="center"
            justify="center"
            direction="column"
          >
            <Grid item xs={12}>
              <AzureAD provider={authProvider} reduxStore={getStore()}>
                {({
                  login,
                  logout,
                  authenticationState,
                  error,
                  accountInfo,
                }) => {
                  switch (authenticationState) {
                    case AuthenticationState.Authenticated:
                      if (appuntamento) {
                        return (
                          <Button
                            size="large"
                            variant="contained"
                            onClick={handleDeletePrenotazione}
                          >
                            Annulla Prenotazione
                          </Button>
                        );
                      } else {
                        return getIdFirstAbbonamentoValido() >= 0 ? (
                          <Button
                            size="large"
                            variant="contained"
                            onClick={handlePrenotazioneAsync}
                          >
                            Prenota Lezione
                          </Button>
                        ) : (
                          <Typography>Nessun abbonamento valido</Typography>
                        );
                      }
                    default:
                      return (
                        //TODO: trasformare in un
                        <Button
                          size="large"
                          variant="contained"
                          onClick={login}
                        >
                          Accedi
                        </Button>
                        // <Button size="small" variant="contained" component={Link} to={`/${urlRoute}/utenti/${userId}`}>Accedi</Button>
                      );
                  }
                }}
              </AzureAD>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  function renderEventLoading() {
    return (
      <Box className={classes.eventLoadBox}>
        <CircularProgress></CircularProgress>
      </Box>
    );
  }

  return (
    <Paper className={classes.root}>
      {isLoading() ? renderEventLoading() : renderEventDetails()}
    </Paper>
  );
};
