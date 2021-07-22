import {
    Button, makeStyles, Switch, Table, Fab, FormControl, InputLabel, Select,
    TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, MenuItem
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import { DatePicker } from '@material-ui/pickers';
import log from 'loglevel';
import React, { Fragment, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import add from "date-fns/add";
import isDate from "date-fns/isDate";
import parseISO from "date-fns/parseISO";
import { StruttureEventiAPI } from "../../../api/strutture.eventi.api";
import { StruttureUtentiAPI } from "../../../api/strutture.utenti.api";

const _logger = log.getLogger('CertificatiUtente');

const useStyles = makeStyles({
    root: {
        minHeight: "600px",
        position: "relative"
    },
    table: {
        minWidth: 650,
    },
    FAB: {
        backgroundColor: "#000000",
        marginRight: '10px'
        
    },
    InsertButton: {
        backgroundColor: 'grey',
        color: 'white',
        marginRight: '10px'
    },
    formControlTipoCert: {
        minWidth: "180px",
        width: "90%"
    },
    controller: {
        margin: '8px 16px'
    }
});

const StyledTableCell = withStyles((theme) => ({
    head: {
        borderBottom: "none",
        padding: '5px'
    },
    body: {
      borderBottom: "none",
      padding: '5px'
    },
  }))(TableCell);
  
const CertificatiUtenteList = (props) => {
    const idStruttura = props.idStruttura;
    const idUtente = props.idUtente;
    const certificati = props.certificati;
    const onChangeHandler = props.onChangeHandler;
    const onEditHandler = props.onEditHandler;
    const certificatoUtente = props.certificatoUtente ?? {};
    const classes = useStyles();

    _logger.debug(`CertificatiUtenteList -> idStruttura: ${idStruttura}, idUtente: ${idUtente}, Certificati: ${JSON.stringify(certificati)}`);

    const initialValues = {
        dataPresentazione: certificatoUtente?.dataPresentazione ?? null,
        dataScadenza: certificatoUtente?.dataScadenza ?? null,
        note: certificatoUtente?.note
    };
    
    const { handleSubmit, control, reset, register, setValue, getValues } = useForm({
        defaultValues: initialValues
    });

    const [tipologieCert, setTipologieCert] = useState([]);
    const [tipoCert, setTipoCert] = useState(
        certificatoUtente?.tipoCert ?? -1
      );
      const [tipologieCertLoading, setTipologieCertLoading] =
        useState(true);
    
    //   useEffect(() => {
    //     //Recuperiamo le Tipologie di Abbonamento previsti
    //     async function fetchTipiCert(idStruttura) {
    //       const data = await StruttureEventiAPI.FetchTipologieCertAsync(
    //         idStruttura,
    //         1,
    //         50
    //       );
    //       _logger.debug(
    //         `CertUtente->useEffect()->fetchTipiCert(${idStruttura}) => ${JSON.stringify(
    //           data
    //         )}`
    //       );
    //       setTipologieCert(data ?? []);
    //       setTipologieCertLoading(false);
    //       initialValues.idTipoAbbonamento =certificatoUtente?.tipoCert?.id ?? "";
    //       reset(initialValues);
    //     }
    //     fetchTipiCert(idStruttura);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    //   }, [idStruttura, idUtente]);

    const handleEditCertificato = (event, idCertUtente) => {
        if(onEditHandler){onEditHandler(idCertUtente);}
    }
  
    const submitForm = async (data) => {
        _logger.debug(`Submitting form: ${JSON.stringify(data)}`)
        data.id = certificatoUtente?.id;
        data.idCliente = idStruttura;
        data.userId = idUtente;
        _logger.debug(`Aggiunta Certificato Utente - idStruttura:${idStruttura}, idUtente: ${idUtente}, Certificato: ${JSON.stringify(data)}`);
        await StruttureUtentiAPI.AddUpdateCertificatoUtenteAsync(idStruttura, idUtente, data);
        reset();
        if (onChangeHandler) { onChangeHandler() };
    }

    const handleTipoCertChanged = (event) => {
        const idTipoCert = event.target.value;
        let tipoCert = tipologieCert.find(item => item.id === idTipoCert);
        if (!tipoCert) {
            _logger.warn(`Impossibile trovare il Tipo Cert con Id: ${idTipoCert}`);
        }
        const formDataInizio = getValues('inizioValidita');
        let localDataInizio = formDataInizio ? (isDate(formDataInizio) ? formDataInizio : parseISO(formDataInizio)) : new Date();
        setTipoCert(tipoCert);
        if (!formDataInizio) {
            setValue('inizioValidita', localDataInizio);
        }
        setValue('scadenza', add(localDataInizio, { months: tipoCert.durataMesi }));
    }
    
        // convert date format
    // @khoa
    function dateFormat(dateStr) {
        let date = new Date(dateStr)

        let year = date.getFullYear();
        let month = date.getMonth()+1;
        let dt = date.getDate();

        if (dt < 10) {
        dt = '0' + dt;
        }
        if (month < 10) {
        month = '0' + month;
        }
        if(!dt || !month || !year) return '';
        return dt+'/'+month+'/'+year;
    }  

    function renderNoData() {
        return (
            <Typography variant="h6">Nessun Certificato per l'utente</Typography>
        )
    }

    function renderTable() {
        return (
            <form onSubmit={handleSubmit(submitForm)} noValidate>
            <TableContainer>
                <Table className={classes.table} aria-label="Certificati">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="left">Tipo di certificato</StyledTableCell>
                            <StyledTableCell align="center">Data Inizio</StyledTableCell>
                            <StyledTableCell align="center">Data Presentazione</StyledTableCell>
                            <StyledTableCell align="center">Data Scadenza</StyledTableCell>
                            {/* <StyledTableCell align="left">Note</StyledTableCell> */}
                            <StyledTableCell align="center">Impostazioni</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {certificati?.map(c => (
                            <TableRow key={c.id}>
                                <StyledTableCell component="th" scope="row">{c.tipoCert?.nome}</StyledTableCell>
                                <StyledTableCell align="center">{dateFormat(c?.inzio)}</StyledTableCell>
                                <StyledTableCell align="center">{dateFormat(c.dataPresentazione)}</StyledTableCell>
                                <StyledTableCell align="center">{dateFormat(c.dataScadenza)}</StyledTableCell>
                                {/* <StyledTableCell align="center">{c.note}</StyledTableCell> */}
                                <StyledTableCell align="right">
                                    {/* <Button startIcon={<EditIcon />} size="small" variant="outlined" onClick={(event)=>{handleEditCertificato(event, c.id)}} >
                                        Edit
                                    </Button> */}
                                    <Fab size="small" variant="round"
                                    className={classes.FAB}
                                    onClick={(e)=>{handleEditCertificato(e, c.id)}}>
                                    <MenuIcon style={{ color: "white" }} />
                                    </Fab>
                                </StyledTableCell>
                            </TableRow>
                        ))}
                        {/* for INSERISCI, @khoa */}
                        <TableRow>
                            <StyledTableCell component="th" scope="row">
                                <FormControl className={classes.formControlTipoCert} >
                                    <InputLabel>Tipo di certificato</InputLabel>
                                    <Controller
                                        as={
                                            <Select
                                                onChange={handleTipoCertChanged}
                                            >
                                                {
                                                    tipologieCert?.map(t => (<MenuItem key={t.id} value={t.id}>{t.nome}</MenuItem>))
                                                }
                                            </Select>
                                        }
                                        control={control}
                                        name="idTipoCert"
                                        rules={{ required: "E' necessario selezionare un tipo cert" }}
                                    />
                                </FormControl>
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                <Controller
                                    render={(props)=>(
                                        <DatePicker className={classes.controller}
                                            inputRef = {props.ref}
                                            onChange = {props.onChange}
                                            value = {props.value}
                                            margin="dense"
                                            label='Data Inizio'
                                            format="dd MMMM yyyy" />
                                    )}
                                    control={control}
                                    name="dataInizio"
                                    rules={{ required: "Inserire una data di Inizio" }}
                                />
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                <Controller
                                    render={(props)=>(
                                        <DatePicker className={classes.controller}
                                            inputRef = {props.ref}
                                            onChange = {props.onChange}
                                            value = {props.value}
                                            margin="dense"
                                            required
                                            label='Data Presentazione'
                                            format="dd MMMM yyyy" />
                                    )}
                                    control={control}
                                    name="dataPresentazione"
                                    rules={{ required: "Inserire la data di Presentazione" }}
                                />
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                <Controller
                                    render={(props)=>(
                                        <DatePicker className={classes.controller}
                                            inputRef = {props.ref}
                                            onChange = {props.onChange}
                                            value = {props.value}
                                            margin="dense"
                                            required
                                            label='Data Scadenza'
                                            format="dd MMMM yyyy" />
                                    )}
                                    control={control}
                                    name="dataScadenza"
                                    rules={{ required: "Inserire una data di Scadenza" }}
                                />
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                <Button size="small" className={classes.InsertButton} type="submit" >
                                INSERISCI
                                </Button>
                            </StyledTableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            </form>
        )
    }
       

    return (
        <Fragment>
         {/* {certificati && certificati.length > 0 ?renderTable() : renderNoData()} */}
         {renderTable()}
         </Fragment>
    )    

}

export default CertificatiUtenteList;