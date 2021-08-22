/* eslint-disable import/no-anonymous-default-export */
import * as log from "loglevel";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button, Paper } from "@material-ui/core";
import GridList from "@material-ui/core/GridList";
import { makeStyles } from "@material-ui/core/styles";
import ImageUploader from "react-images-upload";
import ImageGalleryEdit from "./ImageGalleryEdit";
import Resizer from "react-image-file-resizer";
import { StruttureSelectors } from "../../store/selectors/strutture.selectors";
import { StruttureActionsCreator } from "../../store/actions/strutture.actions";
import { Fragment } from "react";
import { Typography } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import SaveIcon from "@material-ui/icons/Save";
const _logger = log.getLogger("StrutturaEditImages");

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
    marginBottom: "20px",
  },
  text: {
    float: "right",
    display: "flow-root",
    width: "150px",
    marginTop: "10px",
  },
  gridList: {
    width: "100%",
    height: "100%",
  },
  image: {
    float: "left",
    border: "1px solid",
    height: "400px",
    minWidth: "400px",
    margin: "10px",
    maxWidth: "700px",
  },
  inputFile: {
    display: "none",
  },
  button: {
    padding: "5px",
    background: "grey",
    color: "white",
    fontSize: "12px",
    margin: "10px 0px",
    width: "inherit",
    // width: '100px',
  },
}));

export default (props) => {
  _logger.debug("StrutturaEditImages....");
  const images = useSelector(StruttureSelectors.getImages);
  const idStruttura = props.idStruttura;
  const [newImage, setNewImage] = useState({});

  const [upImg, setUpImg] = useState();
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState({ unit: "%", width: 30, aspect: 16 / 9 });
  const [completedCrop, setCompletedCrop] = useState(null);

  const [file, setFile] = useState({});
  const inputFile = useRef(null);
  const dispatch = useDispatch();
  const classes = useStyles();

  function onDrop() {
    _logger.debug(arguments);
  }

  const handleImageSaveClick = (canvas, crop) => {
    // e.preventDefault();
    if (!crop || !canvas) {
      return;
    }
    canvas.toBlob(
      (blob) => {
        let blobFile = new File([blob], "fileName.jpg", { type: "image/jpeg" });
        handleImageUpload(blobFile, null);
      },
      "image/png",
      1
    );
    // let reader = new FileReader();
    // // let file = e.target.files[0];
    // reader.onloadend = () => {
    // //   setFile(file);
    //   handleImageUpload(file, null);
    // };
    // reader.readAsDataURL(file);
  };

  const handleImageUploadClick = (e) => {
    inputFile.current.click();
  };

  // react-image-file-resizer version
  // const fileChangedHandler = (event) => {
  //   var fileInput = false;
  //   if (event.target.files[0]) {
  //     fileInput = true;
  //   }
  //   if (fileInput) {
  //     try {
  //       Resizer.imageFileResizer(
  //         event.target.files[0],
  //         1000,
  //         400,
  //         "JPEG",
  //         100,
  //         0,
  //         (uri) => {
  //           setNewImage(uri);
  // 		setFile(event.target.files[0]);
  //         },
  //         "base64",
  //         500,
  //         400
  //       );
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  // };

  // react-image-crop version
  const fileChangedHandler = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  const handleImageUpload = (file, url) => {
    const action = StruttureActionsCreator.updateStrutturaImmagine({
      file: file,
      imageKey: -1,
      imageType: "gallery",
      imageUrl: file ? null : url, //l'url lo carichiamo solo se non stiamo facendo l'upload di una nuova immagine
      imageOrder: -1,
    });
    _logger.debug(
      `ImageGalleryEdit->Upload immagine  - Dispatching action: ${JSON.stringify(
        action
      )}`
    );
    dispatch(action);
  };

  useEffect(() => {
    _logger.debug("StrutturaEditImages->useEffect()");
    async function fetchData() {
      _logger.debug("StrutturaEditImages->fetchData()");
      //if(!images || (Array.isArray(images) && images.length === 0)){
      if (idStruttura && idStruttura > 0) {
        _logger.debug(
          `StrutturaEditImages->useEffect() - Dispatching action fetchStrutturaImmagini(${idStruttura})`
        );
        const action = StruttureActionsCreator.fetchStrutturaImmagini({
          idStruttura,
        });
        dispatch(action);
      } else {
        _logger.debug(
          `images already popolated, loading not needed. idStruttura: ${idStruttura} - images: ${JSON.stringify(
            images
          )}`
        );
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idStruttura]);

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
  }, [completedCrop]);

  const resolveTipoImmagine = (idTipo) => {
    switch (idTipo) {
      case 1:
        return "sfondo";
      case 2:
        return "logo";
      default:
        return "gallery";
    }
  };
  const renderImages = () => {
    if (!images) return <div></div>;
    //Solo immagini della gallery
    let filtered = images.filter((img) => img.idTipoImmagine === 3);
    _logger.debug(`Iamges filtered: ${JSON.stringify(filtered)}`);

    return (
      <GridList
        cellHeight={"auto"}
        cols={2.5}
        spacing={10}
        className={classes.gridList}
      >
        {filtered.map((item, idx) => {
          return (
            <ImageGalleryEdit
              key={item.id}
              order={idx}
              imageKey={item.id}
              imageType={resolveTipoImmagine(item.idTipoImmagine)}
              imageUrl={item.url}
            ></ImageGalleryEdit>
          );
        })}
        <ImageGalleryEdit
          imageUploadClick={handleImageUploadClick}
        ></ImageGalleryEdit>
      </GridList>
    );
  };

  return (
    <React.Fragment>
      {/* <ImageUploader
				withIcon={true}
				buttonText='Choose images'
				onChange={onDrop}
				imgExtension={['.jpg', '.gif', '.png']}
				maxFileSize={5242880}
			/> */}
      <div className={classes.root}>
        {/* <img src={newImage} className={classes.image} alt="" /> */}
        <ReactCrop
          src={upImg}
          className={classes.image}
          onImageLoaded={onLoad}
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
        />
        <canvas
          ref={previewCanvasRef}
          // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
          style={{
            display: "none",
          }}
        />
        <div className={classes.text}>
          <Typography>Carica o cambia la tua immagine di profilo</Typography>
          <br />
          <Button className={classes.button} onClick={handleImageUploadClick}>
            <CloudUploadIcon
              style={{ color: "white", marginRight: "5px" }}
            ></CloudUploadIcon>
            CARICA IMMAGINE
          </Button>
          <Button
            className={classes.button}
            onClick={() =>
              handleImageSaveClick(previewCanvasRef.current, completedCrop)
            }
          >
            <SaveIcon style={{ color: "white", marginRight: "5px" }}></SaveIcon>{" "}
            SALVA
          </Button>
          <input
            type="file"
            accept="image/*"
            ref={inputFile}
            className={classes.inputFile}
            autoComplete="false"
            onChange={fileChangedHandler}
          ></input>
        </div>
      </div>
      <div className={classes.root}>{renderImages()}</div>
    </React.Fragment>
  );
};
