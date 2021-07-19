import log from 'loglevel';
import React from 'react'
import { Switch, Route, useRouteMatch, useParams } from 'react-router-dom'
import AzureAD from 'react-aad-msal';
import { useSelector } from 'react-redux'
import { getStore } from '../../store/reduxStore'
import { StruttureSelectors } from '../../store/selectors/strutture.selectors'
import { authProvider } from '../../authProvider'
import StrutturaEvento from './StrutturaEvento';
import StrutturaProvider from '../struttura/StrutturaProvider'
import StrutturaLayout from './StrutturaLayout';
import StrutturaEditDati from './StrutturaEditDati';
import StrutturaEditImages from './StrutturaEditImages';
import StrutturaEditCalendari from './StrutturaEditCalendari';
import StrutturaHome from './StrutturaHome';
import StrutturaListaUtenti from './StrutturaListaUtenti';
import StrutturaDettaglioUtente from './dettaglio-utente/StrutturaDettaglioUtente';
import StrutturaEventoPrenotazione from './StrutturaEventoPrenotazione';
import StrutturaListaLocations from './StrutturaListaLocations';
import StrutturaEditLocation from './StrutturaEditLocation';
import StrutturaListaTipologiaLezioni from './StrutturaListaTipologiaLezioni'
import StrutturaEditTipologiaLezione from './StrutturaEditTipologiaLezione'
import StrutturaListaTipologiaAbbonamenti from './StrutturaListaTipologiaAbbonamenti'
import StrutturaEditTipologiaAbbonamento from './StrutturaEditTipologiaAbbonamento'


const _logger = log.getLogger('StrutturaRouter');


const StrutturaRouter = (props) => {

    _logger.debug(`StrutturaRouter props: ${JSON.stringify(props)}`);
    let { path, url } = useRouteMatch();
    let { nomeStruttura } = useParams();
    _logger.debug(`StrutturaRouter - path: ${path}, nomeStruttura: ${JSON.stringify(nomeStruttura)}`);

    //const nomeStruttura = routeParams.nomeStruttura;
    const anagraficaStruttura = useSelector(StruttureSelectors.getAnagrafica);
    const orarioAperturaStruttura = useSelector(StruttureSelectors.getOrarioApertura);
    const idStruttura = useSelector(StruttureSelectors.getIdStrutturaCorrente);

    return (
        <StrutturaLayout urlStruttura={nomeStruttura}>
            <StrutturaProvider nomeStruttura={nomeStruttura}>
                <Switch>
                    <Route exact path={`${path}/eventi/:idEvento/prenotezione`}>
                        <AzureAD forceLogin provider={authProvider} reduxStore={getStore()} >
                            <StrutturaEventoPrenotazione idStruttura={idStruttura} />
                        </AzureAD>
                    </Route>
                    <Route exact path={`${path}/eventi/:idEvento`}>
                        <StrutturaEvento idStruttura={idStruttura} />
                    </Route>
                    <Route exact path={[`${path}/edit`, `${path}/dati`]}>
                        <AzureAD forceLogin provider={authProvider} reduxStore={getStore()} >
                            <StrutturaEditDati anagraficaStruttura={anagraficaStruttura} orarioAperturaStruttura={orarioAperturaStruttura}/>
                        </AzureAD>
                    </Route>
                    <Route exact path={[`${path}/images`, `${path}/immagini`, `${path}/gallery`]}>
                        <AzureAD forceLogin provider={authProvider} reduxStore={getStore()} >
                            <StrutturaEditImages idStruttura={idStruttura} />
                        </AzureAD>
                    </Route>
                    <Route exact path={[`${path}/calendari`, `${path}/schedules`]}>
                        <AzureAD forceLogin provider={authProvider} reduxStore={getStore()} >
                            <StrutturaEditCalendari idStruttura={idStruttura} urlRoute={nomeStruttura} />
                        </AzureAD>
                    </Route>
                    <Route exact path={[`${path}/utenti/:idUtente`, `${path}/users/:idUtente`]}>
                        <AzureAD forceLogin provider={authProvider} reduxStore={getStore()} >
                            <StrutturaDettaglioUtente idStruttura={idStruttura} urlRoute={nomeStruttura} />
                        </AzureAD>
                    </Route>
                    <Route exact path={[`${path}/utenti`, `${path}/users`]}>
                        <AzureAD forceLogin provider={authProvider} reduxStore={getStore()} >
                            <StrutturaListaUtenti idStruttura={idStruttura} urlRoute={nomeStruttura} />
                        </AzureAD>
                    </Route>
                    <Route exact path={[`${path}/locations/:idLocation`]}>
                        <AzureAD forceLogin provider={authProvider} reduxStore={getStore()} >
                            <StrutturaEditLocation idStruttura={idStruttura} urlRoute={nomeStruttura} />
                        </AzureAD>
                    </Route>
                    <Route exact path={[`${path}/locations`]}>
                        <AzureAD forceLogin provider={authProvider} reduxStore={getStore()} >
                            <StrutturaListaLocations idStruttura={idStruttura} urlRoute={nomeStruttura} />
                        </AzureAD>
                    </Route>
                    <Route exact path={[`${path}/lezioni/:idTipoLezione`]}>
                        <AzureAD forceLogin provider={authProvider} reduxStore={getStore()} >
                            <StrutturaEditTipologiaLezione idStruttura={idStruttura} urlRoute={nomeStruttura} />
                        </AzureAD>
                    </Route>
                    <Route exact path={[`${path}/lezioni`]}>
                        <AzureAD forceLogin provider={authProvider} reduxStore={getStore()} >
                            <StrutturaListaTipologiaLezioni idStruttura={idStruttura} urlRoute={nomeStruttura} />
                        </AzureAD>
                    </Route>
                    <Route exact path={[`${path}/abbonamenti/:idTipoAbonamento`]}>
                        <AzureAD forceLogin provider={authProvider} reduxStore={getStore()} >
                            <StrutturaEditTipologiaAbbonamento idStruttura={idStruttura} urlRoute={nomeStruttura} />
                        </AzureAD>
                    </Route>
                    <Route exact path={[`${path}/abbonamenti`]}>
                        <AzureAD forceLogin provider={authProvider} reduxStore={getStore()} >
                            <StrutturaListaTipologiaAbbonamenti idStruttura={idStruttura} urlRoute={nomeStruttura} />
                        </AzureAD>
                    </Route>
                    <Route>
                        <StrutturaHome anagraficaStruttura={anagraficaStruttura}></StrutturaHome>
                    </Route>
                </Switch>
            </StrutturaProvider>
        </StrutturaLayout>
    )
}


export default StrutturaRouter;