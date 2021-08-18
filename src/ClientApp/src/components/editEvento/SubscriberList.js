/* eslint-disable import/no-anonymous-default-export */
import log from "loglevel";
import React, { useState } from "react";
import appInsights from "../../applicationInsights";
import { UsersAPI } from "../../api/users.api";
import { StruttureEventiAPI } from "../../api/strutture.eventi.api";
import {
  Grid,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  makeStyles,
  TableBody,
  Button,
  Typography,
  Box,
  Fab,
  FormControl,
  FormControlLabel,
  Switch,
} from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import MenuIcon from "@material-ui/icons/Menu";
import R2DLoader from "../commons/R2DLoader";
import { Link } from "react-router-dom";
import SentimentDissatisfiedIcon from "@material-ui/icons/SentimentDissatisfied";
import dfnsITLocale from "date-fns/locale/it";
import dfnsFormat from "date-fns/format";
import format from "date-fns/format";
import { it as itLocal } from "date-fns/locale";
import differenceInMinutes from "date-fns/differenceInMinutes";
import parseISO from "date-fns/parseISO";
import { withStyles } from "@material-ui/core/styles";

const _logger = log.getLogger("UtenteStruttureSeguite");

const useStyles = makeStyles((theme) => ({
  root: {
    // minHeight: "400px",
    position: "relative",
    marginTop: "33px",
    marginBottom: "20px",
    padding: "10px",
  },
  title: {
    paddingTop: "10px",
    marginBottom: "10px",
    fontWeight: "700",
  },
  box: {
    padding: "15px",
    textAlign: "center",
  },
  FAB: {
    backgroundColor: "#000000",
    marginRight: "10px",
  },
  headerButton: {
    backgroundColor: "grey",
    color: "white",
  },
  grid: {
    padding: "15px",
  },
  btnDelete: {
    // backgroundColor: "#E31F4F",
    // color: "white",
    // margin: "auto",
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    borderBottom: "none",
    padding: "5px",
  },
  body: {
    borderBottom: "none",
    padding: "5px",
  },
}))(TableCell);

export default (props) => {
  const idStruttura = props.idStruttura;
  const idEvento = props.idEvento;
  const removable = props.removable;
  const [reloadNeeded, setReloadNeeded] = useState(false);
  const classes = useStyles();
  const [fetchInProgress, setFetchInProgress] = React.useState(false);
  const [appuntamenti, setAppuntamenti] = React.useState(null);
  const [gridData, setGridData] = React.useState([]); //Dati renderizzati dalla griglia

  React.useEffect(() => {
    async function fetchAppuntamenti() {
      _logger.debug(
        `subscriberlist->useEffect()->fetchAppuntamenti() - Fetching Event (${idStruttura}, ${idEvento})`
      );
      let data = await StruttureEventiAPI.FetchAppuntamentiAsync(
        idStruttura,
        idEvento
      );
      _logger.debug(
        `subscriberlist->useEffect->fetchAppuntamenti(): Event Fetched: ${JSON.stringify(
          data
        )}`
      );
      setAppuntamenti(data);
      setFetchInProgress(false);
      setReloadNeeded(false);
    }
    setFetchInProgress(true);
    fetchAppuntamenti();
  }, [idStruttura, idEvento, reloadNeeded]);

  const isLoading = () => {
    return fetchInProgress;
  };

  // convert date format
  // @khoa
  function dateFormat(dateStr) {
    let date = new Date(dateStr);

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();
    let hh = date.getHours();
    let mm = date.getMinutes();

    if (dt < 10) {
      dt = "0" + dt;
    }
    if (month < 10) {
      month = "0" + month;
    }
    if (hh < 10) {
      hh = "0" + hh;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    if (!dt || !month || !year || !hh || !mm) return "";
    return dt + "/" + month + "/" + year + " - " + hh + ":" + mm;
  }

  async function handleChange(idAppuntamento, event) {
    let presence = event.target.checked;
    _logger.debug(
      `subscriberlist->handleChange( ${idStruttura}, ${idEvento},${idAppuntamento}, ${presence},)`
    );
    await StruttureEventiAPI.PresenzaEventoAsync(
      idStruttura,
      idEvento,
      idAppuntamento,
      presence
    );
    _logger.debug(`subscriberlist->handleChange()->invoked`);
  }

  async function handleDelete(idAppuntamento) {
    _logger.debug(
      `subscriberlist->handleDelete( ${idStruttura}, ${idEvento},${idAppuntamento})`
    );
    await StruttureEventiAPI.AnnullaPrenotazioneByAdminAsync(
      idStruttura,
      idEvento,
      idAppuntamento
    );
    _logger.debug(`subscriberlist->handleDelete()->invoked`);
    _logger.debug(`subscriberlist->handleDelete(): setReloadNeeded = true`);
    setReloadNeeded(true);
  }

  function renderClienti() {
    if (appuntamenti && appuntamenti.length > 0) {
      return (
        <TableContainer style={{ padding: "12px", width: "auto" }}>
          <Table className={classes.table} aria-label="Elenco locations">
            <TableHead>
              <TableRow>
                <StyledTableCell>Nome</StyledTableCell>
                <StyledTableCell align="center">
                  Tipo Abbonamento
                </StyledTableCell>
                <StyledTableCell align="center">
                  Data e Ora Prenotazione
                </StyledTableCell>
                <StyledTableCell align="center">
                  Stato Certificato
                </StyledTableCell>
                <StyledTableCell align="right">Presenza</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appuntamenti.map((m) => (
                <TableRow key={m.id}>
                  <StyledTableCell component="th" scope="row">
                    {m.user.displayName}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {m?.nomeAbbonamento}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {dateFormat(parseISO(m.dataCreazione))}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {m?.statoCertificato}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {differenceInMinutes(new Date(), new Date(removable)) <=
                    5 ? (
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        className={classes.btnDelete}
                        onClick={(event) => {
                          handleDelete(m.id);
                        }}
                      >
                        ELIMINA
                      </Button>
                    ) : (
                      <FormControl>
                        <FormControlLabel
                          style={{ margin: "0px" }}
                          control={
                            <Switch
                              name="presenza"
                              checked={m?.presente}
                              value={m?.presente}
                              onChange={(event) => {
                                handleChange(m.id, event);
                              }}
                            />
                          }
                        />
                      </FormControl>
                    )}
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    } else {
      return (
        <Box className={classes.box}>
          <Typography component="div" variant="h6">
            Nessun abbonato ancora
          </Typography>
          <SentimentDissatisfiedIcon />
        </Box>
      );
    }
  }

  return (
    <Paper className={classes.root}>
      <Grid container spacing={3} className={classes.grid}>
        <Grid item xs={12} md={1}>
          {/* <Button className={classes.headerButton}>STORICO</Button> */}
        </Grid>
        <Grid item xs={12} md={10}>
          <Grid
            container
            alignItems="center"
            justify="center"
            direction="column"
          >
            <Grid item xs={12}>
              <Typography className={classes.title} align="center" variant="h5">
                Lista Iscritti
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={1}>
          <InfoIcon
            style={{ fontSize: 40, color: "grey", float: "right" }}
          ></InfoIcon>
        </Grid>
      </Grid>
      {isLoading() ? <R2DLoader /> : renderClienti()}
    </Paper>
  );
};
