import {
    Button, makeStyles, Switch, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow, Typography
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import log from 'loglevel';
import React, { Fragment } from 'react';
import { StruttureEventiAPI } from "../../../api/strutture.eventi.api";
import { useSnackbar } from 'notistack';

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
const PrenotazioniUtenteList = (props) => {
    const idStruttura = props.idStruttura;
    const idUtente = props.idUtente;
    const prenotazioni  = props.prenotazioni;
    const onChangeHandler = props.onChangeHandler;
    const onEditHandler = props.onEditHandler;
    const classes = useStyles();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    
    _logger.debug(`PrenotazioniUtenteList -> idStruttura: ${idStruttura}, idUtente: ${idUtente}, Prenotazioni: ${JSON.stringify(prenotazioni)}`);

    const handleEditPrenotazione = (event, idPrenotazione) => {
        //ATTENZIONE! L'Id può far riferimento a vari tipi di prenotazioni (confermate, non confermate, wl)
        if(onEditHandler){onEditHandler(idPrenotazione);}
    }

    const handleDeletePrenotazione = async (kind, idEvento, idPrenotazione) => {

        switch(kind){
            case 'Confermato':
                await StruttureEventiAPI.AnnullaPrenotazioneByAdminAsync (idStruttura, idEvento, idPrenotazione);
                enqueueSnackbar('Prenotazione cancellata', {variant: "success"})
                break;
            case 'NonConfermato':
                await StruttureEventiAPI.RifiutaAppuntamentoNonConfermatoByAdminAsync(idStruttura, idEvento, idPrenotazione);
                enqueueSnackbar('Prenotazione cancellata', {variant: "success"})
                break;
            case 'WaitList':
                enqueueSnackbar('Cancellazione dalla wait list non supportata', {variant: "error"})
                break;
        }
        if(onChangeHandler){onChangeHandler(idPrenotazione);}
    }
    
  

    function renderNoData() {
        return (
            <Typography variant="h6">Nessuna Prenotazione per l'utente</Typography>
        )
    }

    function renderTable() {
        return (
            <TableContainer>
                <Table className={classes.table} aria-label="Prenotazioni">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Nome Lezione</TableCell>
                            <TableCell align="left">Data Prenotazione</TableCell>
                            <TableCell align="left">Data Lezione</TableCell>
                            <TableCell align="left">Stato</TableCell>
                            <TableCell align="center">Azioni</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {prenotazioni.map(p => (
                            <TableRow key={p.id}>
                                <TableCell component="th" scope="row">{p.nome}</TableCell>
                                <TableCell align="left">{p.dataPrenotazione}</TableCell>
                                <TableCell align="left">{p.dataLezione}</TableCell>
                                <TableCell align="left">{p.stato}</TableCell>
                                <TableCell align="right">
                                <Button startIcon={<DeleteIcon />} size="small" variant="outlined" color="secondary" onClick={(event)=>{handleDeletePrenotazione(p.kind, p.idEvento, p.originalId)}} >
                                        Elimina
                                    </Button>
                                    {/* <Button startIcon={<EditIcon />} size="small" variant="outlined" onClick={(event)=>{handleEditPrenotazione(event, p.id)}} >
                                        Edit
                                    </Button> */}

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
         {prenotazioni && prenotazioni.length > 0 ?renderTable() : renderNoData()}
         </Fragment>
    )    

}

export default PrenotazioniUtenteList;