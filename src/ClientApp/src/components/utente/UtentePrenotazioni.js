import log from 'loglevel'
import React, { Fragment } from 'react'
import { makeStyles, Paper, Typography, Button, Grid } from '@material-ui/core'
import addYears from 'date-fns/addYears'
import formatISO from 'date-fns/formatISO'
import parseISO from 'date-fns/parseISO'
import format from 'date-fns/format'
import { it as itLocal } from 'date-fns/locale'
import MUIDataTable from "mui-datatables";
import R2DLoader from '../commons/R2DLoader';
import { UsersAPI } from '../../api/users.api'
import PageviewIcon from '@material-ui/icons/Pageview';
import { Link } from 'react-router-dom'
import { DatePicker } from "@material-ui/pickers";
import startOfDay from 'date-fns/startOfDay'
import { UtentePrenotazioniFilter } from './UtentePrenotazioneFilter'

const _logger = log.getLogger('UtentePrenotazioni')

const useStyles = makeStyles(theme => ({
    root:{
        minHeight: '600px',
    },
    dataTable:{
        minHeight: '600px',
    },
    datePickerFilter: {
        paddingRight: "5px",
        paddingLeft: "5px",
        fontSize: "0.7rem"
    },
    dtPickerInput: {
        fontSize: "0.5rem"
    }
}));

export const UtentePrenotazioni = (props) => {
    const classes = useStyles();
    //Destinato a contenere la lista dei valori per cui filtrare per ciascuna colonna 
    const [filters, setFilters] = React.useState({
        from: startOfDay(new Date()),
        to: null,
        text: null
    })
    const [serverSideFilterList, setServerSideFilterList] = React.useState([]);

    const [isLoading, setIsLoading] = React.useState(true);
    const [appuntamenti, setAppuntamenti] = React.useState(null);
    const [gridData, setGridData] = React.useState([]); //Dati renderizzati dalla griglia
    const [columnsSortDirection, setColumnsSortDirection] = React.useState(['none', 'none', 'none', 'none']);
    const [totalRows, setTotalRows] = React.useState(0);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(20);
    const [fetchInProgress, setFetchInProgress] = React.useState(false);

    React.useEffect(() => {
        async function fetchAppuntamenti() {
            const startDateISO = formatISO(filters.from);
            const endDateISO = filters.to ? formatISO(filters.to) : '9999-12-31';

            const data = await UsersAPI.GetCurrentUserAppuntamentiAsync(startDateISO, endDateISO, rowsPerPage, currentPage);
            if (data && Array.isArray(data)) {
                const tmp = data.map(v => [format(parseISO(v.schedule.dataOraInizio), 'P p', { locale: itLocal }),
                v.nomeCliente,
                v.schedule.title,
                v.schedule.tipologiaLezione.nome,
                v.urlRouteCliente
                ]);
                setGridData(tmp);
                console.log(tmp);
            }
            setAppuntamenti(data);
            setFetchInProgress(false)
        }
        setFetchInProgress(true);
        fetchAppuntamenti();
    }, [columnsSortDirection, currentPage, rowsPerPage, filters])

    const gridColumns = [
        {
            name: "DataEvento",
            label: "Data Evento",
            options: {
                filter: false,
                sortDirection: columnsSortDirection[0],
            },
        },
        {
            name: "Struttura",
            label: "Struttura",
            options: {
                filter: false,
                sort: true,
                sortDirection: columnsSortDirection[1]
            },
        },
        {
            name: "Evento",
            label: "Evento",
            options: {
                filter: false,
                sort: true,
                sortDirection: columnsSortDirection[2],
            }
        },
        {
            name: "TipoLezione",
            label: "Tipo Lezione",
            options: {
                filter: false,
                sort: true,
                sortDirection: columnsSortDirection[3],
            }
        },
        {
            name: "Azioni",
            label: " ",
            options: {
                viewColumns: false,
                filter: false,
                sort: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    // console.log('tableMeta');
                    // console.log(tableMeta);
                    let urlRoute = tableMeta.rowData[4];
                    return (
                        <Button size="small" variant="outlined"
                            style={{ float: "right" }}
                            startIcon={<PageviewIcon />}
                            component={Link}
                            to={`/${urlRoute}/`}>Vai a Struttura</Button>
                    )
                }
            }
        }
    ]

    const sortGrid = (column, order) => {
        const newColumnsSortDirection = ['none', 'none', 'none', 'none'];
        switch (column) {
            case 'DataEvento':
                newColumnsSortDirection[0] = order;
                break;
            case 'Struttura':
                newColumnsSortDirection[1] = order;
                break;
            case 'Evento':
                newColumnsSortDirection[2] = order;
                break;
            case 'TipoLezione':
                newColumnsSortDirection[3] = order;
                break;
            default:
                _logger.warn(`StrutturaListaUtenti->sortGrid(${column}, ${order}) - UNMANAGED COLUMN!`);
                break;
        }
        setColumnsSortDirection(newColumnsSortDirection);
    }

    const gridOptions = {
        responsive: 'stacked',
        serverSide: true,
        count: totalRows,
        page: currentPage,
        selectableRows: 'none',
        rowsPerPage: rowsPerPage,
        filter: false,
        search:false,
        print: false,
        viewColumns:false,
        elevation: 0,
        //serverSideFilterList: serverSideFilterList,
        onChangeRowsPerPage: (numberOfRows) => {
            _logger.debug(`StrutturaListaUtenti->onChangeRowsPerPage(${numberOfRows})`)
            setRowsPerPage(numberOfRows);
        },
        rowsPerPageOptions: [20, 50, 100],
        onChangePage: (currentPage) => {
            setCurrentPage(currentPage);
        },
        onColumnSortChange: (changedColumns, order) => {
            _logger.debug(`StrutturaListaUtenti->onColumnSortChange(${changedColumns}, ${order})`)
            sortGrid(changedColumns, order);
        },
        onFilterChange: (column, filterList, type) => {
            _logger.debug(`StrutturaListaUtenti->onFilterChange(column: ${column}, filterList:${JSON.stringify(filterList)}, type: ${type})`)
            _logger.debug(`filter:${filterList}`)
            setFilters(filterList);
        }
    }

    const handleFilterChanged = (newFilter) => {
        console.log("Filter changed, need to refresh data");
        setFilters(newFilter);
        return;
    }

    function renderLoading() {
        return (
            <R2DLoader />
        )
    }

    function renderData() {
        return (
            <Fragment>
                <Typography variant="h6">Le mie Prenotazioni</Typography>
                
                <MUIDataTable className={classes.dataTable} 
                title={<UtentePrenotazioniFilter onFilterChange={handleFilterChanged} filters={filters} />}
                    data={gridData} columns={gridColumns} options={gridOptions} />
            </Fragment>
        )
    }

    return (
        <Paper className={classes.root}>
            {fetchInProgress ? renderLoading() : renderData()}
        </Paper>
    )

}