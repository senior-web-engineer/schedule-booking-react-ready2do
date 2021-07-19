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
const AbbonamentiUtenteList = (props) => {
    const idStruttura = props.idStruttura;
    const idUtente = props.idUtente;
    const abbonamenti = props.abbonamenti;
    const onChangeHandler = props.onChangeHandler;
    const editAbbonamentoHandler = props.onEditAbbonamento;
    const classes = useStyles();

    _logger.debug(`AbbonamentiUtente -> idStruttura: ${idStruttura}, idUtente: ${idUtente}`);

    _logger.debug(`AbbonamentiUtente -> Abbonamenti: ${JSON.stringify(abbonamenti)}`);

    const handlePaymentChange = (idAbbonamentoUtente, event) => {
        _logger.debug(`IdAbonamento: ${idAbbonamentoUtente}`);
        _logger.debug(`event: ${event}`);
        let abbonamento = abbonamenti?.find(a=>a.id === idAbbonamentoUtente);
        if(abbonamento){
            _logger.debug(`Aggiornato Importo Pagato per abbonamento: ${abbonamento?.id}`);
            abbonamento.importoPagato = abbonamento.importo;
            if(onChangeHandler){onChangeHandler();}
        }
    };

    const handleEditAbbonamento = (event, idAbbUtente) => {
        if(editAbbonamentoHandler){editAbbonamentoHandler(idAbbUtente);}
    }
  
    


    function renderNoData() {
        return (
            <Typography variant="h6">Nessun Abbonamento per l'utente</Typography>
        )
    }

    function renderTable() {
        return (
            <TableContainer>
                <Table className={classes.table} aria-label="Abbonamenti">
                    <TableHead>
                        <TableRow>
                            <TableCell>Tipo Abbonamento</TableCell>
                            <TableCell align="center">Data Inizio</TableCell>
                            <TableCell align="center">Data Fine</TableCell>
                            <TableCell align="center">Ingressi(Residui-Totali)</TableCell>
                            <TableCell align="center">Saldato</TableCell>
                            <TableCell align="center">Azioni</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {abbonamenti.map(a => (
                            <TableRow key={a.id}>
                                <TableCell component="th" scope="row">{a.tipoAbbonamento?.nome}</TableCell>
                                <TableCell align="left">{a.dataInizioValidita}</TableCell>
                                <TableCell align="left">{a?.scadenza}</TableCell>
                                <TableCell align="left">{a.ingressiResidui ?? a.ingressiIniziali} di {a.ingressiIniziali}</TableCell>
                                <TableCell align="left">
                                    <Switch checked={(a.importo ?? 0) === (a.importoPagato ?? 0)} color="default" onChange={(e)=>{handlePaymentChange(a.id, e);}} />
                                    </TableCell>
                                <TableCell align="right">
                                    <Button startIcon={<EditIcon />} size="small" variant="outlined" onClick={(e)=>{handleEditAbbonamento(e, a.id)}} >
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
         {abbonamenti && abbonamenti.length > 0 ?renderTable() : renderNoData()}
         </Fragment>
    )    

}

export default AbbonamentiUtenteList;