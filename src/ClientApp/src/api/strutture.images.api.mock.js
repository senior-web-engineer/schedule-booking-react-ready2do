import config from '../config'
import * as log from 'loglevel'

const _logger = log.getLogger('strutture.images.api.mocked');

function UpdateStrutturaImage_Mocked(idStruttura, tipoImmagine, blobImage, imageKey, ordinamento, token){
    const url = `${config.BaseAPIPath}/clienti/${idStruttura}/images/upload`
    _logger.debug(`MOCK API: ${url}`);
}

function RemoveStrutturaImage_Mocked(idStruttura, idImmagine, token){
    const url = `${config.BaseAPIPath}/clienti/${idStruttura}/images`
    _logger.debug(`MOCK API: ${url}`);
}

function FetchStrutturaImages_Mocked(idStruttura, tipoImmagine, token){
    let url = `${config.BaseAPIPath}/clienti/${idStruttura}/images`;
    if(tipoImmagine){ url += `?tipo=${tipoImmagine}`; }
    _logger.trace(`MOCK  API: [GET] ${url}`);
}


export const STRUTTURE_API_IMAGES_MOCKED = {
    UpdateStrutturaImage_Mocked,
    RemoveStrutturaImage_Mocked,
    FetchStrutturaImages_Mocked
}