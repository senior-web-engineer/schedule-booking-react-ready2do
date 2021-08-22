/* eslint-disable import/no-anonymous-default-export */
import log from 'loglevel';
import React, { useEffect, useState, Fragment } from 'react'

import { StruttureEventiAPI } from '../../api/strutture.eventi.api'
import { makeStyles, Grid, Box, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, IconButton, Paper, CircularProgress, Fab } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';

const _logger = log.getLogger('StrutturaListaTipologiaAbbonamenti');

const useStyles = makeStyles({
    root: {
        minHeight: '600px'
    },
    table: {
        minWidth: 650,
    },
});


export default (props) => {
    const idStruttura = props.idStruttura;
    const urlRoute = props.urlRoute;

    const [isLoading, setIsLoading] = useState(true);
    const [tipologieAbbonamenti, setTipologieAbbonamenti] = useState(null);

    const classes = useStyles();

    useEffect(() => {
        async function fetchTipologieAbbonamenti(page, pageSize) {
            _logger.debug(`StrutturaListaTipologiaAbbonamenti->useEffect()->fetchTipologieAbbonamenti(idStruttura: ${idStruttura})`);
            const data = await StruttureEventiAPI.FetchTipologieAbbonamentiAsync(idStruttura, page, pageSize);
            setTipologieAbbonamenti(data ?? []);
            setIsLoading(false);
        }

        if (idStruttura && idStruttura > 0) {
            //TODO: Gestire la paginazione
            fetchTipologieAbbonamenti(1, 500);
        }
    }, [idStruttura])

    function renderLoading() {
        return (
            <CircularProgress />
        )
    }

    function renderNoData() {
        return (
            <Typography variant="h6">Nessuna Tipologia Abbonamento</Typography>
        )
    }

    function renderComponent() {
        return (
            <Box>
                <Box>
                    <Typography variant="h5" align="center" >Gestione Tipologie Abbonamenti</Typography>
                    <Fab color="primary" aria-label="add" style={{float:"right", marginRight:"20px", marginTop:"-10px"}} component={Link} to={`/${urlRoute}/abbonamenti/new`}>
                        <AddIcon />
                    </Fab>
                </Box>
                {tipologieAbbonamenti && tipologieAbbonamenti.length > 0 ?
                    <TableContainer>
                        <Table className={classes.table} aria-label="Elenco tipologie abbonamenti">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nome</TableCell>
                                    <TableCell align="center">Durata (mesi)</TableCell>
                                    <TableCell align="center">Prezzo</TableCell>
                                    <TableCell align="center">Num. Ingressi</TableCell>
                                    <TableCell align="center"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tipologieAbbonamenti.map(l => (
                                    <TableRow key={l.id}>
                                        <TableCell component="th" scope="row">
                                            {l.nome}
                                        </TableCell>
                                        <TableCell align="center">{l.durataMesi}</TableCell>
                                        <TableCell align="center">{(l.costo || l.costo === 0) ? `${l.costo.toLocaleString()}\u00A0€` : '-'}</TableCell>
                                        <TableCell align="center">{l.numIngressi}</TableCell>
                                        <TableCell align="right">
                                            <IconButton aria-label="edit" component={Link} to={`/${urlRoute}/lezioni/${l.id}`} >
                                                <EditIcon />
                                            </IconButton>
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
            {isLoading ? renderLoading() : (tipologieAbbonamenti.length > 0 ? renderComponent() : renderNoData())}
        </Paper>
    )
}