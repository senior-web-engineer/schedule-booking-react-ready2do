/*
Homepage di uno specifico cliente
*/
import React from 'react'
import {useSelector} from 'react-redux'
import {Redirect} from 'react-router-dom'
import * as log from 'loglevel';
import StrutturaProvider from '../struttura/StrutturaProvider'
import StrutturaLayout from './StrutturaLayout';
import StrutturaEdit from '../struttura/StrutturaEditDati';
import StrutturaEditImages from '../struttura/StrutturaEditImages';
import StrutturaEditCalendari from '../struttura/StrutturaEditCalendari';
import StrutturaHome from '../struttura/StrutturaHome';
import {StruttureSelectors} from '../../store/selectors/strutture.selectors'



export default function StrutturaPage(props){
    const _logger = log.getLogger('StrutturaPage');
    _logger.debug(`StrutturaPage - PROPS: ${JSON.stringify(props)}`);
    const nomeStruttura = props.match.params.nomeStruttura;
    const pageType = (props.match.params.pageType || 'home');
     const anagraficaStruttura = useSelector((state)=> {return state.struttura.anagrafica });
    const idStruttura = useSelector(StruttureSelectors.getIdStrutturaCorrente)

    _logger.debug(`StrutturaPage - ${JSON.stringify(anagraficaStruttura)}`);

    function renderPage(){
        let result = null;
        switch(pageType){
            case 'home':
                result = (<StrutturaHome anagraficaStruttura={anagraficaStruttura}></StrutturaHome>);
                break;
            case 'edit':
                result = (<StrutturaEdit anagraficaStruttura={anagraficaStruttura}></StrutturaEdit>);
                break;
            case 'images':
                result = ( <StrutturaEditImages idStruttura={idStruttura}></StrutturaEditImages>);
                break;
            case 'calendari':
                result = (<StrutturaEditCalendari idStruttura={idStruttura} urlRoute={anagraficaStruttura.urlRoute}></StrutturaEditCalendari>)
                break;
            default:
                result = (<Redirect to="/"></Redirect>)
        }
        _logger.debug(`StrutturaPage.renderPage -> nomeStruttura: ${nomeStruttura}, pageType: ${pageType}`);
        return result;
    }


    _logger.debug(`anagraficaStruttura: ${JSON.stringify(anagraficaStruttura)}`);
    return(
        <StrutturaLayout urlStruttura={nomeStruttura}>
            <StrutturaProvider nomeStruttura={nomeStruttura}>
                {renderPage()}
                    {/* <R2DClienteEditItem title="Nome" tooltip="Nome della struttura" propName="nome" 
                                        propValue={anagraficaStruttura.nome}></R2DClienteEditItem>
                    <R2DClienteEditItem title="Descrizione" tooltip="Descrizione della struttura" propName="descrizione"
                                        propValue={anagraficaStruttura.descrizione}></R2DClienteEditItem>
                    <R2DClienteEditItem title="Identificativo Web" tooltip="Identificativo Web della struttura" propName="urlRoute"
                                        propValue={anagraficaStruttura.urlRoute}></R2DClienteEditItem>
                    <R2DClienteEditItem title="Telefono" tooltip="Numero di telefono della struttura" propName="numTelefono"
                                        propValue={anagraficaStruttura.numTelefono}></R2DClienteEditItem>
                    <R2DClienteEditItem title="Ragione Sociale" tooltip="Numero di telefono della struttura" propName="ragSociale"
                                        propValue={anagraficaStruttura.nome}></R2DClienteEditItem>  */}
            </StrutturaProvider>
        </StrutturaLayout>
        )
}