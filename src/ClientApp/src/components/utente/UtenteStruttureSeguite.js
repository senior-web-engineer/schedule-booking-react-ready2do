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
  grid: {
    padding: "15px",
  },
  headerButton: {
    backgroundColor: "grey",
    color: "white",
  },
  box: {
    padding: "15px",
    textAlign: "center",
  },
  FAB: {
    backgroundColor: "#000000",
    marginRight: "10px",
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
  const classes = useStyles();
  const [isLoadingAbbonamenti, setIsLoadingAbbonamenti] = React.useState(true);
  const [isLoadingClienti, setIsLoadingClienti] = React.useState(true);
  const [abbonamenti, setAbbonamenti] = React.useState(null);
  const [clienti, setClienti] = React.useState(null);

  React.useEffect(() => {
    async function fetchClientiFollowed() {
      const data = await UsersAPI.GetCurrentUserClientiFollowedAsync();
      setClienti(data);
      setIsLoadingClienti(false);
    }
    async function fetchAbbonamenti() {
      const data = await UsersAPI.GetCurrentUserAbbonamentiAsync();
      if (data) {
        setAbbonamenti(data);
      } else {
        setAbbonamenti([]);
      }
      setIsLoadingAbbonamenti(false);
    }
    fetchClientiFollowed();
    fetchAbbonamenti();
  }, []);

  const isLoading = () => {
    return isLoadingClienti || isLoadingAbbonamenti;
  };

  // convert date format
  // @khoa
  function dateFormat(dateStr) {
    let date = new Date(dateStr);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();

    if (dt < 10) {
      dt = "0" + dt;
    }
    if (month < 10) {
      month = "0" + month;
    }

    return dt + "/" + month + "/" + year;
  }

  function renderAbbonamentoForCliente(idCliente) {
    _logger.debug(
      `UtenteStruttureSeguite()->renderAbbonamentoForCliente(idCliente: ${idCliente}) - abbonamenti: ${JSON.stringify(
        abbonamenti
      )}`
    );
    const abbonamentiCliente = abbonamenti
      .filter((v) => v.idCliente === idCliente)
      .sort((a, b) => {
        //Ordiniamo in ordine DECRESCENTE di scadenza
        if (a.scadenza > b.scadenza) {
          return -1;
        } else if (a.scadenza < b.scadenza) {
          return 1;
        } else {
          return 0;
        }
      });
    _logger.debug(`abbonamentiCliente: ${JSON.stringify(abbonamentiCliente)}`);
    if (abbonamentiCliente && abbonamentiCliente.length > 0) {
      if (abbonamentiCliente[0].scadenza < new Date())
        return <span>Scaduto</span>;
      else {
        return (
          <span>
            {dfnsFormat(parseISO(abbonamentiCliente[0].scadenza), "P", {
              locale: dfnsITLocale,
            })}
          </span>
        );
      }
    } else {
      return <span>Nessun Abbonamento</span>;
    }
  }

  function renderClienti() {
    if (clienti && clienti.length > 0) {
      return (
        <TableContainer style={{ padding: "12px", width: "auto" }}>
          <Table className={classes.table} aria-label="Elenco locations">
            <TableHead>
              <TableRow>
                <StyledTableCell>Nome Struttura</StyledTableCell>
                <StyledTableCell align="center">
                  Data Iscrizione
                </StyledTableCell>
                <StyledTableCell align="center">
                  Stato Abbonamento{" "}
                </StyledTableCell>
                <StyledTableCell align="right">Impostazioni</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clienti.map((m) => (
                <TableRow key={m.id}>
                  <StyledTableCell component="th" scope="row">
                    {m.nome}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {/* {dfnsFormat(parseISO(m.dataFollowing), "P p", {
                      locale: dfnsITLocale,
                    })} */}
                    {dateFormat(parseISO(m.dataFollowing))}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {/* {renderAbbonamentoForCliente(m.idCliente)} */}
                    {m.ragioneSociale}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {/* <Button
                      size="small"
                      variant="outlined"
                      component={Link}
                      to={`/${m.urlRoute}/`}
                    >
                      Vai
                    </Button> */}
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
                I Miei Preferiti
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
