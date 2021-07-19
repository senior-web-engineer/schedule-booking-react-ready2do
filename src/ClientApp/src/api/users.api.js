import axios from 'axios';
import config from '../config'
import { APIUtils } from './apiUtils'
import * as log from 'loglevel'
import formatISO from 'date-fns/formatISO'
import appInsights from '../applicationInsights'
import {SeverityLevel} from '@microsoft/applicationinsights-common'

const _logger = log.getLogger('users.api');

/**
 * 
 * @param {number} [numAbbonamentiToInclude=10] - numero massimo di abbonamenti da includere nella risposta
 * @param {Date} [startDate=now] - data iniziale da cui recuperare gli appuntamenti (NOW come default)
 * @param {Date} [endDate=null] - data finale per il recupero degli appuntamenti (SENZA LIMITE SE NON SPECIFICATO)
 * @param {boolean} [incAppDaConf=false] - include gli appuntamenti da confermare nella risposta (Defalt: false)
 * @param {boolean} [incCerts=false]
 */
async function GetCurrentUserDetailsAsync(includeAbbonamenti = 10, startDate = new Date(), endDate = null, incAppDaConf = false, incCerts = false) {
    startDate = startDate ?? new Date();
    let url = `${config.BaseAPIPath}/utenti?incAbb=${includeAbbonamenti}&appFrom=${formatISO(startDate, { representation: 'date' })}&incAppDaConf=${incAppDaConf}&incCert=${incCerts}`;
    if (endDate) {
        url += `&apTo=${formatISO(endDate, { representation: 'date' })}`;
    }
    _logger.debug(`GetCurrentUserDetailsAsync->Invoking API: [GET] ${url}`);
    var response = await axios.get(url, await APIUtils.addBearerToken());
    return response.data;
}


/**
 * Ritorna i soli dati del profilo dell'uente corrente
 */
async function GetCurrentUserProfileAsync() {
    const url = `${config.BaseAPIPath}/utenti/profilo`;
    _logger.debug(`GetCurrentUserProfileAsync->Invoking API: [GET] ${url}`);
    var response = await axios.get(url, await APIUtils.addBearerToken());
    return response.data;
}

/**
 * Ritorna i clienti followed dall'utente corrente
 */
async function GetCurrentUserClientiFollowedAsync() {
    const url = `${config.BaseAPIPath}/utenti/profilo/clienti`;
    _logger.debug(`GetCurrentUserClientiFollowedAsync->Invoking API: [GET] ${url}`);
    var response = await axios.get(url, await APIUtils.addBearerToken());
    _logger.debug(`GetCurrentUserClientiFollowedAsync->Returned data: ${JSON.stringify(response.data)}`);
    return response.data;
}

/**
 * Ritorna gli abbonamenti per l'utente correte
 */
async function GetCurrentUserAbbonamentiAsync() {
    const url = `${config.BaseAPIPath}/utenti/profilo/abbonamenti`;
    _logger.debug(`GetCurrentUserAbbonamentiAsync->Invoking API: [GET] ${url}`);

    try {
        var response = await axios.get(url, await APIUtils.addBearerToken());
        appInsights.trackTrace({message:`GetCurrentUserAbbonamentiAsync->Invoking API: [GET] ${url}`, properties:{url, data:response?.data}})
        _logger.debug(`GetCurrentUserAbbonamentiAsync->Invoked API: [GET] ${url} - RETURN: ${response.data}`);
        return response.data ?? [];
    } catch (exc) {
        appInsights.trackException({exception: exc, severityLevel: SeverityLevel.Error, properties:{url}});
        throw(exc); //risolleviamo l'eccezione al chiamante        
    }
}

/**
 * Ritorna gli appuntamenti attivi per l'utente corrente
 */
async function GetCurrentUserAppuntamentiAsync(startDateISO, endDateISO, pageSize, pageNumber){
    const url = `${config.BaseAPIPath}/utenti/appuntamenti?dtInizio=${startDateISO}&dtFine=${endDateISO}&pageSize=${pageSize}&pageNumber=${pageNumber}`;
    _logger.debug(`GetCurrentUserAppuntamentiAsync->Invoking API: [GET] ${url}`);
    try {
        var response = await axios.get(url, await APIUtils.addBearerToken());
        appInsights.trackTrace({message:`GetCurrentUserAppuntamentiAsync->Invoking API: [GET] ${url}`, properties:{url, data:response?.data}})
        return response.data ?? [];
    } catch (exc) {
        appInsights.trackException({exception: exc, severityLevel: SeverityLevel.Error, properties:{url}});
        throw(exc); //risolleviamo l'eccezione al chiamante        
    }
}

/**
 * Aggiorna il profilo dell'utente
 * @param {*} profilo 
 */
async function SaveUserProfiloAsync(profilo) {
    const url = `${config.BaseAPIPath}/utenti/profilo`;
    try {
        await axios.put(url, profilo, await APIUtils.addBearerToken());
        appInsights.trackTrace({message:`GetCurrentUserAbbonamentiAsync->Invoking API: [GET] ${url}`, properties:{url}})
        return true;
    } catch (e) {
        //_logger.error(`Errore nell'invocazione della API: ${url} - Payload: ${JSON.stringify(profilo)} - Error: ${JSON.stringify(e)}`);
        appInsights.trackException({exception: e, severityLevel: SeverityLevel.Error});
        return false;
    }
}

async function NotifyNewUser(userId){
    const url = `${config.BaseAPIPath}/utenti/new/${userId}`;
    try {
        await axios.post(url, await APIUtils.addBearerToken());
        appInsights.trackTrace({message:`NotifyNewUser->Invoking API: [POST] ${url}`, properties:{url, userId}})
        return true;
    } catch (e) {
        //_logger.error(`Errore nell'invocazione della API: ${url} - Payload: ${JSON.stringify(profilo)} - Error: ${JSON.stringify(e)}`);
        appInsights.trackException({exception: e, severityLevel: SeverityLevel.Error});
        return false;
    }
}

export const UsersAPI = {
    GetCurrentUserDetailsAsync,
    GetCurrentUserProfileAsync,
    GetCurrentUserClientiFollowedAsync,
    GetCurrentUserAbbonamentiAsync,
    GetCurrentUserAppuntamentiAsync,
    SaveUserProfiloAsync,
    NotifyNewUser
}