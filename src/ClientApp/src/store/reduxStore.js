import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
//import thunk from 'redux-thunk';
import { connectRouter, routerMiddleware } from 'connected-react-router'
import StruttureReducer from './reducers/strutture.reducer'
import UserReducer from './reducers/user.reducer'
import createSagaMiddleware from 'redux-saga'
import {rootSagas} from './sagas/root.sagas'

let store = null;

function configureStore (history, initialState) {
  const reducers = {
    struttura: StruttureReducer,
    user: UserReducer
  };

  const sagaMiddleware = createSagaMiddleware();
  const middleware = [
    //thunk,
    sagaMiddleware,
    routerMiddleware(history)
  ];

  // In development, use the browser's Redux dev tools extension if installed
  const enhancers = [];
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (isDevelopment && typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__) {
    enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__());
  }

  const rootReducer = combineReducers({
    ...reducers,
    //routing: routerReducer
      router: connectRouter(history)
  });

  
  let result = createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...middleware), ...enhancers)
  );

  sagaMiddleware.run(rootSagas);

  return result;
}


export const getStore = (history, initialState) =>{
  //Se lo Store non è mai stato creato, lo creiamo
  if(!store){
    store = configureStore(history, initialState);
  }
  return store;
}