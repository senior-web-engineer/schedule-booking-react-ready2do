import log from "loglevel";
import React from "react";
import { Box, makeStyles, Typography } from "@material-ui/core";
import {useSelector} from 'react-redux'
import {StruttureSelectors} from '../../store/selectors/strutture.selectors'

const _logger = log.getLogger("StrutturaOrarioView");

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
  orarioContainer: {},
  ora: {},
  oraSeparatore: {},
}));

const StrutturaOrarioView = (props) => {
  const orarioStruttura = useSelector(StruttureSelectors.getOrarioApertura);

  const styles = useStyles();
  const alignSelf = props.alignSelf ?? "flex-start";
  const flex = props.flex ?? 1;

  _logger.log(`StrutturaOrarioView->StrutturaOrarioView: ${JSON.stringify(orarioStruttura)}`);

  const writeData = (data)=>{
    if(!data) return null;
    if(typeof data !== 'string') return null;
    let parts = data.split(':',2);
    return (parts[0][0] === '0' ? parts[0][1]+':'+parts[1] : parts[0]+':'+parts[1])
  }

  const renderTipoOrarioSpezzato = (day) => {
    return (
      <span className={styles.orarioContainer}>
        <span className={styles.ora}>{writeData(day?.mattina?.inizio)}</span>
        <span className={styles.oraSeparatore}> - </span>
        <span className={styles.ora}>{writeData(day?.mattina?.fine)}</span>
        <span className={styles.oraSeparatore}>{"\u00a0 e \u00a0"}</span>
        <span className={styles.ora}>{writeData(day?.pomeriggio?.inizio)}</span>
        <span className={styles.oraSeparatore}> - </span>
        <span className={styles.ora}>{writeData(day?.pomeriggio?.fine)}</span>
      </span>
    );
  };

  const renderTipoOrarioContinuato = (day) => {
    return (
      <span className={styles.orarioContainer}>
        <span className={styles.ora}>{writeData(day?.mattina?.inizio)}</span>
        <span className={styles.oraSeparatore}> - </span>
        <span className={styles.ora}>{writeData(day?.pomeriggio?.fine)}</span>
      </span>
    );
  };

  const renderTipoOrarioMattino = (day) => {
    return (
      <span className={styles.orarioContainer}>
        <span className={styles.ora}>{writeData(day?.mattina?.inizio)}</span>
        <span className={styles.oraSeparatore}> - </span>
        <span className={styles.ora}>{writeData(day?.mattina?.fine)}</span>
      </span>
    );
  };

  const renderTipoOrarioPomeriggio = (day) => {
    return (
      <span className={styles.orarioContainer}>
        <span className={styles.ora}>{writeData(day?.pomeriggio?.inizio)}</span>
        <span className={styles.oraSeparatore}> - </span>
        <span className={styles.ora}>{writeData(day?.pomeriggio?.fine)}</span>
      </span>
    );
  };

  const renderTipoOrarioChiuso = (day) => {
    return (
      <span className={styles.orarioContainer}>
        <span className={styles.chiuso}>Chiuso</span>
      </span>
    );
  };

  const renderDay = (dayName, day) => {
      _logger.log(`StrutturaOrarioView->renderDay(${dayName}): ${JSON.stringify(day)}`)
    let orario;
    switch (day?.tipoOrario) {
      case 'Spezzato':
        orario = renderTipoOrarioSpezzato(day);
        break;
      case 'Continuato':
        orario = renderTipoOrarioContinuato(day);
        break;
      case 'Mattina':
        orario = renderTipoOrarioMattino(day);
        break;
      case 'Pomeriggio':
        orario = renderTipoOrarioPomeriggio(day);
        break;
      case 'Chiuso':
        orario = renderTipoOrarioChiuso(day);
        break;
    }
    return (
      <div className={styles.day}>
        <span>{dayName}</span>
        {orario}
      </div>
    );
  };

  const renderOrario = (orario) => {
    return (
      <div>
        {orario && orario && orario?.lunedi ? renderDay("Lun-Ven:", orario?.lunedi) : null}
        {/* {orario && orario?.martedi ? renderDay("Lunedì:", orario?.lunedi) : ""}
        {orario && orario?.mercoledi ? renderDay("Lunedì:", orario?.lunedi) : ""}
        {orario && orario?.giovedi ? renderDay("Lunedì: ", orario?.lunedi) : ""}
        {orario && orario?.venerdi ? renderDay("Lunedì:", orario?.lunedi) : ""} */}
        {orario && orario?.sabato ? renderDay("Sabato:", orario?.sabato) : ""}
        {orario && orario?.domenica ? renderDay("Domenica:", orario?.domenica) : ""}
      </div>
    );
  };

  return (
    <Box alignSelf={alignSelf} flex={flex}>
      <Typography variant="h5" gutterBottom>
        Orari
      </Typography>
      {renderOrario(orarioStruttura)}
    </Box>
  );
};

export default StrutturaOrarioView;
