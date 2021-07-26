import log from "loglevel";
import React, { useState } from "react";
import clsx from "clsx";
import cloneDeep from "lodash.clonedeep";
import PropTypes from "prop-types";
import {
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  Tooltip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import GiornoAperturaEdit from "./GiornoAperturaEdit";
import { useSelector, useDispatch } from "react-redux";
import { StruttureActionsCreator } from "../../store/actions/strutture.actions";
import InfoIcon from "@material-ui/icons/Info";
import format from "date-fns/format";
import { parseISO } from "date-fns";
import { StruttureSelectors } from "../../store/selectors/strutture.selectors";

const _logger = log.getLogger("OrarioApertura-Edit");

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    margin: theme.spacing(1, 0, 0, 0),
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  headerButtonContainer: {
    flexGrow: 0,
    // paddingLeft: '5px',
    // paddingTop: '5px',
  },
  headerButton: {
    height: "24px",
    width: "70px",
  },
  headerButtonSizeSmall: {
    padding: "3px 6px",
    fontSize: theme.typography.pxToRem(11),
    lineHeight: theme.typography.pxToRem(11),
  },
  headerButtonSave: {
    color: "#E31F4F",
  },
  headerTitle: {
    flexGrow: 1,
    justifyContent: "center",
    textAlign: "center",
  },
  headerInfo: {
    width: "30px",
    flexGrow: 0,
  },
  contentBox: {
    marginTop: "10px",
  },
  dalleHeader: {
    display: "flex",
    borderTop: "1px solid black",
    borderRight: "1px solid black",
    padding: "0px !important",
  },
  cellTitle: {
    textAlign: "center",
    padding: "12px",
  },
  cellTitleBorder: {
    borderTop: "1px solid black",
    borderLeft: "1px solid black",
    textAlign: "center",
  },
  bottom: {
    borderTop: "1px solid black",
  },
}));

const OrarioAperturaEdit = (props) => {
  const ORARIO_EMPTY = {
    lunedi: { mattina: null, pomeriggio: null, tipoOrario: 1 },
    sabato: { mattina: null, pomeriggio: null, tipoOrario: 1 },
    domenica: { mattina: null, pomeriggio: null, tipoOrario: 1 },
  };

  const [viewMode, setViewMode] = useState(props.viewMode || "view");
  const orarioStore = useSelector(StruttureSelectors.getOrarioApertura);
  const [orario, setOrario] = useState(orarioStore);
  _logger.log(`OrarioAperturaEdit-Orario: ${JSON.stringify(orario)}`);
  const styles = useStyles();
  const dispatch = useDispatch();

  const isInEdit = () => viewMode === "edit";

  _logger.debug("OrarioAperturaEdit...");

  function getOrario(giorno) {
    _logger.error(`getOrario(${giorno}) -> ${JSON.stringify(orario)}`);
    switch (giorno) {
      case "lunedi":
        return orario
          ? orario.lunedi
          : {
              lunedi: {
                mattina: { inizio: null, fine: null },
                pomeriggio: { inizio: null, fine: null },
                tipoOrario: 1,
              },
            };
      case "sabato":
        return orario
          ? orario.sabato
          : {
              sabato: {
                mattina: { inizio: null, fine: null },
                pomeriggio: { inizio: null, fine: null },
                tipoOrario: 1,
              },
            };
      case "domenica":
        return orario
          ? orario.domenica
          : {
              domenica: {
                mattina: { inizio: null, fine: null },
                pomeriggio: { inizio: null, fine: null },
                tipoOrario: 1,
              },
            };
      default:
        log.debug(`getOrario(${giorno}) -> RETURN: NULL`);
        return null;
    }
  }

  const dateToTimeString = (date) => {
    _logger.debug(`dateToTimeString: ${JSON.stringify(date)}`);
    if (!date) return null;
    if (!(date instanceof Date)) return date;
    return format(date, "HH:mm");
  };

  const handleSaveClick = (e) => {
    const formatday = (day) => {
      _logger.debug(`handleSaveClick->formatday: day: ${JSON.stringify(day)}`);
      if (!day) return null;
      return {
        tipoOrario: day?.tipoOrario,
        mattina: {
          inizio: dateToTimeString(day?.mattina?.inizio),
          fine: dateToTimeString(day?.mattina?.fine),
        },
        pomeriggio: {
          inizio: dateToTimeString(day?.pomeriggio?.inizio),
          fine: dateToTimeString(day?.pomeriggio?.fine),
        },
      };
    };

    if (isInEdit()) {
      //Dispatch del nuovo valore allo store
      //TUNING: Verificare se lo stato è cambiato effettivamente prima di fare il dispatch dell'azione
      const payload = {
        lunedi: formatday(orario?.lunedi),
        martedi: formatday(orario?.martedi),
        mercoledi: formatday(orario?.mercoledi),
        giovedi: formatday(orario?.giovedi),
        venerdi: formatday(orario?.venerdi),
        sabato: formatday(orario?.sabato),
        domenica: formatday(orario?.domenica),
      };
      const action =
        StruttureActionsCreator.updateStrutturaOrarioApertura(payload);
      _logger.debug(
        `OrarioAperturaEdit->Salvataggio nuovo orario apertura - Dispatching action: ${JSON.stringify(
          action
        )}`
      );
      dispatch(action);
      setViewMode("view");
    } else {
      setViewMode("edit");
    }
  };

  /**
   * @param {giorno} dayName - nome del giorno cambiato
   * @param {Object} newValue - nuovo valore
   */
  const handleDayChange = (giorno, newValue) => {
    _logger.debug(`handleDayChange(${giorno}, ${JSON.stringify(newValue)})`);
    //Facciamo un copia dello stato
    let newOrario = orario ? cloneDeep(orario) : {};
    //Aggiorniamo il giorno variato
    newOrario[giorno] = newValue;
    //Cambiamo lo stato
    setOrario(newOrario);
  };

  function render() {
    _logger.debug(`OrarioAperturaEdit->render() - ${JSON.stringify(orario)}`);
    return (
      <Grid container spacing={3}>
        <Grid item xs={2}></Grid>
        <Grid item xs={9}></Grid>
        <Grid item xs={1}></Grid>
        {/* Header */}
        <Grid item xs={2}></Grid>
        <Grid item xs={3} className={styles.cellTitleBorder}>
          Tipo di Orario
        </Grid>
        <Grid item xs={6} className={styles.dalleHeader}>
          <Grid
            item
            xs={3}
            className={styles.cellTitle}
            style={{ background: "gainsboro" }}
          >
            Dalle
          </Grid>
          <Grid item xs={3} className={styles.cellTitle}>
            Alle
          </Grid>
          {/* <Grid item xs={1}></Grid> */}
          <Grid
            item
            xs={3}
            className={styles.cellTitle}
            style={{ background: "gainsboro" }}
          >
            Dalle
          </Grid>
          <Grid item xs={3} className={styles.cellTitle}>
            Alle
          </Grid>
        </Grid>
        <Grid item xs={1}></Grid>
        {/* LUN-VEN */}
        <Grid item xs={2}>
          LUN-VEN
        </Grid>
        <GiornoAperturaEdit
          giorno="lunedi"
          background="gainsboro"
          tipoOrario={orario?.lunedi?.tipoOrario}
          mattina={orario?.lunedi?.mattina}
          pomeriggio={orario?.lunedi?.pomeriggio}
          viewMode={viewMode}
          onChangeHandler={handleDayChange}
        ></GiornoAperturaEdit>
        <Grid item xs={1}></Grid>
        {/* SABATO */}
        <Grid item xs={2}>
          SABATO
        </Grid>
        <GiornoAperturaEdit
          giorno="sabato"
          tipoOrario={orario?.sabato?.tipoOrario}
          mattina={orario?.sabato?.mattina}
          pomeriggio={orario?.sabato?.pomeriggio}
          viewMode={viewMode}
          onChangeHandler={handleDayChange}
        ></GiornoAperturaEdit>
        <Grid item xs={1}></Grid>
        {/* DOMENICA */}
        <Grid item xs={2}>
          DOMENICA
        </Grid>
        <GiornoAperturaEdit
          giorno="domenica"
          background="gainsboro"
          tipoOrario={orario?.domenica?.tipoOrario}
          mattina={orario?.domenica?.mattina}
          pomeriggio={orario?.domenica?.pomeriggio}
          viewMode={viewMode}
          onChangeHandler={handleDayChange}
        ></GiornoAperturaEdit>
        <Grid item xs={1}></Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={9} className={styles.bottom}></Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    );
  }

  return (
    <Paper className={styles.root}>
      <Box className={styles.header}>
        <Box className={styles.headerButtonContainer}>
          <Button
            variant="contained"
            size="small"
            classes={{ sizeSmall: styles.headerButtonSizeSmall }}
            className={clsx(
              styles.headerButton,
              isInEdit() && styles.headerButtonSave
            )}
            onClick={handleSaveClick}
          >
            {isInEdit() ? "Salva" : "Modifica"}
          </Button>
        </Box>
        <Box className={styles.headerTitle}>
          <Typography variant="h6">Orario Apertura</Typography>
        </Box>
        <Box className={styles.headerInfo}>
          <Tooltip title={props.tooltip}>
            <InfoIcon></InfoIcon>
          </Tooltip>
        </Box>
      </Box>
      <Box className={styles.contentBox}>{render()}</Box>
    </Paper>
  );
};

OrarioAperturaEdit.propTypes = {
  viewMode: PropTypes.oneOf(["view", "edit"]),
};

export default OrarioAperturaEdit;
