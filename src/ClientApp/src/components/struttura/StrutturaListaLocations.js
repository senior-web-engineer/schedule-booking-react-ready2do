import log from 'loglevel';
import React, { useEffect, useState, Fragment } from 'react'

import { StruttureEventiAPI } from '../../api/strutture.eventi.api'
import {
    makeStyles, Grid, Box, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button,
    IconButton, Paper, Fab
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import R2DLoader from '../commons/R2DLoader';

const _logger = log.getLogger('StrutturaListaLocations');

const useStyles = makeStyles({
    root: {
        minHeight: "600px",
        position: "relative"
    },
    table: {
        minWidth: 650,
    },
});


export default (props) => {
    const idStruttura = props.idStruttura;
    const urlRoute = props.urlRoute;

    const [isLoading, setIsLoading] = useState(true);
    const [locations, setLocations] = useState(null);

    const classes = useStyles();

    useEffect(() => {
        async function fetchLocations() {
            _logger.debug(`StrutturaListaLocations->useEffect()->fetchLocations(idStruttura: ${idStruttura})`);            
            const data = await StruttureEventiAPI.FetchLocationsAsync(idStruttura);
            _logger.debug(`StrutturaListaLocations->useEffect()->fetchLocations(data: ${JSON.stringify(data)})`);
            setLocations(data ?? []);
            setIsLoading(false);
        }

        if (idStruttura && idStruttura > 0) {
            fetchLocations();
        }
    }, [idStruttura])

    function renderLoading() {
        return (
            <R2DLoader />
        )
    }

    function renderNoData() {
        return (
            <Typography variant="h6">Nessuna location</Typography>
        )
    }

    function renderComponent() {
        return (
            <Box>
                <Box>
                    <Typography variant="h5">Gestione Locations</Typography>
                    <Fab color="primary" aria-label="add" style={{ float: "right", marginRight: "20px", marginTop: "-10px" }} component={Link} to={`/${urlRoute}/locations/new`}>
                        <AddIcon />
                    </Fab>
                </Box>
                {locations && locations.length > 0 ?
                    <TableContainer>
                        <Table className={classes.table} aria-label="Elenco locations">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nome</TableCell>
                                    <TableCell align="center">Capienza</TableCell>
                                    {/* <TableCell align="center">Colore</TableCell> */}
                                    <TableCell align="center"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {locations.map(l => (
                                    <TableRow key={l.id}>
                                        <TableCell component="th" scope="row">
                                            {l.nome}
                                        </TableCell>
                                        <TableCell align="center">{l.capienzaMax ?? '-'}</TableCell>
                                        {/* <TableCell align="center"><Box style={{ margin: 'auto', width: '30px', height: '30px', backgroundColor: l.colore }}></Box></TableCell> */}
                                        <TableCell align="right">
                                            <Button startIcon={<EditIcon />} size="small" variant="outlined" component={Link} to={`/${urlRoute}/locations/${l.id}`} >
                                                Edit
                                            </Button>

                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    :
                    renderNoData()
                }
            </Box>
        )
    }

    return (
        <Paper className={classes.root}>
            {isLoading ? renderLoading() : (locations.length > 0 ? renderComponent() : renderNoData())}
        </Paper>
    )
}