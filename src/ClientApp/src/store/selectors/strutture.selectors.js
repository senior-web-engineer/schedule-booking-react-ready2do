//import { createSelector } from 'reselect'


/*INPUT SELECTORS*/
// const getAnagrafica = (state)=>{
//     return {
//         id: state.anagrafica.id,
//         nome: state.anagrafica.nome,
//         ragSociale: state.anagrafica.ragSociale,
//         email: state.anagrafica.email,
//         numTelefono: state.anagrafica.numTelefono,
//         descrizione: state.anagrafica.descrizione,
//         tipologia: state.anagrafica.tipologia,
//         citta: state.anagrafica.citta,
//         cap: state.anagrafica.cap,
//         country: state.anagrafica.country,
//         latitudine: state.anagrafica.latitudine,
//         longitudine: state.anagrafica.longitudine,
//         urlRoute: state.anagrafica.urlRoute,
//     }
// }

const getIdStrutturaCorrente = (state)=>{
    const anagrafica = state.struttura.anagrafica;
    if(anagrafica) {return anagrafica.id;}
    else{
        return -1;
    }
}
/* EXPORTED SELECTORS */
export const StruttureSelectors = {
    getIdStrutturaCorrente: getIdStrutturaCorrente ,
    getNomeStrutturaCorrente: state => state.struttura.nomeStruttura,
    getUrlStrutturaCorrente: state=>state.struttura.urlStruttura,    
    getStrutturaCorrente: state => state.struttura,
    getAnagrafica: state => state.struttura.anagrafica,
    getOrarioApertura: state => state.struttura.orarioApertura,
    getImages: state => state.struttura.images,
    getImagesGallery: state => state.struttura?.images?.filter((elem)=>{return elem.idTipoImmagine=== 3}) ?? [],
}
