import log from 'loglevel';
import React, { useEffect, useState } from 'react'
import R2DEditEventoForm from '../editEvento/R2DEditEventoForm'
import * as qs from 'query-string'
import { useParams, useLocation } from 'react-router-dom';
import { Paper } from '@material-ui/core';
import { authProvider } from '../../authProvider'
import { getStore } from '../../store/reduxStore'

import {UserSelectors} from '../../store/selectors/user.selectors'
import AzureAD, { AuthenticationState } from 'react-aad-msal';
import StrutturaEventoPrenotazione from './StrutturaEventoPrenotazione'
import { useSelector } from 'react-redux';
import { StruttureEventiAPI } from '../../api/strutture.eventi.api';
import differenceInMinutes from 'date-fns/differenceInMinutes'
import parseISO from 'date-fns/parseISO'

const _logger = log.getLogger('StrutturaEvento')

export default (props) => {
    const idStruttura = props.idStruttura;
    const struttureOwned = useSelector(UserSelectors.getStruttureOwned) ?? [];
    //Recuperiamo i parametri dall'url
    let { idEvento } = useParams();
    const [evento, setEvento] = useState(null);
    idEvento = isNaN(idEvento) ? -1 : idEvento;
    //Recuperiamo la querystring
    let { search } = useLocation();
    const queryString = qs.parse(search) ?? {};
    _logger.debug(`StrutturaEvento -> idStruttura: ${idStruttura}, idEvento: ${idEvento}, querystring: ${JSON.stringify(queryString)}`);

    const isOwnerStruttura = () => {        
        const result = (struttureOwned.findIndex(s=>s.id === idStruttura) >= 0); 
        _logger.debug(`StrutturaEvento->isOwnerStruttura()->Return: ${result} - struttureOwned: ${JSON.stringify(struttureOwned)}`);
        return result
    }
    
    useEffect(() => {
        async function fetchEvento() {
            _logger.debug(`StrutturaEvento->useEffect()->fetchEvento() - Fetching Event (${idStruttura}, ${idEvento})`);
            let data = await StruttureEventiAPI.FetchEventoAsync(idStruttura, idEvento);
            _logger.debug(`StrutturaEvento->useEffect->fetchEvento(): Event Fetched: ${JSON.stringify(data)}`);
            setEvento(data);
        }
        if (idStruttura > 0 && idEvento > 0) {
            fetchEvento();
        }
    }, [idStruttura, idEvento])

    const renderEvento=()=>{
        if(!evento) return null;
        if(isOwnerStruttura()){
            if(differenceInMinutes(parseISO(new Date(), evento.dataOraInizio)) > -5 ){ // 5 minuti

            }
            else{
                return (
                    <R2DEditEventoForm
                    idStruttura={idStruttura}
                    idEvento={idEvento} //TODO: Passare direttamente l'evento                                            
                    dataEvento={queryString?.date}
                    idLocation={queryString?.lid ?? -1}
                    allDay={queryString?.allDay ?? false}
                />
                )
            }
        }
        else{
            return(
                <StrutturaEventoPrenotazione
                idStruttura={idStruttura}
                idEvento={idEvento} />
            )
        }
    }

    /**
     *  Il componente da visualizzare viene determinato in base alla seguente logica:
     *  - se l'utente è autenticato ed è un gestore:
     *      -> se siamo a meno di 10 minuti dall'inizio dell'evento viene visualizzata la form di presenza
     *      -> se siamo ancora "lontani" dall'inizio viene visualizzata la form di edit dell'evento 
     *  - se l'utente non è autenticato oppure non è un gestore della struttura, viene visualizzata la pagina di registrazione / cancellazione
     */
    return (
        <Paper>
            <AzureAD provider={authProvider} reduxStore={getStore()} >
                {
                    ({ login, logout, authenticationState, error, accountInfo }) => {
                        switch (authenticationState) {
                            case AuthenticationState.Authenticated:
                                _logger.debug(`StrutturaEvento->AuthenticationState.Authenticated`);
                                return (
                                    renderEvento()
                                );
                            default:
                                _logger.debug(`StrutturaEvento->NOT AuthenticationState.Authenticated`);
                                return (
                                    <StrutturaEventoPrenotazione
                                            idStruttura={idStruttura}
                                            idEvento={idEvento} />
                                );
                        }
                    }
                }
            </AzureAD>

        </Paper>
    )
}