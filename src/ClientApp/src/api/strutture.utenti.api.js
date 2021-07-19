import log from 'loglevel'
import axios from 'axios';
import buildUrl from 'build-url';
import formatISO from 'date-fns/formatISO'
import sub from 'date-fns/sub'
import add from 'date-fns/add'
import config from '../config'
import { APIUtils } from './apiUtils'
import qs from 'query-string'


const _logger = log.getLogger('strutture.utenti.api');


async function FetchUtentiStrutturaAsync(idStruttura, includeStato, page, pageSize, sortBy, sortDirection, filters) {
    let querystring = qs.stringify({
        stato:includeStato,
        page: page,
        pageSize: pageSize,
        sortby:sortBy,
        asc: sortDirection === 'asc',
        filters: filters
    },{
        skipNull: true
    })
    const url = `${config.BaseAPIPath}/clienti/${idStruttura}/users?${querystring}`;
    _logger.debug(`Invokin API: [GET] ${url}`);
    const response = await axios.get(url, await APIUtils.addBearerToken());
    return response.data;
}

async function AddUpdateAbbonamentoUtenteAsync(idStruttura, idUtente, abbonamentoUtente){
    const url = `${config.BaseAPIPath}/clienti/${idStruttura}/abbonamenti/${idUtente}`;
    if(!abbonamentoUtente.id){
        const response = await axios.post(url, abbonamentoUtente, await APIUtils.addBearerToken());
        return response.data;
    }else{
        const response = await axios.put(url, abbonamentoUtente, await APIUtils.addBearerToken());
        return response.data;

    }
}

async function FetchAbbonamentiUtenteAsync(idStruttura, idUtente){
    const url = `${config.BaseAPIPath}/clienti/${idStruttura}/abbonamenti/${idUtente}`;
    const response = await axios.get(url, await APIUtils.addBearerToken());
    return response.data;
}


async function FetchProfiloUtenteAsync(idStruttura, idUtente){
    const url = `${config.BaseAPIPath}/clienti/${idStruttura}/users/${idUtente}/profile`;
    const response = await axios.get(url, await APIUtils.addBearerToken());
    return response.data;
}

async function FetchDettagliAssociazioneUtenteAsync(idStruttura, idUtente, numAbbonamenti = 3, appFrom = null, appTo = null, incCert=true, incWL= true){
    if(!appFrom){appFrom = sub(new Date(), {days:7});}
    if(!appTo){appTo = add(new Date(), {months:120});}

    const url = `${config.BaseAPIPath}/clienti/${idStruttura}/users/${idUtente}?incAbb=${numAbbonamenti}&apFrom=${formatISO(appFrom, {representation: 'date'})}&apTo=${formatISO(appTo, {representation: 'date'})}&incCert=${incCert}&incWL=${incWL}`;
    const response = await axios.get(url, await APIUtils.addBearerToken());
    return response.data;
}

async function AddUpdateCertificatoUtenteAsync(idStruttura, idUtente, certificatoUtente){
    const url = `${config.BaseAPIPath}/clienti/${idStruttura}/users/${idUtente}/certificati`;
    if(!certificatoUtente.id){
        const response = await axios.post(url, certificatoUtente, await APIUtils.addBearerToken());
        return response.data;
    }else{
        const response = await axios.put(url, certificatoUtente, await APIUtils.addBearerToken());
        return response.data;

    }
}

 
export const StruttureUtentiAPI = {
    FetchUtentiStrutturaAsync,
    FetchAbbonamentiUtenteAsync,
    FetchProfiloUtenteAsync,
    FetchDettagliAssociazioneUtenteAsync,
    AddUpdateAbbonamentoUtenteAsync,
    AddUpdateCertificatoUtenteAsync
}