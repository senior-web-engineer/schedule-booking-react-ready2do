import log from 'loglevel';
import React from 'react'
import { Switch, Route, useRouteMatch, useParams } from 'react-router-dom'
import AzureAD from 'react-aad-msal';
import { getStore } from '../../store/reduxStore'
import { authProvider } from '../../authProvider'
import UtenteLayout from './UtenteLayout';
import UtenteProfilo from './UtenteProfilo';
import {UtentePrenotazioni} from './UtentePrenotazioni';

const _logger = log.getLogger('UtenteRouter');


export default (props) => {

    _logger.debug(`UtenteRouter props: ${JSON.stringify(props)}`);
    //let { path, url } = useRouteMatch();
    // let { nomeStruttura } = useParams();
    // _logger.debug(`UtenteRouter - path: ${path}, nomeStruttura: ${JSON.stringify(nomeStruttura)}`);

    return (
        <UtenteLayout >
            <Switch>
                <Route exact path={`/me/profilo`}>
                    <AzureAD forceLogin provider={authProvider} reduxStore={getStore()} >
                        <UtenteProfilo />
                    </AzureAD>
                </Route>
                <Route exact path={`/me/prenotazioni`}>
                    <AzureAD forceLogin provider={authProvider} reduxStore={getStore()} >
                        <UtentePrenotazioni />
                    </AzureAD>
                </Route>
            </Switch>
        </UtenteLayout>
    )
}


