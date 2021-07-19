import * as log from 'loglevel';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Grid, Box, Paper, Typography, makeStyles, Button } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { UserSelectors } from '../../store/selectors/user.selectors'
import { StruttureSelectors } from '../../store/selectors/strutture.selectors'
import { StruttureActionsCreator } from '../../store/actions/strutture.actions'
import { UserActionsCreator } from '../../store/actions/user.actions'

import R2DCalendariContainer from './R2DCalendariContainer'
import StrutturaMap from './StrutturaMap';

import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import StrutturaContattiView from './StrutturaContattiView';
import StrutturaOrarioView from './StrutturaOrarioView';



const _logger = log.getLogger("StrutturaHome");

const useStyles = makeStyles(theme => ({
    logoContainer: {
        //display:"inline",
        width: "300px",
        height: "300px",
        float: "left"
    },
    logo: {
        //display:"inline",
        maxWidth: "296px",
        maxHeight: "296px"
    },
    descriptionBox: {
        //display:"inline"
        marginLeft: "310px",
        minHeight: "300px",
        paddingLeft: "15px"
    },
    descriptionBoxHeader: {
        paddingTop: "20px",
        paddingBottom: "10px",

        '& .descriptionBoxTitle': {
            marginRight: "110px",
            display: "inline",
        },

        '& .followButton': {
            float: "right",
            backgroundColor: "#E31F4F",
            color: "white",
            width: "100px",
            marginRight: "4px",
            marginTop: "-15px"
        },

        '& .unFollowButton': {
            float: "right",
            backgroundColor: "#636363",
            color: "white",
            width: "100px",
            marginRight: "4px",
            marginTop: "-15px"
        },

        '& .descriptionBoxText': {

        }
    },

    galleryContainer: {
        marginTop: "10px",
        height: "400px",
        position: "relative",

        '& .galleryCarousel': {
            height: "100%"
        },

        '& .bannerGrid': {
            height: "100%"
        },

        '& .galleryMedia': {
            height: "400px",
            '&:hover': {
                opacity: "0.8"
            }
        }
    },

    calendarContainer: {
        marginTop: "10px"
    },

    mapContainer: {
        marginTop: "10px",
        width: "672px",
        height: "400px",
        float: "left"
    },

    addressContainer: {
        marginLeft: "692px",
        marginTop: "10px",
        paddingLeft: "10px",
        height: "400px",
    },

    addressContainerBox: {
        minHeight: "400px"
    }
}));

export default (props) => {
    const anagraficaStruttura = props.anagraficaStruttura;
    const classes = useStyles();
    const dispatch = useDispatch();
    const defaultLogo = "./images/icon_handover.png"
    const images = useSelector(StruttureSelectors.getImages);
    const struttureSeguite = useSelector(UserSelectors.getStruttureSeguite) ?? [];

    //NOTA: Ho il sospetto che le immagini vengano scaricate più volte del necessario
    useEffect(() => {
        _logger.debug("StrutturaHome->useEffect()");
        async function fetchData() {
            _logger.debug(`StrutturaHome->fetchData() - Struttura: ${JSON.stringify(anagraficaStruttura)}`);

            if (!images || images.length === 0) {
                _logger.debug(`StrutturaHome->useEffect() - Dispatching action fetchStrutturaImmagini(${anagraficaStruttura.id})`);
                const action = StruttureActionsCreator.fetchStrutturaImmagini({ idStruttura: anagraficaStruttura.id });
                dispatch(action);
            } else {
                _logger.debug(`images already popolated, loading not needed. idStruttura: ${anagraficaStruttura.id} - images: ${JSON.stringify(images)}`);
            }
        };
        if (anagraficaStruttura && anagraficaStruttura.id) {
            fetchData();
        }
        else {
            _logger.debug(`struttura non ancora caricata, impossibile recuperare le immagini.`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [anagraficaStruttura, images])


    function isStrutturaSeguita() {
        const result = (struttureSeguite?.findIndex(v => v.idCliente === anagraficaStruttura?.id) >= 0);
        _logger.debug(`StrutturaHome->isStrutturaSeguita()-> return: ${result} - struttureSeguite: ${struttureSeguite}`);
        console.log(struttureSeguite)
        return result;
    }

    function handleUnfollowStruttura() {
        const action = UserActionsCreator.r2dUnFollowStrutturaRequested(anagraficaStruttura.id);
        dispatch(action);
    }

    function handleFollowStruttura() { 
        const action = UserActionsCreator.r2dFollowStrutturaRequested(anagraficaStruttura.id);
        _logger.debug(`StrutturaHome->handleFollowStruttura()-> Dispatch action r2dFollowStrutturaRequested(${anagraficaStruttura.id})`);
        dispatch(action);
    }

    return (
        <Grid container>
            <Grid item xs={12}>
                <Paper className={classes.logoContainer}>
                    <img className={classes.logo} alt="logo" src={anagraficaStruttura.logoUrl ?? defaultLogo}></img>
                </Paper>
                <Paper className={classes.descriptionBox}>
                    <Box className={classes.descriptionBoxHeader}>
                        <Typography className="descriptionBoxTitle" variant="h5">Benvenuti a {anagraficaStruttura.nome}</Typography>
                        {/* TODO: Gestire il pulsane segui / non seguire in base allo stato dell'utente*/}
                        {isStrutturaSeguita()
                            ? <Button variant="contained" startIcon={<FavoriteIcon />} className="unFollowButton" onClick={handleUnfollowStruttura}>SEGUITO</Button>
                            : <Button variant="contained" startIcon={<FavoriteIcon />} className="followButton" onClick={handleFollowStruttura}>SEGUI</Button>
                        }
                    </Box>
                    <Box className="descriptionBoxText">
                        <Typography variant="body1">{anagraficaStruttura.descrizione}</Typography>
                    </Box>
                </Paper>
            </Grid>

            <Grid item xs={12}>
                <Paper className={classes.galleryContainer}>
                    <Carousel className="galleryCarousel"
                        autoPlay={true}
                        interval={5000}
                        infiniteLoop={true}
                        showThumbs={false}
                    >
                        {
                            images.map((item, index) => {
                                return (
                                    <Box key={index}>
                                        <img key={index} src={item.url} className="galleryMedia" alt={item.alt} />
                                    </Box>
                                )
                            })
                        }
                    </Carousel>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper className={classes.calendarContainer}>
                    <R2DCalendariContainer idStruttura={anagraficaStruttura.id} urlRoute={anagraficaStruttura.urlRoute} renderMode="view"></R2DCalendariContainer>
                </Paper>
            </Grid>

            <Grid item xs={12}>
                <Paper className={classes.mapContainer}>
                    <StrutturaMap
                        lat={anagraficaStruttura.latitudine}
                        lng={anagraficaStruttura.longitudine}
                    >
                    </StrutturaMap>
                </Paper>
                <Paper className={classes.addressContainer}>
                    <Box display="flex" className={classes.addressContainerBox}
                        flexDirection="column" alignItems="stretch" alignContent="space-between">
                        <StrutturaOrarioView flex={1} struttura={anagraficaStruttura} ></StrutturaOrarioView>
                        <StrutturaContattiView struttura={anagraficaStruttura} ></StrutturaContattiView>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    )
}