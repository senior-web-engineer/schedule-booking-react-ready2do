/* eslint-disable import/no-anonymous-default-export */
import log from "loglevel";
import React from "react";
import appInsights from "../../applicationInsights";
import { UsersAPI } from "../../api/users.api";
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
import parseISO from "date-fns/parseISO";
import { withStyles } from "@material-ui/core/styles";

const _logger = log.getLogger("UtenteStruttureSeguite");

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "400px",
    position: "relative",
    marginTop: "33px",
    marginBottom: "20px",
  },
  title: {
    paddingTop: "10px",
    marginBottom: "10px",
    fontWeight: "700",
  },
  box: {
    padding: "12px",
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
      padding: '12px'
  }
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
  const classes = useStyles();
  const [fetchInProgress, setFetchInProgress] = React.useState(false);
  const [appuntamenti, setAppuntamenti] = React.useState(null);
  const [gridData, setGridData] = React.useState([]); //Dati renderizzati dalla griglia

  React.useEffect(() => {
    async function fetchAppuntamenti() {
      const data = await UsersAPI.GetCurrentUserAppuntamentiAsync();

      setAppuntamenti(data);
      console.log(data);
      setFetchInProgress(false);
    }
    setFetchInProgress(true);
    fetchAppuntamenti();
  }, []);

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
    return dt + "/" + month + "/" + year + "-" + hh + ":" + mm;
  }

  function renderClienti() {
    if (appuntamenti && appuntamenti.length > 0) {
      return (
        <TableContainer>
          <Table className={classes.table} aria-label="Elenco locations">
            <TableHead>
              <TableRow>
                <StyledTableCell>Nome Struttura</StyledTableCell>
                <StyledTableCell align="center">Nome Lezione</StyledTableCell>
                <StyledTableCell align="center">
                  Data e Ora Lezione
                </StyledTableCell>
                <StyledTableCell align="center">Stato Lezione</StyledTableCell>
                <StyledTableCell align="center">Impostazioni</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appuntamenti.map((m) => (
                <TableRow key={m.id}>
                  <StyledTableCell component="th" scope="row">
                    {m.nome}
                  </StyledTableCell>
                  <StyledTableCell align="center">{m}</StyledTableCell>
                  <StyledTableCell align="center">
                    {dateFormat(parseISO(m.dataFollowing))}
                  </StyledTableCell>
                  <StyledTableCell align="center">{m}</StyledTableCell>
                  <StyledTableCell align="right">
                    <Fab
                      size="small"
                      variant="round"
                      className={classes.FAB}
                      component={Link}
                      to={`/${m.urlRoute}/`}
                    >
                      <MenuIcon style={{ color: "white" }} />
                    </Fab>
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
            Non stai ancora seguendo nessuna struttura
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
          <Button className={classes.headerButton}>STORICO</Button>
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
                I Mie Prenotazioni
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={1}>
          <InfoIcon style={{ fontSize: 40, color: "grey" }}></InfoIcon>
        </Grid>
      </Grid>
      {isLoading() ? <R2DLoader /> : renderClienti()}
    </Paper>
  );
};
