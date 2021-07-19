import { call, put, takeEvery, select } from 'redux-saga/effects'
import * as log from 'loglevel';
import {StruttureAPI} from '../../api/strutture.api'
import {StruttureImagesAPI} from '../../api/strutture.images.api'
import {StruttureSelectors} from '../selectors/strutture.selectors'
import {UserSelectors} from '../selectors/user.selectors'
import {StuttureActionTypes, StruttureActionsCreator} from "../actions/strutture.actions";
import {getAccessToken} from './sagas.utils'

const _logger = log.getLogger("strutture.sagas");


export function* watchFetchStruttura(){
    //NOTA: take every passa l'action al worker
    yield takeEvery(StuttureActionTypes.FETCH_STRUTTURA_BYNAME, fetchStrutturaByName);
}

export function* watchUpdateStrutturaAnagraficaProp(){
    //NOTA: take every passa l'action al worker
    yield takeEvery(StuttureActionTypes.STRUTTURA_CHANGE_ANAGRAFICA_PROP, updateStrutturaAnagraficaProp);
}

export function* watchUpdateStrutturaOrarioApertura(){
    //NOTA: take every passa l'action al worker
    yield takeEvery(StuttureActionTypes.STRUTTURA_CHANGE_ORARIO_APERTURA, updateStrutturaOrarioApertura);
}

export function* watchUpdateStrutturaImage(){
    yield takeEvery(StuttureActionTypes.STRUTTURA_CHANGE_IMAGE, updateStrutturaImage);
}

export function* watchRemoveStrutturaImage(){
    yield takeEvery(StuttureActionTypes.STRUTTURA_REMOVE_IMAGE, removeStrutturaImage);
}

export function* watchFetchStrutturaImages(){
    yield takeEvery(StuttureActionTypes.STRUTTURA_FETCH_IMAGES, fetchStrutturaImages);
}


export function* fetchStrutturaByName(action){
    //Nota: il parametro action viene valorizzato con l'action catturata dal watcher (dal metodo takeEvery)
    try{
        const nomeStruttura = action.payload;
        //Se è già stata caricata l'anagrafica per la struttura non invochiamo l'API
        const anagrafica = yield select(StruttureSelectors.getAnagrafica);
        if(!anagrafica || !anagrafica.nome || anagrafica.nome !== nomeStruttura){
            _logger.debug(`fetchStrutturaByName(${nomeStruttura}) - Invocazione API per recupero Anagrafica`);
            const response = yield call(StruttureAPI.GetStrutturaByName, nomeStruttura);
            _logger.debug(`fetchStrutturaByName(${nomeStruttura}) - returned: ${JSON.stringify(response.data)}`);
            if(response){
                yield put(StruttureActionsCreator.fetchStrutturaSuccess(response.data));
            }else{
                yield put(StruttureActionsCreator.fetchStrutturaError(response.data));
            }
        }else{
            _logger.debug(`fetchStrutturaByName(${nomeStruttura}) - Anagrafica già risolta, API non invocata`);
        }    
    }catch(error)
    {
        _logger.error(error);
        yield put(StruttureActionsCreator.fetchStrutturaError(error));
    }
}

/* */
export function* updateStrutturaAnagraficaProp(action){
    _logger.debug(`BEGIN updateStrutturaAnagraficaProp. Action: ${JSON.stringify(action)}`);
    const propName = action.payload.propName;
    const propValue = action.payload.propValue;
    try{        
        //Recuperiamo l'anagrafica corrente (pre modifica dallo store Redux)
        const anagrafica  = yield select(StruttureSelectors.getAnagrafica);
        const token = getAccessToken();
        _logger.debug(`Recuperata anagrafica struttura dallo store. ${JSON.stringify(anagrafica)}`);
        //Applichiamo la modifica alla specifica proprietà modificata
        anagrafica[propName] = propValue;
        _logger.debug(`Anagrafica patched con il nuovo valore per la proprieta [${propName}]. ${JSON.stringify(anagrafica)}`);
        _logger.debug(`Invocazione StruttureAPI.UpdateStrutturaAnagrafica per update prop: ${propName} -newValue: ${propValue}`);
        //Invochiamo l'API per aggiornare l'intera anagrafica
        const response = yield call(StruttureAPI.UpdateStrutturaAnagrafica, anagrafica, token)
        return response;
    }catch(error){
        _logger.error(`Errore durante l'invocazione di updateStrutturaAnagraficaProp. action: ${action} - ERROR: ${error}`);
        yield put(StruttureActionsCreator.updateStrutturaPropError, propName, propValue, error);
    }
}

export function* updateStrutturaOrarioApertura(action){
    _logger.debug(`BEGIN updateStrutturaOrarioApertura. Action: ${JSON.stringify(action)}`);
    const newOrario = action.payload.value;
    try{
        const idStruttura  = yield select(StruttureSelectors.getIdStrutturaCorrente);
        const token = getAccessToken();
        //Invochiamo l'API per aggiornare l'orario
        yield call(StruttureAPI.UpdateStrutturaOrarioApertura, idStruttura, newOrario, token);
        yield put(StruttureActionsCreator.updateStrutturaOrarioAperturaSuccess(newOrario));
    }catch(error){
        _logger.error(`Errore durante l'invocazione di updateStrutturaOrarioApertura. action: ${action} - ERROR: ${error}`);
        yield put(StruttureActionsCreator.updateStrutturaOrarioAperturaError(newOrario, error));
    }
}


export function* updateStrutturaImage(action){
    _logger.debug(`BEGIN updateStrutturaImage. Action: ${JSON.stringify(action)}`);
    try{
        const idStruttura  = yield select(StruttureSelectors.getIdStrutturaCorrente);
        _logger.debug(`IdStruttura: ${idStruttura}`);
        const token = yield select(UserSelectors.getAccessToken);
        const tipoImmagine = action.payload.imageType;
        const file = action.payload.file;
        const imageId = action.payload.imageKey ?? -1;
        const ordinamento = action.payload.imageOrder ?? -1;
        //Invochiamo l'API per caricare l'immagine
        const response = yield call(StruttureImagesAPI.UpdateStrutturaImage, idStruttura, tipoImmagine, file, imageId, ordinamento, token);
        yield put(StruttureActionsCreator.updateStrutturaImmagineSuccess(response.data));
        _logger.debug(`Caricata immagine. Response: ${JSON.stringify(response)}`);
    }catch(error){
        _logger.error(`Errore durante l'invocazione di updateStrutturaImage. action: ${action} - ERROR: ${error}`);
        yield put(StruttureActionsCreator.updateStrutturaImmagineError(error));
    }
}

export function* removeStrutturaImage(action){
    _logger.debug(`BEGIN removeStrutturaImage. Action: ${JSON.stringify(action)}`);
    const imageId = action.payload.idImage;
    try{
        const idStruttura  = yield select(StruttureSelectors.getIdStrutturaCorrente);
        const token = yield select(UserSelectors.getAccessToken);
        _logger.debug(`IdStruttura: ${idStruttura} - imageId: ${imageId} - token: ${token}`);
        yield call(StruttureImagesAPI.RemoveStrutturaImage, idStruttura, imageId, token);
        yield put(StruttureActionsCreator.removeStrutturaImmagineSuccess(imageId));
    }catch(error){
        _logger.error(`Errore durante l'invocazione di removeStrutturaImage. action: ${action} - ERROR: ${error}`);
        yield put(StruttureActionsCreator.removeStrutturaImmagineError(imageId, imageId));
    }
}

export function* fetchStrutturaImages(action){
    _logger.debug(`BEGIN fetchStrutturaImages. Action: ${JSON.stringify(action)}`);
    try{
        const idStruttura  = action.payload.idStruttura;
        _logger.debug(`IdStruttura: ${idStruttura}`);
        // if(!idStruttura){
        //     _logger.debug(`fetchStrutturaImages -> non è ancora stata caricata l'anagrafica, la carichiamo. Action: ${JSON.stringify(action)}`);
        //     //Se non è ancora stata caricata l'anagrafica, la carichiamo
        //     yield call(fetchStrutturaByName, StruttureActionsCreator.fetchStrutturaByName(action.payload.nomeStruttura));
        // }
        const token = yield select(UserSelectors.getAccessToken);
        let state = yield select();
        const tipoImmagine = action.payload ? action.payload.imageType || null : null;
        //Invochiamo l'API per caricare le immagini
        const response = yield call(StruttureImagesAPI.FetchStrutturaImages, idStruttura, tipoImmagine, token);
        yield put(StruttureActionsCreator.fetchStrutturaImmaginiSuccess(response.data));
        _logger.debug(`Recuperate immagine. Response: ${JSON.stringify(response)}`);
    }catch(error){
        _logger.error(`Errore durante l'invocazione di fetchStrutturaImages. action: ${action} - ERROR: ${error}`);
        yield put(StruttureActionsCreator.fetchStrutturaImmaginiError(error));
    }

}