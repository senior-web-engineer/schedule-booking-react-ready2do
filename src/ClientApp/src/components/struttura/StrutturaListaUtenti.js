import log from 'loglevel';
import React, { useState, Fragment, useEffect } from 'react';
import MUIDataTable from "mui-datatables";
import { makeStyles, Paper, Typography, CircularProgress, Button } from '@material-ui/core';
import PictureInPictureIcon from '@material-ui/icons/PictureInPicture';
import AddBoxIcon from '@material-ui/icons/AddBox';
import PageviewIcon from '@material-ui/icons/Pageview';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import {StruttureUtentiAPI} from '../../api/strutture.utenti.api';
import dfnsFormat from 'date-fns/format';
import dfnsParseISO from 'date-fns/parseISO'
import { Link } from 'react-router-dom';


const _logger = log.getLogger('StrutturaListaUtenti');

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: "10px"
    },
    iconaStatoOk: {
        color: '#89C443'
    },
    iconaStatoWarn: {
        color: '#D50000'
    }
}));


const StrutturaListaUtenti = (props) => {
    const classes = useStyles();
    const idStruttura = props.idStruttura;
    const urlRoute = props.urlRoute;
    const [serverData, setServerData] = useState([]); //Dati recuperati dal server
    const [gridData, setGridData] = useState([]); //Dati renderizzati dalla griglia
    const [totalRows, setTotalRows] = useState(0);
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(20)
    const [fetchInProgress, setFetchInProgress] = useState(false);
    const [columnsSortDirection, setColumnsSortDirection] = useState(['none', 'none', 'none']);

    const gridColumns = [
        {
            name: "Cognome",
            options: {
                filter: true,
                sortDirection: columnsSortDirection[0]
            }
        },
        {
            name: "Nome",
            options: {
                filter: true,
                sortDirection: columnsSortDirection[1]
            }
        },
        {
            name: "DataCreazione",
            label: "Associato dal",
            options: {
                filter: true,
                sortDirection: columnsSortDirection[2]
            }
        },
        {
            name: "Stato",
            sort: false,
            options: {
                filter: false,
                filterType: 'dropdown',
                customBodyRender: (value, tableMeta, updateValue) => {
                    //Recuperiamo lo stato a partire dall'ID usato come valore per la colonna
                    let tmpUser = serverData?.dati?.find((u, index) => u.userId === value);
                    _logger.debug(`StrutturaListaUtenti->customBodyRender(${value}, ${JSON.stringify(tableMeta)}, ${updateValue}) - tmpUser: ${JSON.stringify(tmpUser)}`);
                    return (
                        tmpUser ?
                        <Fragment>
                            <PictureInPictureIcon className={tmpUser.stato.abbonamentoAttivo ? classes.iconaStatoOk : classes.iconaStatoWarn} />
                            <MonetizationOnIcon className={tmpUser.stato.statoPagamentoAbbonamentoAttivo === 3 ? classes.iconaStatoOk : classes.iconaStatoWarn} />
                            <AddBoxIcon className={tmpUser.stato.certificatoValido ? classes.iconaStatoOk : classes.iconaStatoWarn} />
                        </Fragment>
                        : ''
                    )
                }
            }
        },
        {
            name:"Actions",
            label:' ',

            options:{
                filter:false,
                sort:false,
                empty:true,
                viewColumns:false,
                customBodyRender: (value, tableMeta, updateValue)=>{
                    let userId = tableMeta.rowData[3];
                    return (
                        <Button size="small" variant="outlined" 
                                style={{float:"right"}}
                                startIcon={<PageviewIcon />} 
                                component={Link} 
                                to={`/${urlRoute}/utenti/${userId}`}>Dettagli</Button>
                    )
                }
            }
        }
    ]

    const sortGrid = (column, order) => {
        const newColumnsSortDirection = ['none', 'none', 'none'];
        switch (column) {
            case 'Cognome':
                newColumnsSortDirection[0] = order;
                break;
            case 'Nome':
                newColumnsSortDirection[1] = order;
                break;
            case 'Associato dal':
                newColumnsSortDirection[2] = order;
                break;
            default:
                _logger.warn(`StrutturaListaUtenti->sortGrid(${column}, ${order}) - UNMANAGED COLUMN!`);
                break;
        }
        setColumnsSortDirection(newColumnsSortDirection);
    }
    const gridOptions = {
        responsive: 'vertical',
        serverSide: true,
        count: totalRows,
        page: currentPage,
        selectableRows:'none',
        rowsPerPage: rowsPerPage,        
        onChangeRowsPerPage: (numberOfRows) => {
            _logger.debug(`StrutturaListaUtenti->onChangeRowsPerPage(${numberOfRows})`)
            setRowsPerPage(numberOfRows);
        },
        rowsPerPageOptions: [20, 50, 100],
        onChangePage: (currentPage)=>{
            setCurrentPage(currentPage);
        },
        onColumnSortChange: (changedColumns, order) => {
            _logger.debug(`StrutturaListaUtenti->onColumnSortChange(${changedColumns}, ${order})`)
            sortGrid(changedColumns, order);
        },

    }



    useEffect(() => {
        const getSortedColumn = () => {
            const idColonna = columnsSortDirection.findIndex((value) => value !== 'none');
            let result = { sortBy: '', sortDirection: 'none' }
            if (idColonna >= 0) {
                result.sortDirection = columnsSortDirection[idColonna];
                result.sortBy = gridColumns[idColonna].name; //I due array devono avere le stesse dimensioni by design
            }
            return result;
        }

        async function fetchData() {
            _logger.debug(`StrutturaListaUtenti->fetchData()`)
            setFetchInProgress(true);
            const { sortBy,  sortDirection} = getSortedColumn();
            const data = await StruttureUtentiAPI.FetchUtentiStrutturaAsync(idStruttura, true, currentPage, rowsPerPage, sortBy, sortDirection)
            _logger.debug(`StrutturaListaUtenti->fetchedData: ${JSON.stringify(data)}`);
            setFetchInProgress(false);
            setServerData(data);
            setTotalRows(data?.totalRecords)
            if(data && data.dati && Array.isArray(data.dati)){
                const localGridData = data.dati.map((value)=>{return [value.nome, value.cognome, dfnsFormat(dfnsParseISO(value.dataAssociazione),"dd MMMM yyyy 'alle' HH:mm"), value.userId]});
                _logger.debug(`StrutturaListaUtenti->fetchedData-GridData: ${JSON.stringify(localGridData)}`);
                setGridData(localGridData);
            }
        }
        if (idStruttura && idStruttura > 0) {
            fetchData();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idStruttura, currentPage, rowsPerPage, columnsSortDirection])

    return (
        <Paper className={classes.root}>
            <MUIDataTable title={<Typography variant="h6">
                Gestione utenti
          {fetchInProgress && <CircularProgress size={24} style={{ marginLeft: 15, position: 'relative', top: 4 }} />}
            </Typography>
            }
                data={gridData} columns={gridColumns} options={gridOptions} />
        </Paper>
    )
}

export default StrutturaListaUtenti;