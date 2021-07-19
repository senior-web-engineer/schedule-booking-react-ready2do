import {
    Button, makeStyles, Switch, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow, Typography
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import log from 'loglevel';
import React, { Fragment } from 'react';

const _logger = log.getLogger('AbbonamentiUtente');

const useStyles = makeStyles({
    root: {
        minHeight: "600px",
        position: "relative"
    },
    table: {
        minWidth: 650,
    },
});
const CertificatiUtenteList = (props) => {
    const idStruttura = props.idStruttura;
    const idUtente = props.idUtente;
    const certificati = props.certificati;
    const onChangeHandler = props.onChangeHandler;
    const onEditHandler = props.onEditHandler;
    const classes = useStyles();

    _logger.debug(`CertificatiUtenteList -> idStruttura: ${idStruttura}, idUtente: ${idUtente}, Certificati: ${JSON.stringify(certificati)}`);

    const handleEditCertificato = (event, idCertUtente) => {
        if(onEditHandler){onEditHandler(idCertUtente);}
    }
  
    
    function renderNoData() {
        return (
            <Typography variant="h6">Nessun Certificato per l'utente</Typography>
        )
    }

    function renderTable() {
        return (
            <TableContainer>
                <Table className={classes.table} aria-label="Certificati">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Data Presentazione</TableCell>
                            <TableCell align="left">Data Scadenza</TableCell>
                            <TableCell align="left">Note</TableCell>
                            <TableCell align="center">Azioni</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {certificati.map(c => (
                            <TableRow key={c.id}>
                                <TableCell component="th" scope="row">{c.dataPresentazione}</TableCell>
                                <TableCell align="left">{c.dataScadenza}</TableCell>
                                <TableCell align="left">{c.note}</TableCell>
                                <TableCell align="right">
                                    <Button startIcon={<EditIcon />} size="small" variant="outlined" onClick={(event)=>{handleEditCertificato(event, c.id)}} >
                                        Edit
                                    </Button>

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
       

    return (
        <Fragment>
         {certificati && certificati.length > 0 ?renderTable() : renderNoData()}
         </Fragment>
    )    

}

export default CertificatiUtenteList;