// authProvider.js
import { MsalAuthProvider, LoginType } from 'react-aad-msal';
import { Logger, LogLevel } from 'msal';

const tenant = "ready2do.onmicrosoft.com";
const signInPolicy = "B2C_1_SigninSignup";
const applicationID = "2f7c5099-8cf6-4cc3-a601-6e8afdac86f7";
const reactRedirectUri = window.location.origin;
const tenantSubdomain = tenant.split(".")[0];
const instance = `https://${tenantSubdomain}.b2clogin.com/tfp/`;
const signInAuthority = `${instance}${tenant}/${signInPolicy}`;


const config = {
  auth: {
    //authority: 'https://login.microsoftonline.com/tfp/ready2do.onmicrosoft.com/B2C_1_SigninSignup',
    // authority: 'https://ready2do.b2clogin.com/ready2do.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_SigninSignup',
    // clientId: '2f7c5099-8cf6-4cc3-a601-6e8afdac86f7',
    // redirectUri: window.location.origin, //'https://localhost:44343/',
    // validateAuthority: true,
    authority: signInAuthority,
    clientId: applicationID,
    redirectUri: reactRedirectUri,
    validateAuthority: false
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: true
  },
  system: {
    logger: new Logger(
      (logLevel, message, containsPii) => {
        console.log('[MSAL]', message);
      },
      {
        level: LogLevel.Warning,
        piiLoggingEnabled: false,
      },
    ),
  },
};
 
const authenticationParameters = {
  scopes: [
    'https://ready2do.onmicrosoft.com/api/api_all'
  ]
}

const authProviderOptions={
  loginType: LoginType.Redirect,
    // When a token is refreshed it will be done by loading a page in an iframe.
    // Rather than reloading the same page, we can point to an empty html file which will prevent
    // site resources from being loaded twice.
    //tokenRefreshUri: window.location.origin + '/auth.html',
}

export const authProvider = new MsalAuthProvider(config, authenticationParameters, authProviderOptions)