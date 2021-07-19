import config from '../../config'
import { select } from 'redux-saga/effects'
import {UserSelectors} from '../selectors/user.selectors'
import * as log from 'loglevel';

const _logger = log.getLogger("sagas.utils");

export function* getAccessToken(){
    let token = "";
    if(!config.MokedApi){
        token = yield select(UserSelectors.getAccessToken);
        _logger.debug(`Retrieved Token from Store - Token: ${token}`);
    }
    return token;
}