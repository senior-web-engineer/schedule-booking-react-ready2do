import {
  Box,
  Fab,
  makeStyles,
  Paper,
  Typography,
  Button,
  Grid,
} from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import AddIcon from "@material-ui/icons/Add";
import log from "loglevel";
import React, { useState } from "react";
import PrenotazioneUtenteAdd from "./PrenotazioneUtenteAdd";
import PrenotazioniUtenteList from "./PrenotazioniUtenteList";
import { Container } from "@material-ui/core";

const _logger = log.getLogger("AbbonamentiUtenteSection");

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    margin: theme.spacing(3, 0, 0, 0),
    minHeight: 130,
  },
  headerTitle: {
    flexGrow: 1,
    justifyContent: "center",
    textAlign: "center",
    display: "flex",
  },
  headerButton: {
    backgroundColor: "grey",
    color: "white",
  },
  fabAdd: {
    float: "right",
    marginRight: "20px",
    // right:'10px'
  },
  InsertButton: {
    backgroundColor: "grey",
    color: "white",
    marginRight: "10px",
    float: "right",
  },
}));

const PrenotazioniUtenteSection = (props) => {
  const idStruttura = props.idStruttura;
  const idUtente = props.idUtente;
  const prenotazioniConfermate = props.prenotazioniConfermate ?? [];
  const prenotazioniNonConfermate = props.prenotazioniNonConfermate ?? [];
  const waitList = props.waitList ?? [];
  const abbonamenti = props.abbonamenti ?? [];
  const reloadHandler = props.reloadHandler;
  const classes = useStyles();

  const [editMode, setEditMode] = useState(false);
  const [prenotazioneSelezionata, setPrenotazioneSelezionata] = useState(null);

  _logger.debug(
    `PrenotazioniUtenteSection -> idStruttura: ${idStruttura}, idUtente: ${idUtente}`
  );

  //Normalizziamo le varie tipologie di prenotazioni in un unico array
  const normalizePrenotazione = (p) => {
    return {
      id: `CO-${p.id}`,
      originalId: p.id,
      idEvento: p.schedule?.id,
      nome: p.schedule?.tipologiaLezione?.nome,
      dataPrenotazione: p.dataCreazione,
      dataLezione: p.schedule.dataOraInizio,
      stato: "Confermata",
      kind: "Confermato",
    };
  };

  const normalizePrenotazioneNonConfermata = (p) => {
    return {
      id: `DC-${p.id}`,
      originalId: p.id,
      idEvento: p.schedule?.id,
      nome: p.schedule?.tipologiaLezione?.nome,
      dataPrenotazione: p.dataCreazione,
      dataLezione: p.schedule.dataOraInizio,
      stato: "Da Confermare",
      kind: "NonConfermato",
    };
  };

  const normalizeWaitList = (p) => {
    return {
      id: `WL-${p.id}`,
      originalId: p.id,
      idEvento: p.schedule?.id,
      nome: p.schedule?.tipologiaLezione?.nome,
      dataPrenotazione: p.dataCreazione,
      dataLezione: p.schedule.dataOraInizio,
      stato: "In Coda",
      kind: "WaitList",
    };
  };

  const prenotazioni = prenotazioniConfermate
    .map(normalizePrenotazione)
    .concat(prenotazioniNonConfermate.map(normalizePrenotazioneNonConfermata))
    .concat(waitList.map(normalizeWaitList));

  const handleEditPrenotazione = (idxPrenotazione) => {
    if (!idxPrenotazione) {
      return;
    }
    let prenotazione = prenotazioni[idxPrenotazione];
    _logger.debug(
      `handleEditPrenotazione - idPrenotazione: ${idxPrenotazione}, Prenotazione: ${JSON.stringify(
        prenotazione
      )}`
    );
    setPrenotazioneSelezionata(prenotazione);
    setEditMode(true);
  };

  const handlePrenotazioneChange = () => {
    if (reloadHandler) {
      reloadHandler();
    }
    setEditMode(false);
  };

  return (
    <Paper className={classes.root}>
      <Box container className={classes.headerTitle}>
        <Grid xs={12} md={1}>
          <Button className={classes.headerButton}>STORICO</Button>
        </Grid>
        <Grid xs={12} md={10}>
          <Typography variant="h6">Prenotazioni utente</Typography>
        </Grid>
        {/* {!editMode ? 
                    <Fab color="primary" size="small" aria-label="add"
                        className={classes.fabAdd}
                        onClick={(e)=>{setPrenotazioneSelezionata(null); setEditMode(!editMode); _logger.debug(`editMode: ${editMode}`)}}>  
                        <AddIcon />
                        </Fab> : "" } */}
        <Grid xs={12} md={1}>
          <InfoIcon style={{ fontSize: 40, color: "grey" }}></InfoIcon>
        </Grid>
      </Box>

      {!editMode ? (
        <PrenotazioniUtenteList
          idStruttura={idStruttura}
          idUtente={idUtente}
          prenotazioni={prenotazioni}
          onChangeHandler={handlePrenotazioneChange}
          onEditHandler={handleEditPrenotazione}
        />
      ) : (
        <PrenotazioneUtenteAdd
          idStruttura={idStruttura}
          idUtente={idUtente}
          prenotazioneUtente={prenotazioneSelezionata}
          abbonamenti={abbonamenti}
          onCancelHandler={() => {
            setEditMode(false);
          }}
          onChangeHandler={handlePrenotazioneChange}
        />
      )}
      {!editMode && (
          <Box style={{display: 'flow-root', margin: '10px'}}>
        <Button
          size="small"
          type="submit"
          className={classes.InsertButton}
          onClick={(e) => {
            setPrenotazioneSelezionata(null);
            setEditMode(!editMode);
            _logger.debug(`editMode: ${editMode}`);
          }}
        >
          INSERISCI
        </Button>
        </Box>
      )}
    </Paper>
  );
};

export default PrenotazioniUtenteSection;
