/* eslint-disable import/no-anonymous-default-export */
import * as log from "loglevel";
import React, { useState, Fragment } from "react";
// import Fragment from '@material-ui/core'
import clsx from "clsx";
import { Typography, Paper, Box, Button, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from "react-google-autocomplete";
import GoogleMapReact from "google-map-react";
import InfoIcon from "@material-ui/icons/Info";
import RoomIcon from "@material-ui/icons/Room";
import { StruttureActionsCreator } from "../../store/actions/strutture.actions";
import { useDispatch } from "react-redux";

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
    width: "100%",
    // height: '250px'
  },
  map: {
    height: "250px !important",
    margin: "8px 0px",
    // width: '100%'
  },
}));
export default (props) => {
  const _logger = log.getLogger("IndirizzoEdit");
  const styles = useStyles();
  const dispatch = useDispatch();
  const [viewMode, setViewMode] = useState(props.viewMode || "view");
  const [indirizzo, setIndirizzo] = useState(props.indirizzo || "");
  const [coordinate, setCoordinate] = useState(
    props.coordinate || {
      lat: 59.95,
      lng: 30.33,
    }
  );
  const isInEdit = () => viewMode === "edit";

  const handleButtonClick = (e) => {
    if (isInEdit()) {
      //Dispatch del nuovo valore allo store
      //TUNING: Verificare se lo stato è cambiato effettivamente prima di fare il dispatch dell'azione
      const action = StruttureActionsCreator.updateStrutturaProp(
        "indirizzo",
        indirizzo
      );
      _logger.debug(
        `OrarioAperturaEdit->Salvataggio nuovo indirizzo - Dispatching action: ${JSON.stringify(
          action
        )}`
      );
      dispatch(action);
      setViewMode("view");
    } else {
      setViewMode("edit");
    }
  };

  return (
    <Fragment>
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
              onClick={handleButtonClick}
            >
              {isInEdit() ? "Salva" : "Modifica"}
            </Button>
          </Box>
          <Box className={styles.headerTitle}>
            <Typography variant="h6">Indirizzo</Typography>
          </Box>
          <Box className={styles.headerInfo}>
            <Tooltip title={props.tooltip}>
              <InfoIcon></InfoIcon>
            </Tooltip>
          </Box>
        </Box>
        <Box className={styles.contentBox}>
          {isInEdit() ? (
            <Autocomplete
              style={{ width: "90%" }}
              onPlaceSelected={(place) => {
                setIndirizzo(place?.formatted_address);
              }}
              types={["address"]}
              componentRestrictions={{ country: "it" }}
            />
          ) : (
            <Typography variant="body2" gutterBottom>
              {indirizzo}
            </Typography>
          )}
        </Box>
      </Paper>
      <Paper className={styles.map}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyB3QBIUnHrigeqjjnEmwZn717ixOCcMYUw" }}
          defaultCenter={coordinate}
          defaultZoom={16}
        >
          <RoomIcon
            color="secondary"
            lat={coordinate.lat}
            lng={coordinate.lng}
            text="My Marker"
          ></RoomIcon>
        </GoogleMapReact>
      </Paper>
    </Fragment>
  );
};
