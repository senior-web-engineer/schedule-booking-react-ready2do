import config from '../config'
import * as log from 'loglevel'

const _logger = log.getLogger('strutture.api.mock');

const STRUTTURE_MOCK = {
    STRUTTURA_GET : {
        "dataCreazione": "2019-08-20T10:02:56.262Z",
        "dataProvisioning": "2019-08-20T10:02:56.262Z",
        "tipoCliente": {
          "id": 0,
          "nome": "string",
          "descrizione": "string",
          "dataCancellazione": "2019-08-20T10:02:56.262Z"
        },
        "storageContainer": "string",
        "orarioApertura": {
          "lunedi": {
            "mattina": {
              "inizio": "string",
              "fine": "string"
            },
            "pomeriggio": {
              "inizio": "string",
              "fine": "string"
            },
            "tipoOrario": 1
          },
          "martedi": {
            "mattina": {
              "inizio": "string",
              "fine": "string"
            },
            "pomeriggio": {
              "inizio": "string",
              "fine": "string"
            },
            "tipoOrario": 1
          },
          "mercoledi": {
            "mattina": {
              "inizio": "string",
              "fine": "string"
            },
            "pomeriggio": {
              "inizio": "string",
              "fine": "string"
            },
            "tipoOrario": 1
          },
          "giovedi": {
            "mattina": {
              "inizio": "string",
              "fine": "string"
            },
            "pomeriggio": {
              "inizio": "string",
              "fine": "string"
            },
            "tipoOrario": 1
          },
          "venerdi": {
            "mattina": {
              "inizio": "string",
              "fine": "string"
            },
            "pomeriggio": {
              "inizio": "string",
              "fine": "string"
            },
            "tipoOrario": 1
          },
          "sabato": {
            "mattina": {
              "inizio": "string",
              "fine": "string"
            },
            "pomeriggio": {
              "inizio": "string",
              "fine": "string"
            },
            "tipoOrario": 1
          },
          "domenica": {
            "mattina": {
              "inizio": "string",
              "fine": "string"
            },
            "pomeriggio": {
              "inizio": "string",
              "fine": "string"
            },
            "tipoOrario": 1
          }
        },
        "id": 1110,
        "nome": "DUMMY NOME STRUTTURA",
        "ragSociale": "DUMMY RAGIONE SOCILAE",
        "email": "DUMMY EMAIL",
        "numTelefono": "DUMMY NUM TELEFONO",
        "descrizione": "DUMMY DESCRIZIONE",
        "tipologia": "DUMMY TIPOLOGIA",
        "citta": "DUMMY CITTA",
        "cap": "01234",
        "country": "ITALY",
        "latitudine": 41.858046,
        "longitudine": 12.458645,
        "urlRoute": "dummy"
      }
}

function GetStrutturaByName_Mocked(name, token){
  return {
      // `data` is the response that was provided by the server
      "data": STRUTTURE_MOCK.STRUTTURA_GET,
      // `status` is the HTTP status code from the server response
      "status": 200,
      // `statusText` is the HTTP status message from the server response
      "statusText": 'OK',
      // `headers` the headers that the server responded with
      // All header names are lower cased
      "headers": {},
      // `config` is the config that was provided to `axios` for the request
      "config":{},
      // `request` is the request that generated this response
      // It is the last ClientRequest instance in node.js (in redirects)
      // and an XMLHttpRequest instance the browser
      "request": {}
    }
}

function UpdateStrutturaAnagrafica_Mocked(anagrafica){
    const url = `${config.BaseAPIPath}/clienti/${anagrafica.id}/profilo/anagrafica`
    _logger.debug(`MOCK API: ${url}`);
    return {
        "data": null,
        "status": 204,
        "statusText": 'OK',
        "headers": {},
        "config":{},
        "request": {}
    }
}

function UpdateStrutturaOrarioApertura_Mocked(idStruttura, orarioApertura, token){
    //NIENTE DA IMPLEMENTARE - L'API NON RITORNA NULLA
    const url = `${config.BaseAPIPath}/clienti/${idStruttura}/profilo/orario`
    _logger.trace(`MOCKAD API CALLED: ${url} - PAYLOAD: ${JSON.stringify(orarioApertura)}`)
    return true;
}


export const STRUTTURE_API_MOCKED = {
  GetStrutturaByName_Mocked,
  UpdateStrutturaAnagrafica_Mocked,
  UpdateStrutturaOrarioApertura_Mocked
}