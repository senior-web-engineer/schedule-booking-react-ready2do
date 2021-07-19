import { call, put, takeEvery, all } from 'redux-saga/effects'
import * as log from 'loglevel';
import { AuthenticationActions } from 'react-aad-msal';
import { UserActionsCreator, R2D_LOGOUT_REQUESTED, R2D_FOLLOW_STRUTTURA_REQUESTED, R2D_UNFOLLOW_STRUTTURA_REQUESTED } from '../actions/user.actions';
import { StruttureAPI } from '../../api/strutture.api';
import { UsersAPI } from '../../api/users.api';

const _logger = log.getLogger("users.sagas");

/**
 * Intercetta le Action di tipo AAD_LOGIN_SUCCESS
 */
export function* watchLoginSucces() {
    //NOTA: take every passa l'action al worker
    yield takeEvery(AuthenticationActions.LoginSuccess, handleLoginSuccess);
}

// export function* watchLogoutRequest() {
//     //NOTA: take every passa l'action al worker
//     yield takeEvery(R2D_LOGOUT_REQUESTED, handleLogoutRequest);
// }

export function* watchFollowStrutturaRequest(){
    yield takeEvery(R2D_FOLLOW_STRUTTURA_REQUESTED, handleFollowStrutturaRequest)
}

export function* watchUnFollowStrutturaRequest(){
    yield takeEvery(R2D_UNFOLLOW_STRUTTURA_REQUESTED, handleUnFollowStrutturaRequest)
}

/**
 * Riceve l'action contenente i dati dell'account ritornati da Azure AD B2C e li rimappa in un oggetto di tipo R2DUserInfo 
 * dopo aver integrato le informazioni con i dati recuperati tramite chiamate alle API
 * @param {*} action : il payload è di tipo IAccountInfo
 */
export function* handleLoginSuccess(action) {
    _logger.debug(`user.sagas->handleLoginSuccess(${JSON.stringify(action)})`);
    const account = action.payload.account;
    //Iniziamo a costruire l'oggetto R2DUserInfo
    //ATTENZIONE: le strutture gestite le recuperiamo dall' IdToken e non dalle API
    const strutture = account.idTokenClaims?.extension_struttureOwned?.split(",") ?? [];
    let struttureOwned = [];
    const isNewUser = account.idTokenClaims?.isNewUser ?? false;

    let userInfo = {
        id: account.accountIdentifier,
        name: account.name,
        givenName: account.idTokenClaims?.given_name,
        familyName: account.idTokenClaims?.family_name,
        email: account.idTokenClaims.emails[0],
        isGlobalAdmin: account.idTokenClaims?.extension_isGlobalAdmin,
        dataConfermaEmail: account.idTokenClaims?.extension_emailConfirmationDate,
        idStruttureOwned: account.idToken.extension_struttureOwned?.split(","),
        idToken: action.payload.jwtIdToken,
        struttureOwned: [],
        details: {}
    }
    //Generiamo l'action R2D_LOGIN_STARTED
    yield put(UserActionsCreator.r2dLoginStarted(userInfo));
    //Se è un nuovo utente, chimiamo l'API di backend per gestire l'evento di registrazione
    call(UsersAPI.NotifyNewUser, userInfo.accountIdentifier, userInfo.email);
    
    //Recuperiamo le informazioni per l'utente e le integriamo nell'oggeto userInfo
    //1. Se l'utente è owner di almeno una struttura facciamo il lookup delle strutture
    if (strutture && strutture.length > 0) {
        //Facciamo il lookup di tutte le strutture gestite in parallelo
        struttureOwned = yield all(strutture.map(idStruttura=>call(StruttureAPI.GetStrutturaById, idStruttura)));
        // for (let idx = 0; idx < strutture.length; idx++) {
        //     let response = yield call(StruttureAPI.GetStrutturaById, strutture[idx]);
        //     if (response) {
        //         struttureOwned.push({
        //             id: strutture[idx],
        //             nome: response.data.nome,
        //             urlRoute: response.data.urlRoute,
        //             ragSociale: response.data.ragSociale,
        //             logoUrl: response.data.logoUrl
        //         });
        //     }
        // }
    }
    //Carichiamo le strutture seguite dall'utente e gli appuntamenti futuri esistenti in parallelo
    const [struttureSeguite, appuntamenti] = yield all([call(UsersAPI.GetCurrentUserClientiFollowedAsync), call(UsersAPI.GetCurrentUserAppuntamentiAsync) ])
    userInfo = Object.assign({}, userInfo, { struttureOwned: struttureOwned.map(so=>so.data), struttureSeguite, appuntamenti });
    // let response = yield call(UsersAPI.GetCurrentUserDetailsAsync, { incAppDaConf: true, incCerts: true })
    // userInfo = Object.assign({}, userInfo, { struttureOwned, details: response.data });
    //Generiamo un action di tipo R2D_USER_LOOKUPS_COMPLETED
    yield put(UserActionsCreator.r2dUserLookupsCompleted(userInfo));
}

// export function* handleLogoutRequest(action){
//     yield call(UsersAPI.lo)

// }


export function* handleFollowStrutturaRequest(action){
    _logger.debug(`Usersagas->handleFollowStrutturaRequest->${JSON.stringify(action)}`);
    //Invichiamo l'API per l'associazione
    let associazione = yield call(StruttureAPI.FollowStruttura,action.payload.idStruttura);
    //Generiamo l'action di completamento con il dettaglio dell'associazione come payload
    yield put(UserActionsCreator.r2dFollowStrutturaSuccess(associazione));
}



export function* handleUnFollowStrutturaRequest(action){
    _logger.debug(`Usersagas->handleUnFollowStrutturaRequest->${JSON.stringify(action)}`);
    //Invichiamo l'API per l'associazione
    yield call(StruttureAPI.UnFollowStruttura,action.payload.idStruttura);
    //Generiamo l'action di completamento con il dettaglio dell'associazione come payload
    yield put(UserActionsCreator.r2dUnFollowStrutturaSuccess(action.payload.idStruttura));
}