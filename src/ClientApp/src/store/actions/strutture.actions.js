const FETCH_STRUTTURA_BYNAME = 'FETCH_STRUTTURA_BYNAME';
const FETCH_STRUTTURA_SUCCESS = 'FETCH_STRUTTURA_SUCCESS';
const FETCH_STRUTTURA_ERROR = 'FETCH_STRUTTURA_ERROR';

const STRUTTURA_CHANGE_ANAGRAFICA_PROP = 'STRUTTURA_CHANGE_ANAGRAFICA_PROP'
const STRUTTURA_CHANGE_ANAGRAFICA_PROP_ERROR = 'STRUTTURA_CHANGE_ANAGRAFICA_PROP_ERROR'
const STRUTTURA_CHANGE_ANAGRAFICA_PROP_SUCCESS = 'STRUTTURA_CHANGE_ANAGRAFICA_PROP_SUCCESS'

const STRUTTURA_CHANGE_ORARIO_APERTURA = 'STRUTTURA_CHANGE_ORARIO_APERTURA'
const STRUTTURA_CHANGE_ORARIO_APERTURA_ERROR = 'STRUTTURA_CHANGE_ORARIO_APERTURA_ERROR'
const STRUTTURA_CHANGE_ORARIO_APERTURA_SUCCESS = 'STRUTTURA_CHANGE_ORARIO_APERTURA_SUCCESS'

const STRUTTURA_FETCH_IMAGES = 'STRUTTURA_FETCH_IMAGES'
const STRUTTURA_FETCH_IMAGES_ERROR = 'STRUTTURA_FETCH_IMAGES_ERROR'
const STRUTTURA_FETCH_IMAGES_SUCCESS = 'STRUTTURA_FETCH_IMAGES_SUCCESS'


const STRUTTURA_CHANGE_IMAGE = 'STRUTTURA_CHANGE_IMAGE'
const STRUTTURA_CHANGE_IMAGE_ERROR = 'STRUTTURA_CHANGE_IMAGE_ERROR'
const STRUTTURA_CHANGE_IMAGE_SUCCESS = 'STRUTTURA_CHANGE_IMAGE_SUCCESS'

const STRUTTURA_REMOVE_IMAGE = 'STRUTTURA_REMOVE_IMAGE'
const STRUTTURA_REMOVE_IMAGE_ERROR = 'STRUTTURA_REMOVE_IMAGE_ERROR'
const STRUTTURA_REMOVE_IMAGE_SUCCESS = 'STRUTTURA_REMOVE_IMAGE_SUCCESS'


function fetchStrutturaByName(nomeStruttura) {
    return {
        type: FETCH_STRUTTURA_BYNAME,
        payload: nomeStruttura,
    }
}

function fetchStrutturaSuccess(datiStruttura) {
    return {
        type: FETCH_STRUTTURA_SUCCESS,
        payload: datiStruttura
    }
}

function fetchStrutturaError(error) {
    return {
        type: FETCH_STRUTTURA_ERROR,
        error: error
    }
}

function updateStrutturaProp(propName, propValue){
    return {
        type: STRUTTURA_CHANGE_ANAGRAFICA_PROP,
        payload:{
            propName,
            propValue
        }
    }
}

function updateStrutturaPropSuccess(propName, propValue){
    return {
        type: STRUTTURA_CHANGE_ANAGRAFICA_PROP_SUCCESS,
        payload:{
            propName,
            propValue
        }
    }
}

function updateStrutturaPropError(propName, propValue, error){
    return {
        type: STRUTTURA_CHANGE_ANAGRAFICA_PROP_ERROR,
        payload:{
            error,
            propName,
            propValue
        }
    }
}

function updateStrutturaOrarioApertura(value){
    return {
        type: STRUTTURA_CHANGE_ORARIO_APERTURA,
        payload:{
            value
        }
    }
}

function updateStrutturaOrarioAperturaSuccess(value){
    return {
        type: STRUTTURA_CHANGE_ORARIO_APERTURA_SUCCESS,
        payload:{
            value
        }
    }
}

function updateStrutturaOrarioAperturaError(value, error){
    return {
        type: STRUTTURA_CHANGE_ORARIO_APERTURA_ERROR,
        payload:{
            error,
            value
        }
    }
}

function fetchStrutturaImmagini(value){
    return {
        type: STRUTTURA_FETCH_IMAGES,
        payload: value
    }
}
function fetchStrutturaImmaginiSuccess(value){
    return {
        type: STRUTTURA_FETCH_IMAGES_SUCCESS,
        payload: value
    }
}
function fetchStrutturaImmaginiError(error){
    return {
        type: STRUTTURA_FETCH_IMAGES_ERROR,
        payload: error
    }
}


function updateStrutturaImmagine(value){
    return {
        type: STRUTTURA_CHANGE_IMAGE,
        payload: value
    }
}

function updateStrutturaImmagineSuccess(value){
    return {
        type: STRUTTURA_CHANGE_IMAGE_SUCCESS,
        payload:{
            value
        }
    }
}

function updateStrutturaImmagineError(value, error){
    return {
        type: STRUTTURA_CHANGE_IMAGE_ERROR,
        payload:{
            error,
            value
        }
    }
}

function removeStrutturaImmagine(idImage){
    return {
        type: STRUTTURA_REMOVE_IMAGE,
        payload:{
            idImage: idImage
        }
    }
}

function removeStrutturaImmagineSuccess(idImage){
    return {
        type: STRUTTURA_REMOVE_IMAGE_SUCCESS,
        payload:{
            idImage:idImage
        }
    }
}

function removeStrutturaImmagineError(idImage, error){
    return {
        type: STRUTTURA_REMOVE_IMAGE_ERROR,
        payload:{
            error,
            idImage:idImage
        }
    }
}


export const StuttureActionTypes = {
    FETCH_STRUTTURA_BYNAME,
    FETCH_STRUTTURA_SUCCESS,
    FETCH_STRUTTURA_ERROR,
    
    STRUTTURA_CHANGE_ANAGRAFICA_PROP,
    STRUTTURA_CHANGE_ANAGRAFICA_PROP_ERROR,
    STRUTTURA_CHANGE_ANAGRAFICA_PROP_SUCCESS,    

    STRUTTURA_CHANGE_ORARIO_APERTURA,
    STRUTTURA_CHANGE_ORARIO_APERTURA_ERROR,
    STRUTTURA_CHANGE_ORARIO_APERTURA_SUCCESS,

    STRUTTURA_CHANGE_IMAGE,
    STRUTTURA_CHANGE_IMAGE_ERROR,
    STRUTTURA_CHANGE_IMAGE_SUCCESS,

    STRUTTURA_REMOVE_IMAGE,
    STRUTTURA_REMOVE_IMAGE_ERROR,
    STRUTTURA_REMOVE_IMAGE_SUCCESS,

    STRUTTURA_FETCH_IMAGES,
    STRUTTURA_FETCH_IMAGES_ERROR,
    STRUTTURA_FETCH_IMAGES_SUCCESS,
}

export const StruttureActionsCreator = {
        fetchStrutturaByName, 
        fetchStrutturaSuccess, 
        fetchStrutturaError, 
        updateStrutturaProp,
        updateStrutturaPropSuccess,
        updateStrutturaPropError,
        updateStrutturaOrarioApertura,
        updateStrutturaOrarioAperturaSuccess,
        updateStrutturaOrarioAperturaError,
        updateStrutturaImmagine,
        updateStrutturaImmagineSuccess,
        updateStrutturaImmagineError,
        removeStrutturaImmagine,
        removeStrutturaImmagineSuccess,
        removeStrutturaImmagineError,
        fetchStrutturaImmagini,
        fetchStrutturaImmaginiSuccess,
        fetchStrutturaImmaginiError
}