import { all } from 'redux-saga/effects'
//import {watchFetchStruttura, watchUpdateStrutturaAnagraficaProp, watchUpdateStrutturaOrarioApertura } from './strutture.sagas'
import * as struttureSagas from './strutture.sagas'
import * as userSagas from './users.sagas'

export function* rootSagas() {
    yield all([
        userSagas.watchLoginSucces(),
        userSagas.watchFollowStrutturaRequest(),
        userSagas.watchUnFollowStrutturaRequest(),
        struttureSagas.watchFetchStruttura(),
        struttureSagas.watchUpdateStrutturaAnagraficaProp(),
        struttureSagas.watchUpdateStrutturaOrarioApertura(),
        struttureSagas.watchRemoveStrutturaImage(),
        struttureSagas.watchUpdateStrutturaImage(),
        struttureSagas.watchFetchStrutturaImages(),
    ])
  }