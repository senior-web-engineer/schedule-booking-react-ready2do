import produce from "immer"
import * as log from 'loglevel';

// import {USER_CHANGE_STRUTTURA_CORRENTE_PENDING, USER_CHANGE_STRUTTURA_CORRENTE_SUCCESS, USER_CHANGE_STRUTTURA_CORRENTE_ERROR} from '../actions/user.actions'
import {
	R2D_LOGIN_STARTED, R2D_USER_LOOKUPS_COMPLETED, R2D_LOGOUT_SUCCESS,
	R2D_FOLLOW_STRUTTURA_SUCCESS, R2D_UNFOLLOW_STRUTTURA_SUCCESS
} from '../actions/user.actions'

const _logger = log.getLogger('UserReducer');

/*
REDUCER per la gestione dello stato dell'utente
*/
const initialState = {
	currentUser: null,
	userIsAuthenticated: false,
	lookupInProgress: false,
	//idStrutturaAttiva: 10, //Rappresenta la struttura selezionata nella SideNav (non è detto che sia quella attualmente caricata) (per ora gestiamo una sola struttura)
}

function UserReducer(state = initialState, action) {
	//_logger.debug(`UserReduce - state: ${JSON.stringify(state)} - action: ${JSON.stringify(action)}`);
	switch (action.type) {
		case R2D_LOGIN_STARTED: {
			return produce(state, draftState => {
				draftState.userIsAuthenticated = true;
				draftState.lookupInProgress = true;
				draftState.currentUser = action.payload;
			});
		}
		case R2D_USER_LOOKUPS_COMPLETED: {
			return produce(state, draftState => {
				draftState.lookupInProgress = false;
				draftState.currentUser = action.payload;
			});
		}
		case R2D_LOGOUT_SUCCESS: {
			return produce(state, draftState => {
				draftState.userIsAuthenticated = false;
				draftState.lookupInProgress = false;
				draftState.currentUser = null;
				//draftState.idStrutturaAttiva = -1;
			});
		}
		case R2D_FOLLOW_STRUTTURA_SUCCESS: {
			if (state?.currentUser?.struttureSeguite) {
				return produce(state, draftState => {
					draftState.currentUser.struttureSeguite.push(action.payload);
				})
			} else return state; //se non esiste la struttura base c'è qualcosa di anomale, non mutiamo lo stato
		}
		case R2D_UNFOLLOW_STRUTTURA_SUCCESS: {
			if (state?.currentUser?.struttureSeguite) {
				let index = state.currentUser.struttureSeguite.indexOf(e => e.IdCliente === action.payload.idStruttura);
				if (index >= 0) {
					return produce(state, draftState => {
						draftState.currentUser.struttureSeguite.splice(index, 1); //rimuoviamo la struttura seguita dall'array
					});
				} else return state; //se non troviamo la struttura  c'è qualcosa di anomale, non mutiamo lo stato
			} else return state; //se non esiste la struttura base c'è qualcosa di anomale, non mutiamo lo stato
		}
		default:
			return state;
	}
}

export default UserReducer