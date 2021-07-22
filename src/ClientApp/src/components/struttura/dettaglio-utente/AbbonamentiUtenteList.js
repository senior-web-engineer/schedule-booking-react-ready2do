import {
  Button,
  makeStyles,
  Switch,
  Table,
  Fab,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  FormControl,
  FormControlLabel,
  Select,
  InputLabel,
  MenuItem,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import EditIcon from "@material-ui/icons/Edit";
import { withStyles } from "@material-ui/core/styles";
import { DatePicker } from "@material-ui/pickers";
import log from "loglevel";
import React, { Fragment, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import add from "date-fns/add";
import isDate from "date-fns/isDate";
import parseISO from "date-fns/parseISO";
import { StruttureEventiAPI } from "../../../api/strutture.eventi.api";
import { StruttureUtentiAPI } from "../../../api/strutture.utenti.api";

const _logger = log.getLogger("AbbonamentiUtente");

const useStyles = makeStyles({
  root: {
    minHeight: "600px",
    position: "relative",
  },
  table: {
    minWidth: 650,
  },
  FAB: {
    backgroundColor: "#000000",
    marginRight: "10px",
  },
  InsertButton: {
    backgroundColor: "grey",
    color: "white",
    marginRight: "10px",
  },
  formControlTipoAbbonamento: {
    // marginTop: "16px",
    // marginBottom: "8px",
    minWidth: "180px",
    width: "90%",
  },
  controller: {
    margin: "8px 16px",
  },
});

const StyledTableCell = withStyles((theme) => ({
  head: {
    borderBottom: "none",
    padding: "5px",
  },
  body: {
    borderBottom: "none",
    padding: "5px",
  },
}))(TableCell);

const AbbonamentiUtenteList = (props) => {
  const idStruttura = props.idStruttura;
  const idUtente = props.idUtente;
  const abbonamenti = props.abbonamenti;
  const onChangeHandler = props.onChangeHandler;
  const editAbbonamentoHandler = props.onEditAbbonamento;
  const abbonamentoUtente = props.abbonamentoSelezionato;
  const classes = useStyles();

  _logger.debug(
    `AbbonamentiUtente -> idStruttura: ${idStruttura}, idUtente: ${idUtente}`
  );

  _logger.debug(
    `AbbonamentiUtente -> Abbonamenti: ${JSON.stringify(abbonamenti)}`
  );

  // const handlePaymentChange = (idAbbonamentoUtente, event) => {
  //     _logger.debug(`IdAbonamento: ${idAbbonamentoUtente}`);
  //     _logger.debug(`event: ${event}`);
  //     let abbonamento = abbonamenti?.find(a=>a.id === idAbbonamentoUtente);
  //     if(abbonamento){
  //         _logger.debug(`Aggiornato Importo Pagato per abbonamento: ${abbonamento?.id}`);
  //         abbonamento.importoPagato = abbonamento.importo;
  //         if(onChangeHandler){onChangeHandler();}
  //     }
  // };

  const handleEditAbbonamento = (event, idAbbUtente) => {
    if (editAbbonamentoHandler) {
      editAbbonamentoHandler(idAbbUtente);
    }
  };

  // @khoa
  const initialValues = {
    idTipoAbbonamento: "", //Lo valoriziamo dopo che ritorna la chiamata all'API altrimenti otteniamo un warning perché non sono ancora stati caricati i valori della select
    dataInizioValidita: abbonamentoUtente?.dataInizioValidita ?? null,
    scadenza: abbonamentoUtente?.scadenza ?? null,
    ingressiIniziali: abbonamentoUtente?.ingressiIniziali ?? "",
    ingressiResidui: abbonamentoUtente?.ingressiResidui ?? "",
    importo: abbonamentoUtente?.importo ?? "",
    saldato:
      (abbonamentoUtente?.importo ?? 0) ===
      (abbonamentoUtente?.importoPagato ?? 0),
  };

  const { register, handleSubmit, control, reset, setValue, getValues } =
    useForm({
      defaultValues: initialValues,
    });

  const [tipologieAbbonamenti, setTipologieAbbonamenti] = useState([]);
  const [tipoAbbonamento, setTipoAbbonamento] = useState(
    abbonamentoUtente?.tipoAbbonamento ?? -1
  );
  const [tipologieAbbonamentiLoading, setTipologieAbbonamentiLoading] =
    useState(true);

  useEffect(() => {
    //Recuperiamo le Tipologie di Abbonamento previsti
    async function fetchTipiAbbonamenti(idStruttura) {
      const data = await StruttureEventiAPI.FetchTipologieAbbonamentiAsync(
        idStruttura,
        1,
        50
      );
      _logger.debug(
        `AbbonamentiUtente->useEffect()->fetchTipiAbbonamenti(${idStruttura}) => ${JSON.stringify(
          data
        )}`
      );
      setTipologieAbbonamenti(data ?? []);
      setTipologieAbbonamentiLoading(false);
      initialValues.idTipoAbbonamento =
        abbonamentoUtente?.tipoAbbonamento?.id ?? "";
      reset(initialValues);
    }
    fetchTipiAbbonamenti(idStruttura);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idStruttura, idUtente]);

  const submitForm = async (data) => {
    _logger.debug(`Submitting form: ${JSON.stringify(data)}`);
    data.id = abbonamentoUtente?.id;
    data.idCliente = idStruttura;
    data.userId = idUtente;
    data.importoPagato = data.saldato ? data.importo : 0;
    _logger.debug(
      `Aggiunta Abbonamento Utente - idStruttura:${idStruttura}, idUtente: ${idUtente}`
    );
    await StruttureUtentiAPI.AddUpdateAbbonamentoUtenteAsync(
      idStruttura,
      idUtente,
      data
    );
    reset();
    onChangeHandler();
  };

  const handleTipoAbbonamentChanged = (event) => {
    const idTipoAbb = event.target.value;
    let tipoAbbonamento = tipologieAbbonamenti.find(
      (item) => item.id === idTipoAbb
    );
    if (!tipoAbbonamento) {
      _logger.warn(
        `Impossibile trovare il Tipo Abbonamento con Id: ${idTipoAbb}`
      );
    }
    const formDataInizio = getValues("inizioValidita");
    let localDataInizio = formDataInizio
      ? isDate(formDataInizio)
        ? formDataInizio
        : parseISO(formDataInizio)
      : new Date();
    setTipoAbbonamento(tipoAbbonamento);
    if (!formDataInizio) {
      setValue("inizioValidita", localDataInizio);
    }
    setValue(
      "scadenza",
      add(localDataInizio, { months: tipoAbbonamento.durataMesi })
    );
  };

  // convert date format
  // @khoa
  function dateFormat(dateStr) {
    let date = new Date(dateStr);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();

    if (dt < 10) {
      dt = "0" + dt;
    }
    if (month < 10) {
      month = "0" + month;
    }

    return dt + "/" + month + "/" + year;
  }

  function renderNoData() {
    return (
      <Typography variant="h6">Nessun Abbonamento per l'utente</Typography>
    );
  }

  function renderTable() {
    return (
      <form onSubmit={handleSubmit(submitForm)} noValidate>
        <TableContainer>
          <Table className={classes.table} aria-label="Abbonamenti">
            <TableHead>
              <TableRow>
                <StyledTableCell>Tipo Abbonamento</StyledTableCell>
                <StyledTableCell align="center">Data Inizio</StyledTableCell>
                <StyledTableCell align="center">Data Fine</StyledTableCell>
                <StyledTableCell align="center">
                  Ingressi residui/totali
                </StyledTableCell>
                <StyledTableCell align="center">Saldato</StyledTableCell>
                <StyledTableCell align="center">Impostazioni</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {abbonamenti?.map((a) => (
                <TableRow key={a.id}>
                  <StyledTableCell component="th" scope="row">
                    {a.tipoAbbonamento?.nome}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {dateFormat(a.dataInizioValidita)}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {dateFormat(a?.scadenza)}
                  </StyledTableCell>
                  {/* <TableCell align="center">{a.ingressiResidui ?? a.ingressiIniziali} di {a.ingressiIniziali}</TableCell> */}
                  <StyledTableCell align="center">
                    {a.ingressiResidui ?? a.ingressiIniziali} Ingressi
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {/* <Switch checked={(a.importo ?? 0) === (a.importoPagato ?? 0)} color="default" onChange={(e)=>{handlePaymentChange(a.id, e);}} /> */}
                    {(a.importo ?? 0) === (a.importoPagato ?? 0) ? "SI" : "NO"}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {/* <Button startIcon={<EditIcon />} size="small" variant="outlined" onClick={(e)=>{handleEditAbbonamento(e, a.id)}} >
                                        Edit
                                    </Button> */}
                    <Fab
                      size="small"
                      variant="round"
                      className={classes.FAB}
                      onClick={(e) => {
                        handleEditAbbonamento(e, a.id);
                      }}
                    >
                      <MenuIcon style={{ color: "white" }} />
                    </Fab>
                  </StyledTableCell>
                </TableRow>
              ))}
              {/* for INSERISCI @khoa */}
              <TableRow>
                <StyledTableCell component="th" scope="row">
                  <FormControl
                    className={classes.formControlTipoAbbonamento}
                    required
                  >
                    <InputLabel>Tipo Abbonamento</InputLabel>
                    <Controller
                      as={
                        <Select onChange={handleTipoAbbonamentChanged}>
                          {tipologieAbbonamenti?.map((t) => (
                            <MenuItem key={t.id} value={t.id}>
                              {t.nome}
                            </MenuItem>
                          ))}
                        </Select>
                      }
                      control={control}
                      name="idTipoAbbonamento"
                      rules={{
                        required:
                          "E' necessario selezionare un tipo abbonamento",
                      }}
                    />
                  </FormControl>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Controller
                    render={(props) => (
                      <DatePicker
                        className={classes.controller}
                        inputRef={props.ref}
                        onChange={props.onChange}
                        value={props.value}
                        margin="dense"
                        required
                        label="Inizio Validità"
                        format="dd MMMM yyyy"
                      />
                    )}
                    control={control}
                    name="dataInizioValidita"
                    rules={{ required: "Inserire una data di Scadenza" }}
                  />
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Controller
                    render={(props) => (
                      <DatePicker
                        className={classes.controller}
                        inputRef={props.ref}
                        onChange={props.onChange}
                        value={props.value}
                        margin="dense"
                        required
                        label="Scadenza"
                        format="dd MMMM yyyy"
                      />
                    )}
                    control={control}
                    name="scadenza"
                    onChange={([selected]) => selected}
                    rules={{ required: "Inserire una data di Scadenza" }}
                  />
                </StyledTableCell>
                <StyledTableCell align="center">
                  <TextField
                    className={classes.controller}
                    required
                    name="ingressiIniziali"
                    label="Numero Ingressi"
                    margin="dense"
                    type="number"
                    inputRef={register({
                      required:
                        "Inserire il numero di ingressi massimo (0 se non c'è un massimo)",
                    })}
                  />
                </StyledTableCell>
                <StyledTableCell align="center">
                  <FormControlLabel
                    className={classes.switchLabel}
                    margin="dense"
                    control={
                      <Switch
                        name="saldato"
                        color="default"
                        inputRef={register}
                        //Il default value non funziona con gli switch, bisogna impostare esplicitamente il defaultChecked
                        defaultChecked={initialValues.saldato}
                      />
                    }
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Button
                    size="small"
                    type="submit"
                    className={classes.InsertButton}
                  >
                    INSERISCI
                  </Button>
                </StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </form>
    );
  }

  return (
    <Fragment>
      {/* {abbonamenti && abbonamenti.length > 0 ? renderTable() : renderNoData()} */}
      {renderTable()}
    </Fragment>
  );
};

export default AbbonamentiUtenteList;
