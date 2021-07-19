//import { createSelector } from 'reselect'

// const getStruttureOwned = (state)=>{
//     if (!state.user || !state.user.userIsAuthenticated) return null;
//     return state.user.accountInfo.account.idToken.extension_struttureOwned?.split(",");
// }

const getUserInfo = (state) => {
    if (!state.user || !state.user.userIsAuthenticated) return null;
    return {
        id: state.user.accountInfo.account.accountIdentifier,
        name: state.user.accountInfo.account.name,
        givenName: state.user.accountInfo.account.idToken.given_name,
        familyName: state.user.accountInfo.account.idToken.family_name,
        isGlobalAdmin: state.user.accountInfo.account.idToken.extension_isGlobalAdmin,
        struttureOwned: state.user.accountInfo.account.idToken.extension_struttureOwned?.split(","),
        dataConfermaEmail: state.user.accountInfo.account.idToken.extension_emailConfirmationDate
    };
}

export const UserSelectors = {
    getAccessToken: (state) => state.user.currentUser?.accessToken,
    getIdToken: (state) => state.user.currentUser?.idToken,
    getStruttureOwned: (state) => state.user.currentUser?.struttureOwned ?? [],
    getIdStruttureOwned: (state) => state.user.currentUser?.idStruttureOwned ?? [],
    getStruttureSeguite: (state) => state.user.currentUser?.struttureSeguite ?? [],
    getIdStrutturaCorrente: (state) => state.user?.idStrutturaAttiva,
    getAppuntamenti: (state) => state.user?.currentUser?.appuntamenti,
    getUserInfo: (state) => state.user?.currentUser
}