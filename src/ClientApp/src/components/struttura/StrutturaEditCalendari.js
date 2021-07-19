import log from 'loglevel';
import React, { useEffect, useState, Fragment } from 'react'
import { Tab, Tabs, Paper, makeStyles, CircularProgress } from '@material-ui/core'
import { StruttureEventiAPI } from '../../api/strutture.eventi.api';
import StrutturaCalendarAdmin from './StrutturaCalendarAdmin';

const _logger = log.getLogger('StrutturaEditCalendari')

const useStyles = makeStyles(theme => ({
    TabContainer: {
        marginTop: "10px"
    }
}));


const StrutturaEditCalendari = (props) => {
    const idStruttura = props.idStruttura ?? -1;
    const urlRoute = props.urlRoute;
    const classes = useStyles();
    const [locationsIsLoading, setLocationsIsLoading] = useState(true);
    const [locations, setLocations] = useState(null);
    const [selectedTab, setSelectedTab] = useState(0);

    useEffect(() => {
        async function fetchData() {
            _logger.debug("StrutturaEditCalendari->fetchData()");
            _logger.debug(`StrutturaEditCalendari->useEffect() - Fetching Locations (${idStruttura})`);
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
        _logger.debug(`StrutturaEditCalendari->renderTabs() - locations: ${JSON.stringify(locations)}`);
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
                    <StrutturaCalendarAdmin idStruttura={idStruttura} idLocation={locations[selectedTab].id} urlRoute={urlRoute} />
                }
            </Paper>
        )
    }

    function renderNoLocations() {
        _logger.debug(`StrutturaEditCalendari->renderNoLocations() - locations: ${JSON.stringify(locations)}`);
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


export default StrutturaEditCalendari