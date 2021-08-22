/* eslint-disable import/no-anonymous-default-export */
/**
 * Componente che renderizza i Tabs con le varie location e per ciascuna location presenta il rispettivo calnedario
 */
import log from 'loglevel';
import React, { useEffect, useState, Fragment } from 'react'
import { Tab, Tabs, Paper, makeStyles, CircularProgress } from '@material-ui/core'
import { StruttureEventiAPI } from '../../api/strutture.eventi.api';
import StrutturaCalendarAdmin from './StrutturaCalendarAdmin';
import StrutturaCalendarView from './StrutturaCalendarView';

const _logger = log.getLogger('R2DCalendariContainer')

const useStyles = makeStyles(theme => ({
    TabContainer: {
        marginTop: "10px"
    }
}));


export default  (props) => {
    const idStruttura = props.idStruttura ?? -1;
    const urlRoute = props.urlRoute;
    const renderMode = props.renderMode ?? 'view'
    const classes = useStyles();
    const [locationsIsLoading, setLocationsIsLoading] = useState(true);
    const [locations, setLocations] = useState(null);
    const [selectedTab, setSelectedTab] = useState(0);

    useEffect(() => {
        async function fetchData() {
            _logger.debug(`R2DCalendariContainer->useEffect() - Fetching Locations (${idStruttura})`);
            const data = await StruttureEventiAPI.FetchLocationsAsync(idStruttura);
            setLocations(data);
            setLocationsIsLoading(false);
        };
        if (idStruttura && idStruttura > 0) {
            fetchData();
        }
    }, [idStruttura, selectedTab])

    const handleChange = (event, newTab) => {
        setSelectedTab(newTab);
    };

    function renderTabs() {
        _logger.debug(`R2DCalendariContainer->renderTabs() - locations: ${JSON.stringify(locations)}`);
        return (
            <Paper className={classes.TabContainer}>
                <Tabs variant="fullWidth" value={selectedTab} onChange={handleChange}   >
                    {
                        locations.map((location, index) => {
                            return (
                                <Tab key={location.id} value={index} label={location.nome} />
                            )
                        })
                    }
                </Tabs>
                {
                    renderMode === 'view' ? 
                    <StrutturaCalendarView idStruttura={idStruttura} idLocation={locations[selectedTab].id} urlRoute={urlRoute} />
                    :                    
                    <StrutturaCalendarAdmin idStruttura={idStruttura} idLocation={locations[selectedTab].id} urlRoute={urlRoute} />
                }
            </Paper>
        )
    }

    function renderNoLocations() {
        _logger.debug(`R2DCalendariContainer->renderNoLocations() - locations: ${JSON.stringify(locations)}`);
        return (
            <div>No locations!</div>
        )
    }

    function renderLocationsLoading() {
        return (
            <CircularProgress />
        )
    }
    return (
        <Fragment>
            {
                locationsIsLoading ? renderLocationsLoading() : (locations && locations.length > 0 ? renderTabs() : renderNoLocations())
            }
        </Fragment>
    )
}
