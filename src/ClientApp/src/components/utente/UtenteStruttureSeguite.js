import log from 'loglevel'
import React from 'react'
import appInsights from '../../applicationInsights'
import { UsersAPI } from '../../api/users.api'
import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, makeStyles, TableBody, Button, Typography, Box } from '@material-ui/core';
import R2DLoader from '../commons/R2DLoader';
import { Link } from 'react-router-dom';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import dfnsITLocale from 'date-fns/locale/it'
import dfnsFormat from 'date-fns/format'
import parseISO from 'date-fns/parseISO'

const _logger = log.getLogger('UtenteStruttureSeguite');

const useStyles = makeStyles(theme => ({
    root: {
        minHeight: '400px',
        position: "relative"
    },
    title: {
        paddingTop: '10px',
        marginBottom: '10px',
        fontWeight: "700"
    }
}));

export default (props) => {
    const classes = useStyles();
    const [isLoadingAbbonamenti, setIsLoadingAbbonamenti] = React.useState(true);
    const [isLoadingClienti, setIsLoadingClienti] = React.useState(true);
    const [abbonamenti, setAbbonamenti] = React.useState(null);
    const [clienti, setClienti] = React.useState(null);

    React.useEffect(() => {
        async function fetchClientiFollowed() {
            const data = await UsersAPI.GetCurrentUserClientiFollowedAsync()
            setClienti(data);
            setIsLoadingClienti(false);
        }
        async function fetchAbbonamenti() {
            const data = await UsersAPI.GetCurrentUserAbbonamentiAsync()
            if (data) {
                setAbbonamenti(data);
            } else {
                setAbbonamenti([]);
            }
            setIsLoadingAbbonamenti(false);
        }
        fetchClientiFollowed();
        fetchAbbonamenti();
    }, []);

    const isLoading = () => {
        return isLoadingClienti || isLoadingAbbonamenti;
    }

    function renderAbbonamentoForCliente(idCliente) {
        _logger.debug(`UtenteStruttureSeguite()->renderAbbonamentoForCliente(idCliente: ${idCliente}) - abbonamenti: ${JSON.stringify(abbonamenti)}`)
        const abbonamentiCliente = abbonamenti.filter(v => v.idCliente === idCliente)
            .sort((a, b) => {
                //Ordiniamo in ordine DECRESCENTE di scadenza
                if (a.scadenza > b.scadenza) { return -1 }
                else if (a.scadenza < b.scadenza) { return 1 }
                else { return 0 }
            });
        _logger.debug(`abbonamentiCliente: ${JSON.stringify(abbonamentiCliente)}`)
        if (abbonamentiCliente && abbonamentiCliente.length > 0) {
            if (abbonamentiCliente[0].scadenza < (new Date()))
                return (<span>Scaduto</span>)
            else {
                return (<span>{dfnsFormat(parseISO(abbonamentiCliente[0].scadenza), 'P', { locale: dfnsITLocale })}</span>)
            }
        } else {
            return (<span>Nessun Abbonamento</span>)
        }
    }

    function renderClienti() {
        if (clienti && clienti.length > 0) {
            return (
                <TableContainer>
                    <Table className={classes.table} aria-label="Elenco locations">
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome Struttura</TableCell>
                                <TableCell align="center">Data Associazione</TableCell>
                                <TableCell align="center">Scadenza Abbonamento</TableCell>
                                <TableCell align="center">Link</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {clienti.map(m => (
                                <TableRow key={m.id}>
                                    <TableCell component="th" scope="row">{m.nome}</TableCell>
                                    <TableCell align="center">{dfnsFormat(parseISO(m.dataFollowing), 'P p', { locale: dfnsITLocale })}</TableCell>
                                    <TableCell align="center">{renderAbbonamentoForCliente(m.idCliente)}</TableCell>
                                    <TableCell align="center">
                                        <Button size="small" variant="outlined" component={Link} to={`/${m.urlRoute}/`} >
                                            Vai
                                            </Button>

                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )
        } else {
            return (
                <Box>
                    <Typography component="div" variant="h6">Non stai ancora seguendo nessuna struttura</Typography>
                    <SentimentDissatisfiedIcon />
                </Box>
            )
        }
    }


    return (
        <Paper className={classes.root}>
            <Typography className={classes.title} align="center" variant="h5">Le mie strutture</Typography>
            {isLoading() ? <R2DLoader /> : renderClienti()}
        </Paper>
    )
}