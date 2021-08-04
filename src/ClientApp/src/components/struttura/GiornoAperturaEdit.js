import log from "loglevel";
import cloneDeep from "lodash.clonedeep";
import React, { useState, Fragment, useEffect } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Grid, Typography, Select, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { TimePicker } from "@material-ui/pickers";
import dfnsFormat from "date-fns/format";
import parseISO from "date-fns/parseISO";

const _logger = log.getLogger("GiornoAperturaEdit");

const useStyles = makeStyles(() => ({
  dalle: {
    display: "flex",
    borderRight: "1px solid black",
    padding: "0px !important",
  },
  cell1: {
    // margin: '0px 2px',
    textAlign: "center",
    padding: "15px",
  },
  cell: {
    // margin: '0px 2px',
    textAlign: "center",
    padding: "15px",
    background: "gainsboro",
  },
  select: {
    borderLeft: "1px solid black",
    background: "gainsboro",
    textAlign: "center",
  },
  select1: {
    borderLeft: "1px solid black",
    textAlign: "center",
  },
}));

const GiornoAperturaEdit = (props) => {
  const giorno = props.giorno || "";
  const backgroundColor = props.background;
  const viewMode = props.viewMode || "view";
  const [tipoOrario, setTipoOrario] = useState(
    props.tipoOrario ? props.tipoOrario : ""
  );
  const changeHandler = props.onChangeHandler;
  const [mattina, setOrarioMattina] = useState(
    props.mattina ? props.mattina : { inizio: null, fine: null }
  );
  const [pomeriggio, setOrarioPomeriggio] = useState(
    props.pomeriggio ? props.pomeriggio : { inizio: null, fine: null }
  );

  useEffect(() => {
    setTipoOrario(props.tipoOrario);
  }, [props.tipoOrario]);
  useEffect(() => {
    setOrarioMattina(props.mattina);
  }, [props.mattina]);
  useEffect(() => {
    setOrarioPomeriggio(props.pomeriggio);
  }, [props.pomeriggio]);

  const styles = useStyles();

  const isInEdit = () => {
    return viewMode === "edit";
  };

  _logger.debug(
    `GiornoAperturaEdit->giorno: ${giorno} - mattina: ${JSON.stringify(
      props.mattina
    )} - pomeriggio: ${JSON.stringify(props.pomeriggio)}`
  );

  function handleChangeTipoOrario(event) {
    let tipo = event.target.value;
    setTipoOrario(tipo);
    handleChanges(giorno, mattina, pomeriggio, tipo);
  }

  function handleChangeOra(newValue, isMattina, isInizio) {
    let localMattina = mattina ? cloneDeep(mattina) : {};
    let localPomeriggio = pomeriggio ? cloneDeep(pomeriggio) : {};

    if (isMattina) {
      if (isInizio) {
        localMattina.inizio = newValue;
      } else {
        localMattina.fine = newValue;
      }
      setOrarioMattina(localMattina);
    } else {
      if (isInizio) {
        localPomeriggio.inizio = newValue;
      } else {
        localPomeriggio.fine = newValue;
      }
      setOrarioPomeriggio(localPomeriggio);
    }
    handleChanges(giorno, localMattina, localPomeriggio, tipoOrario);
  }

  function handleChanges(giorno, mattina, pomeriggio, tipoOrario) {
    _logger.debug(
      `GiornoAperturaEdit->handleChanges - giorno: ${JSON.stringify(
        giorno
      )}, mattina: ${JSON.stringify(mattina)} - pomeriggio: ${JSON.stringify(
        pomeriggio
      )} - tipoOrario: ${tipoOrario}`
    );
    if (changeHandler) {
      let result = {
        mattina,
        pomeriggio,
        tipoOrario,
      };
      changeHandler(giorno, result);
    }
  }

  function decodeTipoOrario(idTipoOrario) {
    switch (idTipoOrario) {
      case 1:
        return "Spezzato";
      case 2:
        return "Continuato";
      case 3:
        return "Solo Mattina";
      case 4:
        return "Solo Pomeriggio";
      case 5:
        return "Chiuso";
      default:
        return "Sconosciuto";
    }
  }

  function formatTime(date) {
    _logger.debug(
      `formatTime: Tentativo di conversione del valore [${JSON.stringify(
        date
      )}] in una stringa...`
    );
    // use dateStr:string in if-condition and remove (") character from JSON stringify func.
    // @khoa
    let dateStr = JSON.stringify(date);
    if (dateStr && dateStr !== "null") {
      dateStr = dateStr.replaceAll('"', "");
      const d =
        dateStr.length > 10
          ? parseISO(dateStr)
          : parseISO("2020-01-01T" + date);
      _logger.debug(`formatTime: Data ricostruita: [${JSON.stringify(d)}]`);
      return dfnsFormat(d, "HH:mm");
    } else {
      return "-";
    }
  }

  function parseTime(date) {
    return date ? parseISO("2020-01-01T" + date) : null;
  }

  /** Tenta di converteri il valore in input in una Date se è una stringa, assumendo che contenga solo l'ora nel formato HH:mm */
  const ensureDate = (val) => {
    _logger.debug(
      `ensureDate: Tentativo di conversione del valore [${JSON.stringify(
        val
      )}] in una data...`
    );
    if (!val) return null;
    if (val instanceof Date) return val;
    let d = "2020-01-01T" + (val.length < 7 ? val + ":00" : val); //assumiamo che sia una stringa con l'ora
    _logger.debug(
      `ensureDate: Tentativo di conversione del valore [${d}] in una data...d`
    );
    return parseISO(d);
  };

  return (
    <Fragment>
      <Grid
        item
        xs={3}
        className={
          backgroundColor === "gainsboro" ? styles.select : styles.select1
        }
      >
        {isInEdit() ? (
          <Select value={tipoOrario} onChange={handleChangeTipoOrario}>
            <MenuItem value="Spezzato">Spezzato</MenuItem>
            <MenuItem value="Continuato">Continuato</MenuItem>
            <MenuItem value="Mattina">Solo Mattina</MenuItem>
            <MenuItem value="Pomeriggio">Solo Pomeriggio</MenuItem>
            <MenuItem value="Chiuso">Chiuso</MenuItem>
          </Select>
        ) : (
          <Typography>{tipoOrario}</Typography>
        )}
      </Grid>
      <Grid item xs={6} className={styles.dalle}>
        <Grid
          item
          xs={3}
          className={
            backgroundColor === "gainsboro" ? styles.cell1 : styles.cell
          }
        >
          {isInEdit() ? (
            <TimePicker
              clearable
              autoOk
              ampm={false}
              value={ensureDate(mattina?.inizio)}
              onChange={(value?) => handleChangeOra(value, true, true)}
            />
          ) : (
            <Typography variant="h6">{formatTime(mattina?.inizio)}</Typography>
          )}
        </Grid>
        <Grid
          item
          xs={3}
          className={
            backgroundColor === "gainsboro" ? styles.cell : styles.cell1
          }
        >
          {isInEdit() ? (
            <TimePicker
              clearable
              autoOk
              ampm={false}
              value={ensureDate(mattina?.fine)}
              onChange={(value?) => handleChangeOra(value, true, false)}
            />
          ) : (
            <Typography variant="h6">{formatTime(mattina?.fine)}</Typography>
          )}
        </Grid>
        {/* <Grid item xs={1}></Grid> */}
        <Grid
          item
          xs={3}
          className={
            backgroundColor === "gainsboro" ? styles.cell1 : styles.cell
          }
        >
          {isInEdit() ? (
            <TimePicker
              clearable
              autoOk
              ampm={false}
              value={ensureDate(pomeriggio?.inizio)}
              onChange={(value?) => handleChangeOra(value, false, true)}
            />
          ) : (
            <Typography variant="h6">
              {formatTime(pomeriggio?.inizio)}
            </Typography>
          )}
        </Grid>
        <Grid
          item
          xs={3}
          className={
            backgroundColor === "gainsboro" ? styles.cell : styles.cell1
          }
        >
          {isInEdit() ? (
            <TimePicker
              clearable
              autoOk
              ampm={false}
              value={ensureDate(pomeriggio?.fine)}
              onChange={(value?) => handleChangeOra(value, false, false)}
            />
          ) : (
            <Typography variant="h6">{formatTime(pomeriggio?.fine)}</Typography>
          )}
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default GiornoAperturaEdit;
