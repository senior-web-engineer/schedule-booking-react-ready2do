import log from 'loglevel';
import React, { useEffect, useState, Fragment } from 'react'

import { StruttureEventiAPI } from '../../api/strutture.eventi.api'
import { makeStyles, Grid, Box, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, IconButton, Paper, CircularProgress, Fab } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import R2DLoader from '../commons/R2DLoader'

const _logger = log.getLogger('StrutturaListaTipologiaLezioni');

const useStyles = makeStyles({
    root: {
        minHeight: '600px',
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
    const [tipologieLezioni, setTipologieLezioni] = useState(null);

    const classes = useStyles();

    useEffect(() => {
        async function fetchTipologieLezioni(page, pageSize) {
            _logger.debug(`StrutturaListaTipologiaLezioni->useEffect()->fetchTipologieLezioni(idStruttura: ${idStruttura})`);
            const data = await StruttureEventiAPI.FetchTipologieLezioniAsync(idStruttura, page, pageSize);
            setTipologieLezioni(data ?? []);
            setIsLoading(false);
        }

        if (idStruttura && idStruttura > 0) {
            //TODO: Gestire la paginazione
            fetchTipologieLezioni(1, 500);
        }
    }, [idStruttura])

    function renderLoading() {
        return (
            <R2DLoader height={250} width={250} />
        )
    }


    function renderNoData() {
        return (
            <Typography variant="h6">Nessuna Tipologia Lezione</Typography>
        )
    }

    function renderComponent() {
        return (
            <Box>
                <Box>
                    <Typography variant="h5" align="center" >Gestione Tipologie Lezioni</Typography>
                    <Fab color="primary" aria-label="add" style={{ float: "right", marginRight: "20px", marginTop: "-10px" }} component={Link} to={`/${urlRoute}/lezioni/new`}>
                        <AddIcon />
                    </Fab>
                </Box>
                {tipologieLezioni && tipologieLezioni.length > 0 ?
                    <TableContainer>
                        <Table className={classes.table} aria-label="Elenco tipologie lezioni">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nome</TableCell>
                                    {/* <TableCell align="center">Livello</TableCell> */}
                                    <TableCell align="center">Prezzo</TableCell>
                                    <TableCell align="center">Durata</TableCell>
                                    <TableCell align="center"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tipologieLezioni.map(l => (
                                    <TableRow key={l.id}>
                                        <TableCell component="th" scope="row">
                                            {l.nome}
                                        </TableCell>
                                        {/* <TableCell align="right">{l.livello}</TableCell> */}
                                        <TableCell align="center">{(l.prezzo || l.prezzo === 0) ? `${l.prezzo.toLocaleString()}\u00A0€` : '-'}</TableCell>
                                        <TableCell align="center">{l.durata ? `${l.durata}\u00A0minuti` : '-'} </TableCell>
                                        <TableCell align="right">
                                            <Button startIcon={<EditIcon />} size="small" variant="outlined" component={Link} to={`/${urlRoute}/lezioni/${l.id}`} >
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
            {isLoading ? renderLoading() : (tipologieLezioni.length > 0 ? renderComponent() : renderNoData())}
        </Paper>
    )
}