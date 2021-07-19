import axios from 'axios';
import config from '../config'
import { APIUtils } from './apiUtils'
import * as log from 'loglevel'
import { STRUTTURE_API_MOCKED } from './strutture.api.mock'
import appInsights from '../applicationInsights'
import { SeverityLevel } from '@microsoft/applicationinsights-common'


const _logger = log.getLogger('strutture.api');

//Dato l'id di una struttura ne ritorna l'urlRoute
async function GetUrlStrutturaFromId(id) {
  const url = `${config.BaseAPIPath}/clienti/resolve/${id}`
  _logger.debug(`GetNomeStrutturaFromId->Invoking API: [GET] ${url}`);
  const response = await axios.get(url);
  return response.data;
}

async function GetStrutturaByName(name, token) {
  const url = `${config.BaseAPIPath}/clienti/${name}`
  _logger.debug(`GetStrutturaByName->Invoking API: [GET] ${url}`);
  return await axios.get(url);
}

async function GetStrutturaById(id, token) {
  const url = `${config.BaseAPIPath}/clienti/${id}`
  _logger.debug(`GetStrutturaById->Invoking API: [GET] ${url}`);
  return await axios.get(url);
}

async function UpdateStrutturaAnagrafica(anagrafica, token) {
  const url = `${config.BaseAPIPath}/clienti/${anagrafica.id}/profilo/anagrafica`
  _logger.debug(`Invoking API: [PUT] ${url} - Payload: ${JSON.stringify(anagrafica)}`);
  return await axios.put(url, anagrafica, await APIUtils.addBearerToken());
}

async function UpdateStrutturaOrarioApertura(idStruttura, orarioApertura, token) {
  const url = `${config.BaseAPIPath}/clienti/${idStruttura}/profilo/orario`
  _logger.debug(`Invoking API: [PUT] ${url} - Payload: ${JSON.stringify(orarioApertura)}`);
  return await axios.put(url, orarioApertura, await APIUtils.addBearerToken());
}

/**
 * Associa l'utente corrente con la struttura specificata e ritorna i dettagli dell'associazione
 * @param {number} idStruttura 
 * @returns {object} dettaglioAssociazione
 */
async function FollowStruttura(idStruttura) {
  const url = `${config.BaseAPIPath}/clienti/${idStruttura}/follow`
  _logger.debug(`Invoking API: [POST] ${url}`);
  const response = await axios.post(url, null, await APIUtils.addBearerToken());
  return response.data;
}

async function UnFollowStruttura(idStruttura) {
  const url = `${config.BaseAPIPath}/clienti/${idStruttura}/unfollow`
  _logger.debug(`Invoking API: [POST] ${url}`);
  await axios.post(url, null, await APIUtils.addBearerToken()); 
}

async function CheckUrlStruttura(urlRoute) {
  const url = `${config.BaseAPIPath}/clienti/checkurl?url=${urlRoute}`
  _logger.debug(`Invoking API: [POST] ${url}`);
  const response = await axios.get(url, await APIUtils.addBearerToken()); 
  return response.data;  
}

//Registra un nuovo cliente
async function RegistraNuovoClienteAsync(cliente) {
  const url = `${config.BaseAPIPath}/clienti`
  _logger.debug(`RegistraNuovoClienteAsync->Invoking API: [POST] ${JSON.stringify(cliente)}`);
  const response = await axios.post(url, cliente, await APIUtils.addBearerToken());
  return response.data;
}

export const StruttureAPI = {
  GetStrutturaByName: config.MockedAPI ? STRUTTURE_API_MOCKED.GetStrutturaByName_Mocked : GetStrutturaByName,
  GetStrutturaById: GetStrutturaById,
  UpdateStrutturaAnagrafica: config.MockedAPI ? STRUTTURE_API_MOCKED.UpdateStrutturaAnagrafica_Mocked : UpdateStrutturaAnagrafica,
  UpdateStrutturaOrarioApertura: config.MockedAPI ? STRUTTURE_API_MOCKED.UpdateStrutturaOrarioApertura_Mocked : UpdateStrutturaOrarioApertura,
  FollowStruttura,
  UnFollowStruttura,
  GetUrlStrutturaFromId,
  CheckUrlStruttura,
  RegistraNuovoClienteAsync
}
