import log from 'loglevel'
import axios from 'axios';
import buildUrl from 'build-url';
import formatISO from 'date-fns/formatISO'

import config from '../config'
import { APIUtils } from './apiUtils'
import { authProvider } from '../authProvider';

const _logger = log.getLogger('strutture.eventi.api');


async function FetchEventoAsync(idStruttura, idSchedule) {
    const url = `${config.BaseAPIPath}/clienti/${idStruttura}/schedules/${idSchedule}`;
    _logger.debug(`Invoking API: [GET] ${url}`);
    const response = await axios.get(url, await APIUtils.addBearerToken());
    return response.data;
}

/**
 * 
 * @param {number} idStruttura 
 * @param {number} idLocation 
 * @param {Date} startDate 
 * @param {Date} endDate 
 * @param {number} idTipoLezione - identificativo della Tipologia di Lezione per cui filtrare i risultati (Dafault: null)
 * @param {Boolean} soloPostiDisp - ritorna solo gli Schedules per cui ci sono ancora posti disponibili (Dafault: false)
 * @param {Boolean} soloIscrizAperte - ritorna solo gli Schedules per cui le iscrizioni risultano aperte al momento dell'invocazione (Dafault: false)
 * @param {number} pageNumber - pagina corrente (Default: 1)
 * @param {number} pageSize - dimensione della pagina (Dafault: 200)
 */
async function FetchEventiAsync(idStruttura, idLocation, startDate, endDate, idTipoLezione = null, soloPostiDisp = false,
    soloIscrizAperte = true, pageNumber = 1, pageSize = 200) {
    const userAuthenticated = authProvider?.authenticationState === 'Authenticated';
    const url = buildUrl(config.APIServer, {
        path: `api/clienti/${idStruttura}/schedules`,
        queryParams: {
            sd: startDate ? formatISO(startDate, { representation: 'date' }) : null,
            ed: endDate ? formatISO(endDate, { representation: 'date' }) : null,
            lid: idLocation,
            tlid: idTipoLezione,
            onlyavailable: soloPostiDisp,
            onlyopen: userAuthenticated ? soloIscrizAperte : true,
            pSize: pageSize,
            pNumber: pageNumber
        }
    });
    _logger.debug(`FetchEventiAsync -> Invokin API: [GET] ${url}`);
    const response = await axios.get(url, await APIUtils.addBearerToken());
    return response.data;
}

async function SaveEventoAsync(idStruttura, evento) {
    let url = `${config.APIServer}/api/clienti/${idStruttura}/schedules`;
    if (evento.id && evento.id > 0) {
        url = url + `/${evento.id}`;
        await axios.put(url, evento, await APIUtils.addBearerToken());
    } else {
        await axios.post(url, evento, await APIUtils.addBearerToken());
    }
}


async function FetchAppuntamentiAsync(idStruttura, idEvento) {
    const url = `${config.APIServer}/api/clienti/${idStruttura}/schedules/${idEvento}/appuntamenti`;
    const response = await axios.get(url, await APIUtils.addBearerToken());
    return response.data;
}

async function PrenotaEventoAsync(idStruttura, idEvento, appuntamento) {
    const url = `${config.APIServer}/api/clienti/${idStruttura}/schedules/${idEvento}/appuntamenti`;
    await axios.post(url, appuntamento, await APIUtils.addBearerToken());
}

async function PresenzaEventoAsync(idStruttura, idEvento, idAppuntamento, presence) {
    const url = `${config.APIServer}/api/clienti/${idStruttura}/schedules/${idEvento}/appuntamenti/${idAppuntamento}/presence?presence=${presence}`;
    await axios.post(url, await APIUtils.addBearerToken());
}

async function AnnullaPrenotazioneAsync(idStruttura, idEvento){
    const url = `${config.APIServer}/api/clienti/${idStruttura}/schedules/${idEvento}/appuntamenti`;
    await axios.delete(url, await APIUtils.addBearerToken());
}

async function AnnullaPrenotazioneByAdminAsync(idStruttura, idEvento, idAppuntamento){
    const url = `${config.APIServer}/api/clienti/${idStruttura}/schedules/${idEvento}/appuntamenti/${idAppuntamento}`;
    await axios.delete(url, await APIUtils.addBearerToken());
}

async function RifiutaAppuntamentoNonConfermatoByAdminAsync(idStruttura, idEvento, idAppuntamento){
    const url = `${config.APIServer}/api/clienti/${idStruttura}/schedules/${idEvento}/appuntamenti/rifiuta/${idAppuntamento}`;
    await axios.post(url, await APIUtils.addBearerToken());
}


/********************************** LOCATIONS *********************************/
async function SaveLocationAsync(idStruttura, location) {
    let url = `${config.BaseAPIPath}/${idStruttura}/tipologiche/locations`;
    if (location.id > 0) {
        url = `${url}/${location.id}`;
        await axios.put(url, location, await APIUtils.addBearerToken());
    } else {
        await axios.post(url, location, await APIUtils.addBearerToken());
    }
}

async function FetchLocationsAsync(idStruttura) {
    const url = `${config.BaseAPIPath}/${idStruttura}/tipologiche/locations`;
    _logger.debug(`Invoking API: [GET] ${url}`);
    const response = await axios.get(url, await APIUtils.addBearerToken());
    return response.data;
}

async function FetchLocationSingleAsync(idStruttura, idLocation) {
    const url = `${config.BaseAPIPath}/${idStruttura}/tipologiche/locations/${idLocation}`;
    _logger.debug(`Invoking API: [GET] ${url}`);
    const response = await axios.get(url, await APIUtils.addBearerToken());
    return response.data;
}


/********************************* TIPOLOGIE LEZIONI *********************************/

async function SaveTipologiaLezioneAsync(idStruttura, tipoLezione) {
    let url = `${config.BaseAPIPath}/clienti/${idStruttura}/tipologiche/tipolezioni`;
    try {
        if (tipoLezione.id > 0) {
            url = `${url}/${tipoLezione.id}`;
            await axios.put(url, tipoLezione, await APIUtils.addBearerToken());
        } else {
            await axios.post(url, tipoLezione, await APIUtils.addBearerToken());
        }
        return true;
    } catch (e) {
        _logger.error(`Errore nell'invocazione della API: ${url} - Payload: ${JSON.stringify(tipoLezione)} - Error: ${JSON.stringify(e)}`);
        return false;
    }
}

async function FetchTipologieLezioniAsync(idStruttura, page = 1, pageSize = 100) {
    const url = buildUrl(config.APIServer, {
        path: `api/clienti/${idStruttura}/tipologiche/tipolezioni`,
        queryParams: {
            page: page,
            pageSize: pageSize
        }
    })
    _logger.debug(`Invoking API: [GET] ${url}`);
    const response = await axios.get(url, await APIUtils.addBearerToken());
    return response.data;
}

async function FetchTipologiaLezioneSingleAsync(idStruttura, idTipoLezione) {
    const url = `${config.BaseAPIPath}/clienti/${idStruttura}/tipologiche/tipolezioni/${idTipoLezione}`;
    _logger.debug(`Invoking API: [GET] ${url}`);
    const response = await axios.get(url, await APIUtils.addBearerToken());
    return response.data;
}

async function TipologiaLezioneCheckNomeAsync(idStruttura, idTipoLezione, nome) {
    let url = `${config.BaseAPIPath}/clienti/${idStruttura}/tipologiche/tipolezioni/checkname/${nome}`;
    if (idTipoLezione || idTipoLezione === 0) {
        url = url + `?id=${idTipoLezione}`;
    }
    _logger.debug(`Invoking API: [GET] ${url}`);
    const response = await axios.get(url, await APIUtils.addBearerToken());
    return response.data;
}


/********************************* TIPOLOGIE ABBONAMENTI *********************************/
async function SaveTipologiaAbbonamentoAsync(idStruttura, tipoAbbonamento) {
    let url = `${config.BaseAPIPath}/clienti/${idStruttura}/tipologiche/tipoabbonamenti`;
    try {
        if (tipoAbbonamento.id > 0) {
            url = `${url}/${tipoAbbonamento.id}`;
            await axios.put(url, tipoAbbonamento, await APIUtils.addBearerToken());
        } else {
            await axios.post(url, tipoAbbonamento, await APIUtils.addBearerToken());
        }
        return true;
    } catch (e) {
        _logger.error(`Errore nell'invocazione della API: ${url} - Payload: ${JSON.stringify(tipoAbbonamento)} - Error: ${JSON.stringify(e)}`);
        return false;
    }
}

async function FetchTipologieAbbonamentiAsync(idStruttura, page = 1, pageSize = 100) {
    const url = buildUrl(config.APIServer, {
        path: `api/clienti/${idStruttura}/tipologiche/tipoabbonamenti`,
        queryParams: {
            page: page,
            pageSize: pageSize

        }
    })
    _logger.debug(`Invoking API: [GET] ${url}`);
    const response = await axios.get(url, await APIUtils.addBearerToken());
    return response.data;
}

async function FetchTipologiaAbbonamentoSingleAsync(idStruttura, idTipoAbbonamento) {
    const url = `${config.BaseAPIPath}/clienti/${idStruttura}/tipologiche/tipoabbonamenti/${idTipoAbbonamento}`;
    _logger.debug(`Invoking API: [GET] ${url}`);
    const response = await axios.get(url, await APIUtils.addBearerToken());
    return response.data;
}

async function TipologiaAbbonamentoCheckNomeAsync(idStruttura, idTipoAbbonamento, nome) {
    let url = `${config.BaseAPIPath}/clienti/${idStruttura}/tipologiche/tipoabbonamenti/checknome?nome=${nome}`;
    if (idTipoAbbonamento || idTipoAbbonamento === 0) {
        url = url + `&id=${idTipoAbbonamento}`;
    }

    _logger.debug(`Invoking API: [GET] ${url}`);
    const response = await axios.get(url, await APIUtils.addBearerToken());
    return response.data;
}


export const StruttureEventiAPI = {
    FetchEventoAsync,
    FetchLocationsAsync,
    FetchEventiAsync,
    FetchTipologieLezioniAsync,
    SaveEventoAsync,
    FetchAppuntamentiAsync,
    PrenotaEventoAsync,
    PresenzaEventoAsync,
    AnnullaPrenotazioneAsync,
    FetchLocationSingleAsync,
    SaveLocationAsync,
    FetchTipologiaLezioneSingleAsync,
    SaveTipologiaLezioneAsync,
    TipologiaLezioneCheckNomeAsync,
    FetchTipologieAbbonamentiAsync,
    FetchTipologiaAbbonamentoSingleAsync,
    SaveTipologiaAbbonamentoAsync,
    TipologiaAbbonamentoCheckNomeAsync,
    RifiutaAppuntamentoNonConfermatoByAdminAsync,
    AnnullaPrenotazioneByAdminAsync   
}