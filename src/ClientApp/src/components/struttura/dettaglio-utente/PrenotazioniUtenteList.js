import {
  Button,
  makeStyles,
  Switch,
  Table,
  Container,
  Fab,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import MenuIcon from "@material-ui/icons/Menu";
import { withStyles } from "@material-ui/core/styles";
import log from "loglevel";
import React, { Fragment } from "react";
import { StruttureEventiAPI } from "../../../api/strutture.eventi.api";
import { useSnackbar } from "notistack";

const _logger = log.getLogger("AbbonamentiUtente");

const useStyles = makeStyles({
  root: {
    minHeight: "600px",
    position: "relative",
  },
  table: {
    minWidth: 650,
  },
  FAB: {
    backgroundColor: "#000000",
    marginRight: "10px",
  },
});

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

const PrenotazioniUtenteList = (props) => {
  const idStruttura = props.idStruttura;
  const idUtente = props.idUtente;
  const prenotazioni = props.prenotazioni;
  const onChangeHandler = props.onChangeHandler;
  const onEditHandler = props.onEditHandler;
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  _logger.debug(
    `PrenotazioniUtenteList -> idStruttura: ${idStruttura}, idUtente: ${idUtente}, Prenotazioni: ${JSON.stringify(
      prenotazioni
    )}`
  );

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

  const handleEditPrenotazione = (event, idPrenotazione) => {
    //ATTENZIONE! L'Id può far riferimento a vari tipi di prenotazioni (confermate, non confermate, wl)
    if (onEditHandler) {
      onEditHandler(idPrenotazione);
    }
  };

  const handleDeletePrenotazione = async (kind, idEvento, idPrenotazione) => {
    switch (kind) {
      case "Confermato":
        await StruttureEventiAPI.AnnullaPrenotazioneByAdminAsync(
          idStruttura,
          idEvento,
          idPrenotazione
        );
        enqueueSnackbar("Prenotazione cancellata", { variant: "success" });
        break;
      case "NonConfermato":
        await StruttureEventiAPI.RifiutaAppuntamentoNonConfermatoByAdminAsync(
          idStruttura,
          idEvento,
          idPrenotazione
        );
        enqueueSnackbar("Prenotazione cancellata", { variant: "success" });
        break;
      case "WaitList":
        enqueueSnackbar("Cancellazione dalla wait list non supportata", {
          variant: "error",
        });
        break;
    }
    if (onChangeHandler) {
      onChangeHandler(idPrenotazione);
    }
  };

  function renderNoData() {
    return (
      <Typography variant="h6">Nessuna Prenotazione per l'utente</Typography>
    );
  }

  function renderTable() {
    return (
      <TableContainer>
        <Table className={classes.table} aria-label="Prenotazioni">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">Nome Lezione</StyledTableCell>
              <StyledTableCell align="left">
                Data e Ora prenotazione
              </StyledTableCell>
              <StyledTableCell align="left">Data e Ora Lezione</StyledTableCell>
              <StyledTableCell align="left">Stato Lezione</StyledTableCell>
              <StyledTableCell align="center">Impostazioni</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prenotazioni?.map((p) => (
              <TableRow key={p.id}>
                <StyledTableCell component="th" scope="row">
                  {p.nome}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {dateFormat(p.dataPrenotazione)}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {dateFormat(p.dataLezione)}
                </StyledTableCell>
                <StyledTableCell align="left">{p.stato}</StyledTableCell>
                <StyledTableCell align="right">
                  {/* <Button
                    startIcon={<DeleteIcon />}
                    size="small"
                    variant="outlined"
                    color="secondary"
                    onClick={(event) => {
                      handleDeletePrenotazione(
                        p.kind,
                        p.idEvento,
                        p.originalId
                      );
                    }}
                  >
                    Elimina
                  </Button> */}
                  {/* <Button startIcon={<EditIcon />} size="small" variant="outlined" onClick={(event)=>{handleEditPrenotazione(event, p.id)}} >
                                        Edit
                                    </Button> */}
                  <Fab
                    size="small"
                    variant="round"
                    className={classes.FAB}
                    onClick={(e) => {
                      handleDeletePrenotazione(
                        p.kind,
                        p.idEvento,
                        p.originalId
                      );
                    }}
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
  }

  return (
    <Fragment>
      {prenotazioni && prenotazioni.length > 0 ? renderTable() : renderNoData()}
    </Fragment>
  );
};

export default PrenotazioniUtenteList;
