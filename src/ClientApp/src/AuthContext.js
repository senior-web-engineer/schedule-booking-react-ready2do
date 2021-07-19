import React from 'react'
import Configs from './config'
import { LoginType, MsalAuthProviderFactory } from 'react-aad-msal';

const b2cProviderFactory = new MsalAuthProviderFactory(Configs.AzureB2COptions, Configs.AzureB2CAuthenticationParameters, LoginType.Popup);
const AuthContext = React.createContext();

const AuthProvider = (props) =>{
    return(
    <AuthContext.Provider value={b2cProviderFactory}>
        {props.children}
    </AuthContext.Provider>
    )
}

export {AuthContext, AuthProvider}