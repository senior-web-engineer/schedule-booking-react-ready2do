import React, { useContext } from 'react'
import { Button } from "@material-ui/core";
import { AuthContext } from '../../AuthContext';
import { AuthenticationState, MsalRedirectAuthProvider } from 'react-aad-msal';

export default function LoginButton(props) {
    const b2cProvider = useContext(AuthContext);
   
    const handleClick = function(e){
        console.log(b2cProvider);
        let provider = b2cProvider.getAuthProvider();
        const authState =  b2cProvider.getAuthProvider().authenticationState;
        console.log(provider);
        console.log(authState);
        console.log("provider.authenticationState:" + authState);
        if(authState == AuthenticationState.Unauthenticated){
            provider.login();
        }else{
            const account = provider.getAccountInfo();
            console.log("AuthenticationState.Authenticated");
            console.log(account);
        }
    };
    return (
        // <AzureAD
        //     provider={
        //     new MsalAuthProviderFactory(config, authenticationParameters, LoginType.Redirect)
        //     }
        //     unauthenticatedFunction={this.loginCallback}
        //     authenticatedFunction={this.logoutCallback}
        //     accountInfoCallback={this.printAccountInfo}
        // />
        //<Button onClick={handleClick(b2cProvider)}>Login Info</Button>
        <MsalRedirectAuthProvider></MsalRedirectAuthProvider> 
    )
}