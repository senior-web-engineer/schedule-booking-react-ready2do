import * as log from "loglevel";
import React, { useState, useEffect, Fragment, useRef } from "react";
import { useDispatch } from "react-redux";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Button,
  GridListTile,
  GridListTileBar,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import EditIcon from "@material-ui/icons/Edit";
import InfoIcon from "@material-ui/icons/Info";
import DeleteIcon from "@material-ui/icons/Delete";
import UploadIcon from "@material-ui/icons/Publish";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Brightness1RoundedIcon from "@material-ui/icons/Brightness1Rounded";
import PropTypes from "prop-types";
import { StruttureActionsCreator } from "../../store/actions/strutture.actions";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  tile: {
    height: "230px",
    width: "480px",
    padding: "5px",
    "& div:nth-of-type(1)": { border: "1px solid" },
  },
  tileImage: {
    maxHeight: "230px",
    maxWidth: "482px",
  },
  tileBar: {
    background: "grey",
    "& div:nth-of-type(1)": { display: "none" },
    "& div:nth-of-type(2)": { width: "100%", height: "100%" },
  },

  icon: {
    top: "10px",
    right: "10px",
    position: "absolute",
    fontSize: 40,
  },

  topTitle: {
    borderRadius: "50px 50px 50px 50px",
    background: "grey",
    padding: "20px",
    width: "50px",
    height: "50px",
    position: "absolute",
    top: "-40px",
    left: "-40px",
    border: "none !important",
  },
  topContent: {
    left: "55px",
    top: "32px",
    position: "absolute",
    color: "white",
    fontSize: "larger",
  },
  topContentPlus: {
    left: "48px",
    top: "32px",
    position: "absolute",
    color: "white",
    fontSize: "larger",
  },
  contentPlus: {
    textAlign: "center",
    color: "grey",
    border: "none !important",
    fontSize: 30,
  },
  btnModifica: {
    width: "50%",
    color: "white",
    height: "inherit",
  },
  btnElimina: {
    width: "50%",
    color: "white",
    height: "inherit",
  },
  inputFile: {
    display: "none",
  },
}));

/**
 * Il componente permette l'edit di una singola immagine della gallery.
 * Permette di:
 *  - visualizzare un'immagine gi?? caricata
 *  - caricare una nuova immagine
 *  - eliminare un'immagine gi?? caricata
 *  - sostituire un'immagine precedentemente caricata con un'altra
 * @param {*} props
 */
const ImageGalleryEdit = (props) => {
 
  const _logger = log.getLogger("ImageGallery");
  const order = props.order ?? -1;
  const imageKey = props.imageKey ?? -1;
  const imageOrder = props.order ?? 0;
  const imageType = props.imageType ?? 3;
  const imageUploadClick = props.imageUploadClick;
  const [imageUrl, setImageUrl] = useState(props.imageUrl);
  const [file, setFile] = useState({});
  const classes = useStyles();
  const dispatch = useDispatch();
  const inputFile = useRef(null);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const isMediumScreen = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const isLargeScreen = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  //NOTA: se useEffect ritorna una funzione, questa viene invocata come cleanup quando cambia la dipendenza
  useEffect(
    () => () => {
      //Siamo nella funzione di cleanup, invocata prima di aggiornare lo stato (quindi con il vecchio stato)
      //Rimuoviamo l'URL associato al file per evitare Memory leaks (solo se il file ?? stato caricato dal componente e non se )
      if (file && imageUrl) {
        URL.revokeObjectURL(imageUrl); //Tecnicamente se l'URL schema non ?? "blob" dovrebbe essere una NOP
      }
    },
    [file, imageUrl]
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    noKeyboard: true, //disabilitiamo l'apertura del file dialog da tastiera
    noClick: true, //disabilitiamo l'apertura del file dialog tramite click sull'intera drop zone
    accept: "image/*",
    multiple: false, //accettiamo un singolo file
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length === 0) {
        _logger.warn("Nessun file accettato.");
        return;
      }
      //In teoria dovrebbe esserci solo un file accettato, se ce ne dovesse essere pi?? di uno prendiamo l'ultimo
      let file = acceptedFiles[acceptedFiles.length - 1];
      let url = URL.createObjectURL(file);
      setImageUrl(url);
      setFile(file);
      handleImageUpload(file, url);
      //TODO: caricare il file sul server
    },
  });

  const getIdImageType = () => {
    switch (imageType) {
      case "logo":
        return 1;
      case "sfondo":
        return 2;
      default:
        return 3;
    }
  };

  const handleImageUpload = (file, url) => {
    const action = StruttureActionsCreator.updateStrutturaImmagine({
      file: file,
      imageKey: imageKey,
      imageType: getIdImageType(),
      imageUrl: file ? null : url, //l'url lo carichiamo solo se non stiamo facendo l'upload di una nuova immagine
      imageOrder: imageOrder,
    });
    _logger.debug(
      `ImageGalleryEdit->Upload immagine  - Dispatching action: ${JSON.stringify(
        action
      )}`
    );
    dispatch(action);
  };

  const removeFile = (idImage) => {
    //Invoco l'API per rimuovere il file corrente
    //TODO: IMPLEMENTARE
    const actionDelete =
      StruttureActionsCreator.removeStrutturaImmagine(idImage);
    _logger.debug(
      `OrarioAperturaEdit->Salvataggio nuovo orario apertura - Dispatching action: ${JSON.stringify(
        actionDelete
      )}`
    );
    dispatch(actionDelete);
  };

  const handleImageUploadClick = (e) => {
    _logger.debug("Inside handleImageUploadClick");
    //forziamo l'apertura del dialo di caricamento dell'immagine
    //open();
    inputFile.current.click();
    //Dopo che l'utente ha selezionato il file, cosa succede? viene scatenato l'evento onDrop?
  };

  const handleImageDeleteClick = (e) => {
    _logger.debug("Inside handleImageDeleteClick");
    removeFile(imageKey);
  };

  const handleFileChange = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      setFile(file);
      setImageUrl(reader.result);
      handleImageUpload(file, null);
    };
    reader.readAsDataURL(file);
  };

  const dropzoneInlineStyle = {
    backgroundImage: `url(${imageUrl})`,
  };

  const getNumCols = () => {
    if (isSmallScreen) {
      return 1;
    } else {
      return 2;
    }
  };

  return order !== -1 ? (
    <GridListTile key={imageKey} cols={1} rows={1} className={classes.tile}>
      <img alt="" src={imageUrl} className={classes.tileImage}></img>
      {/* <div {...getRootProps({className: 'dropzone'})} style={dropzoneInlineStyle}>
                    <input {...getInputProps()}></input>            
                </div>  */}
      <div className={classes.topTitle}>
        <p className={classes.topContent}>{order + 1}</p>
      </div>
      <GridListTileBar
        className={classes.tileBar}
        actionIcon={
          <Fragment>
            <Button
              variant="outlined"
              className={classes.btnModifica}
              onClick={handleImageUploadClick}
              startIcon={<EditIcon />}
            >
              Modifica
            </Button>
            <Button
              variant="outlined"
              className={classes.btnElimina}
              onClick={handleImageDeleteClick}
              startIcon={<DeleteIcon />}
            >
              Elimina
            </Button>
            <input
              type="file"
              accept="image/*"
              ref={inputFile}
              className={classes.inputFile}
              autoComplete="false"
              onChange={handleFileChange}
            ></input>
            {/* <IconButton aria-label={`Modifica`} className={classes.icon}>
                  <InfoIcon />
                </IconButton>
                <IconButton aria-label={`Elimina`} className={classes.icon}>
                  <InfoIcon />
                </IconButton> */}
          </Fragment>
        }
      />
      {/* <div {...getRootProps({className: 'dropzone'})} style={dropzoneInlineStyle}>
                    <input {...getInputProps()}></input>            
                </div>
                <div>
                    <Button onClick={handleImageUploadClick}>Carica</Button>
                    <Button onClick={handleImageDeleteClick}>Elimina</Button>
                </div> */}
    </GridListTile>
  ) : (
    <GridListTile key={imageKey} cols={1} rows={1} className={classes.tile}>
      <div className={classes.contentPlus}>
        <p style={{ margin: "15px 0 0 0" }}>NUOVA IMMAGINE</p>
        <InfoIcon className={classes.icon}></InfoIcon>
        <AddCircleOutlineIcon
          style={{ fontSize: 100, color: "grey", cursor: "pointer" }}
          onClick={props.imageUploadClick}
        ></AddCircleOutlineIcon>
      </div>
      <div className={classes.topTitle}>
        <p className={classes.topContentPlus}>
          <AddCircleOutlineIcon></AddCircleOutlineIcon>
        </p>
      </div>
      <GridListTileBar
        className={classes.tileBar}
        actionIcon={<Fragment></Fragment>}
      />
    </GridListTile>
  );
  /*
      useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <section className="container">
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside style={thumbsContainer}>
        {thumbs}
      </aside>
    </section>
  );
  */
};

ImageGalleryEdit.propTypes = {
  imageUrl: PropTypes.string,
  imageType: PropTypes.oneOf(["sfondo", "logo", "gallery"]),
  imageKey: PropTypes.number,
};

export default ImageGalleryEdit;
