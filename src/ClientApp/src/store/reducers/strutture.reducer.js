import * as log from 'loglevel';
import { StuttureActionTypes } from "../actions/strutture.actions";
import produce from "immer"

const initialState = {
    anagrafica: { },
    images: [], //Array contenente i metadati della gallery
    urlStruttura: null,
//    idStruttura: -1,
    strutturaIsLoading: false,
    errorLoadingStruttura: null,
    apiCallError: null, 
}

const _logger = log.getLogger('strutture.reducer');

export default function StruttureReducer(state = initialState, action){
//    _logger.debug(`REDUCER -> " ${JSON.stringify(action)}`);
switch(action.type){
        case StuttureActionTypes.FETCH_STRUTTURA_BYNAME:
            return{
                ...state,
                strutturaIsLoading: true,
                errorLoadingStruttura: null,
                urlStruttura: null,
            };
        case StuttureActionTypes.FETCH_STRUTTURA_SUCCESS:
        //Anche nel caso di avvenuto aggiornamento di una proprietà ci comportiamo come se avessimo appena letto il dato
        // eslint-disable-next-line no-fallthrough
        case StuttureActionTypes.STRUTTURA_CHANGE_ANAGRAFICA_PROP_SUCCESS:
            let newState = produce(state, draftState=>{
                draftState.strutturaIsLoading = false;
                draftState.anagrafica = {
                    id: action.payload.id,
                    nome: action.payload.nome,
                    ragioneSociale: action.payload.ragioneSociale,
                    email: action.payload.email,
                    numTelefono: action.payload.numTelefono,
                    descrizione: action.payload.descrizione,
                    tipologia: action.payload.tipologia,
                    citta: action.payload.citta,
                    cap: action.payload.cap,
                    country: action.payload.country,
                    latitudine: action.payload.latitudine,
                    longitudine: action.payload.longitudine,
                    urlRoute: action.payload.urlRoute,
                    indirizzo: action.payload.indirizzo
                };
                draftState.orarioApertura= action.payload.orarioApertura;
                draftState.tipoCliente =action.payload.tipoCliente;
                draftState.errorLoadingStruttura = null;
            });
            return newState;

        case StuttureActionTypes.FETCH_STRUTTURA_ERROR:
            return{
                ...state,
                strutturaIsLoading: false,
                struttura: null,
                errorLoadingStruttura: action.payload
            }
        case StuttureActionTypes.STRUTTURA_CHANGE_ORARIO_APERTURA_SUCCESS:
            {
                const newState = produce(state, draftState=>{
                    draftState.orarioApertura = action.value
                });                
                return newState;
            }
        case StuttureActionTypes.STRUTTURA_CHANGE_ORARIO_APERTURA_ERROR:
            {
                const newState = produce(state, draftState=>{
                    draftState.apiCallError = {
                        API:"UpdateOrarioAperture",
                        Error: action.error,
                        PayLoad: action.value,
                        Notified: false
                    }
                });
                return newState;
            }
        case StuttureActionTypes.STRUTTURA_CHANGE_IMAGE_SUCCESS:{
            const idImage = action.payload.id;
            //Verifichiamo se l'immagine modificata esisteva già, in caso affermativo andiamo a sovrascrivere la vecchia, 
            //altrimenti ne aggiungiamo una nuova
            const indexExistingImage = state.images.findIndex((elem)=>elem.id === idImage);
            const newState = produce(state, draftState=>{
                if(indexExistingImage >= 0){
                    draftState.images[indexExistingImage] = action.payload;
                }else{
                    draftState.images.push(action.payload);
                }
            });
            return newState;
        }
        case StuttureActionTypes.STRUTTURA_CHANGE_IMAGE_ERROR:{
            //TODO: DA IMPLEMENTARE
            _logger.error(`NOT IMPLEMENTED REDUCE FOR ACTION TYPE: ${StuttureActionTypes.STRUTTURA_CHANGE_IMAGE_ERROR} - State: ${state}` );
            return state;
        }
        case StuttureActionTypes.STRUTTURA_REMOVE_IMAGE_SUCCESS:{
            const idImage = action.payload.idImage;
            _logger.debug(`Reducer for ${action.type} - ACTION: ${JSON.stringify(action)}`);
            //Verifichiamo se l'immagine modificata esisteva già, in caso affermativo andiamo a sovrascrivere la vecchia, 
            //altrimenti ne aggiungiamo una nuova
            const indexExistingImage = state.images.findIndex((elem)=>elem.id === idImage);
            if(indexExistingImage >= 0){
                return produce(state, draftState=>{
                        draftState.images.splice(indexExistingImage , 1);
                });
            }else{
                //Non abbiamo trovato nello State l'immagine specificata! Non dovrebbe succedere!
                _logger.warn(`ACTION STRUTTURA_REMOVE_IMAGE_SUCCESS - NO IMAGE FOUNDED WITH SPECIFIED ID [${idImage}]`);
                return state;
            }
        }
        case StuttureActionTypes.STRUTTURA_REMOVE_IMAGE_ERROR:{
            //TODO: DA IMPLEMENTARE
            _logger.error(`NOT IMPLEMENTED REDUCE FOR ACTION TYPE: ${StuttureActionTypes.STRUTTURA_REMOVE_IMAGE_ERROR} - State: ${state}` );
            return state;
        }
        case StuttureActionTypes.STRUTTURA_FETCH_IMAGES_SUCCESS:{
            const newState = produce(state, draftState=>{
                draftState.images = action.payload
            });
            return newState;
        }
        case StuttureActionTypes.STRUTTURA_FETCH_IMAGES_ERROR:{
            _logger.error(`NOT IMPLEMENTED REDUCE FOR ACTION TYPE: ${StuttureActionTypes.STRUTTURA_FETCH_IMAGES_ERROR} - State: ${state}` );
            return state;
        }
        default:{
            //_logger.warn(`UNKNOWN ACTION NOT HANDLED -> " ${JSON.stringify(action)}`);
            return state;
        }
    }
}
