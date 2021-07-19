import produce from "immer"
import * as log from 'loglevel';

// import {USER_CHANGE_STRUTTURA_CORRENTE_PENDING, USER_CHANGE_STRUTTURA_CORRENTE_SUCCESS, USER_CHANGE_STRUTTURA_CORRENTE_ERROR} from '../actions/user.actions'
// import {AAD_LOGIN_SUCCESS, AAD_LOGOUT_SUCCESS} from '../actions/user.actions'

import { AuthenticationActions, AuthenticationState } from 'react-aad-msal';

const _logger = log.getLogger('UserReducer');
/*
REDUCER per la gestione dello stato dell'utente
*/
const initialState = {
	aadResponse: null,
	currentUser: null,
	userIsAuthenticated: false,
	idStrutturaAttiva: 10,
//	struttureOwned: [{Id:10, Nome:'Struttura 1'}, {Id:11, Nome:"Struttura 2"}],
	struttureFollowed: [],
	initializing: false,
	initialized: false,
	accountInfo: {},
	state: AuthenticationState.Unauthenticated,
}

function UserReducer (state=initialState, action ){
    // switch (action.type) {
	// 	case AAD_LOGIN_SUCCESS:
	// 		return { ...state, aadResponse: action.payload };
	// 	case AAD_LOGOUT_SUCCESS:
	// 		return { ...state, aadResponse: null };	
	// 	case USER_CHANGE_STRUTTURA_CORRENTE_SUCCESS:
	// 			return { ...state, idStrutturaAttiva: action.payload };	
	// 	default:
	// 		return state;
	// }
	_logger.debug(`UserReduce - state: ${JSON.stringify(state)} - action: ${JSON.stringify(action)}`);
	switch (action.type) {
		case AuthenticationActions.Initializing:{
			const newState = produce(state, draftState=>{
				draftState.initializing = true;
				draftState.initialized = false;
			});
			return newState;
		}
		case AuthenticationActions.Initialized:{
			const newState = produce(state, draftState=>{
				draftState.initializing = false;
				draftState.initialized = true;
			});
			return newState;
		}
		case AuthenticationActions.LoginSuccess:
		case AuthenticationActions.AcquireTokenSuccess:{
			const newState = produce(state, draftState=>{
				draftState.accountInfo = action.payload;
				draftState.userIsAuthenticated = true;
				draftState.state = AuthenticationState.Authenticated
			});
			return newState;
		}
		case AuthenticationActions.LoginError:
		case AuthenticationActions.AcquireTokenError:
		case AuthenticationActions.LogoutSuccess:{
			const newState = produce(state, draftState=>{
				draftState.accountInfo = {};
				draftState.userIsAuthenticated = false;
				draftState.state = AuthenticationState.Unauthenticated;
			});
			return newState;
		}
		case AuthenticationActions.AuthenticatedStateChanged:
			//TODO: Verificare quando si verifica questo evento e di conseguenza allineare le altre proprietà dello stato
		  return {
			...state,
			state: action.payload,
		  };
		default:
			return state;
		}
}

export default UserReducer