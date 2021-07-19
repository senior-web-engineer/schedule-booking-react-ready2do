import React from 'react';
import { Route, Switch } from 'react-router';
import { ThemeProvider } from '@material-ui/styles';
import HomePage from './components/pages/HomePage';
import StrutturaRouter from './components/struttura/StrutturaRouter'
import Theme from './Theme';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import itLocale from "date-fns/locale/it";
import UtenteRouter from './components/utente/UtenteRouter'

import AzureAD from 'react-aad-msal';
import { authProvider } from './authProvider'
import { getStore } from './store/reduxStore'
import RegistrazioneStruttura from './components/registrazione/RegistrazioneStruttura';


export default () => (
  <ThemeProvider theme={Theme}>
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={itLocale}>
      {/* Primo livello di Routing per distinguere la Home (landing) dalle pagine delle struttura */}
      <Switch>
        <Route exact path='/'>
          <HomePage />
        </Route>
        <Route exact path='/registrazione'>
          <AzureAD forceLogin provider={authProvider} reduxStore={getStore()}>
            <RegistrazioneStruttura />
          </AzureAD>
        </Route>
        <Route path='/me/'>
          <UtenteRouter />
        </Route>
        <Route path='/:nomeStruttura' >
          <StrutturaRouter />
        </Route>
      </Switch>
    </MuiPickersUtilsProvider>
  </ThemeProvider>
);
