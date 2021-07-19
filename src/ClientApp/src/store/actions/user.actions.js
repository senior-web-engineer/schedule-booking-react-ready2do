/**
 * Action generata dopo che il login è avvenuto correttamente ma prima di recuperare i dati specifici dell'utente dal server
 */
export const R2D_LOGIN_STARTED = 'R2D_LOGIN_STARTED';
/**
 * Action generata dopo la R2D_LOGIN_STARTED, quando il lookup dei dati dell'utente corrente sono stati caricati
 */
export const R2D_USER_LOOKUPS_COMPLETED = 'R2D_USER_LOOKUP_COMPLETED';


export const R2D_LOGOUT_REQUESTED = 'R2D_LOGOUT_REQUESTED';
/**
 * Action generata dopo che è stato completato il logout
 */
export const R2D_LOGOUT_SUCCESS = 'R2D_LOGOUT_SUCCESS';


export const R2D_FOLLOW_STRUTTURA_REQUESTED = 'R2D_FOLLOW_STRUTTURA_REQUESTED'
export const R2D_FOLLOW_STRUTTURA_SUCCESS = 'R2D_FOLLOW_STRUTTURA_SUCCESS'

export const R2D_UNFOLLOW_STRUTTURA_REQUESTED = 'R2D_UNFOLLOW_STRUTTURA_REQUESTED'
export const R2D_UNFOLLOW_STRUTTURA_SUCCESS = 'R2D_UNFOLLOW_STRUTTURA_SUCCESS'

// export const USER_CHANGE_STRUTTURA_CORRENTE_PENDING = 'USER_CHANGE_STRUTTURA_CORRENTE_PENDING';
// export const USER_CHANGE_STRUTTURA_CORRENTE_SUCCESS = 'USER_CHANGE_STRUTTURA_CORRENTE_SUCCESS';
// export const USER_CHANGE_STRUTTURA_CORRENTE_ERROR = 'USER_CHANGE_STRUTTURA_CORRENTE_SUCCESS';

function r2dLoginStarted(userInfoPartial) {
    return {
        type: R2D_LOGIN_STARTED,
        payload: userInfoPartial
    }
}

function r2dUserLookupsCompleted(userInfo) {
    return {
        type: R2D_USER_LOOKUPS_COMPLETED,
        payload: userInfo
    }
}


function r2dLogoutRequested() {
    return {
        type: R2D_LOGOUT_REQUESTED
    }
}

function r2dLogoutSuccess() {
    return {
        type: R2D_LOGOUT_SUCCESS
    }
}

function r2dFollowStrutturaRequested(idStruttura) {
    return {
        type: R2D_FOLLOW_STRUTTURA_REQUESTED,
        payload: { idStruttura }
    }
}

function r2dFollowStrutturaSuccess(strutturaSeguita) {
    return {
        type: R2D_FOLLOW_STRUTTURA_SUCCESS,
        payload: strutturaSeguita
    }
}

function r2dUnFollowStrutturaRequested(idStruttura) {
    return {
        type: R2D_UNFOLLOW_STRUTTURA_REQUESTED,
        payload: { idStruttura }
    }
}

function r2dUnFollowStrutturaSuccess(idStruttura) {
    return {
        type: R2D_FOLLOW_STRUTTURA_SUCCESS,
        payload: { idStruttura }
    }
}

// function changeStrutturaCorrente() {
//     return {
//         type: USER_CHANGE_STRUTTURA_CORRENTE_PENDING
//     }
// }

// function changeStrutturaCorrenteSuccess(idNuovaStruttura) {
//     return {
//         type: USER_CHANGE_STRUTTURA_CORRENTE_SUCCESS,
//         payload: idNuovaStruttura
//     }
// }

// function changeStrutturaCorrenteError(error) {
//     return {
//         type: USER_CHANGE_STRUTTURA_CORRENTE_ERROR,
//         error: error
//     }
// }

export const UserActionsCreator = {
    r2dLoginStarted,
    r2dUserLookupsCompleted,
    r2dLogoutRequested,
    r2dLogoutSuccess,
    r2dFollowStrutturaRequested,
    r2dFollowStrutturaSuccess,
    r2dUnFollowStrutturaRequested,
    r2dUnFollowStrutturaSuccess,
    // changeStrutturaCorrente, 
    // changeStrutturaCorrenteSuccess, 
    // changeStrutturaCorrenteError 
}