import axios from 'axios';
import config from '../config'
//import {APIUtils} from './apiUtils'
import * as log from 'loglevel'
import {STRUTTURE_API_IMAGES_MOCKED} from './strutture.images.api.mock'

const _logger = log.getLogger('strutture.images.api');

/**
 * 
 * @param {*} idStruttura 
 * @param {*} tipoImmagine 1=LogoCliente, 2=Sfondo, 3=Gallery
 * @param {*} blobImage 
 * @param {*} imageKey 
 */
function UpdateStrutturaImage(idStruttura, tipoImmagine, blobImage, imageKey, ordinamento, token){
    const url = `${config.BaseAPIPath}/clienti/${idStruttura}/images/upload`;
    _logger.debug(`Invoking API: [POST] ${url} - tipoImmagine: ${tipoImmagine}, imageKey: ${imageKey}`);
    let formData = new FormData();
    formData.append("Id", imageKey);
    formData.append("TipoImmagine", tipoImmagine);
    formData.append("File",blobImage);
    formData.append("Ordinamento",ordinamento);
    const response = axios.post(url, formData,{
        headers:{
            'Content-Typep': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        }
    })
    return response;    
}

function RemoveStrutturaImage(idStruttura, imageKey, token){
    const url = `${config.BaseAPIPath}/clienti/${idStruttura}/images/${imageKey}`;
    _logger.debug(`Invoking API: [DELETE] ${url}`);
    const response = axios.delete(url, {
        headers:{
            'Content-Typep': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        }
    })
    return response;
}

/**
 * 
 * @param {*} idStruttura 
 * @param {*} tipoImmagine 
 * @param {*} token 
 */
function FetchStrutturaImages(idStruttura, tipoImmagine, token){
    let url = `${config.BaseAPIPath}/clienti/${idStruttura}/images`;
    if(tipoImmagine){ url += `?tipo=${tipoImmagine}`; }
    _logger.debug(`Invoking API: [GET] ${url}`);
    const response = axios.get(url,{
        headers:{
            'Authorization': `Bearer ${token}`
        }
    });
    return response;
}


export const StruttureImagesAPI = {
    UpdateStrutturaImage : false ? STRUTTURE_API_IMAGES_MOCKED.UpdateStrutturaImage_Mocked : UpdateStrutturaImage,
    RemoveStrutturaImage : false ? STRUTTURE_API_IMAGES_MOCKED.RemoveStrutturaImage_Mocked : RemoveStrutturaImage,
    FetchStrutturaImages: false ? STRUTTURE_API_IMAGES_MOCKED.FetchStrutturaImages_Mocked :FetchStrutturaImages
}
