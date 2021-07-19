import * as log from "loglevel";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import { getStore } from "./store/reduxStore";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { SnackbarProvider } from "notistack";

// Create browser history to use in the Redux store
const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href");
const history = createBrowserHistory({ basename: baseUrl });
// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = window.initialReduxState;

const store = getStore(history, initialState);
const rootElement = document.getElementById("root");

//Configurazione dei vari loggers, da rifattorizzare
(function () {
  log.setLevel("TRACE");
})();

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <SnackbarProvider maxSnack={3} anchorOrigin={{ horizontal: "center", vertical: "bottom" }}>
        <App />
      </SnackbarProvider>
    </ConnectedRouter>
  </Provider>,
  rootElement
);
registerServiceWorker();
