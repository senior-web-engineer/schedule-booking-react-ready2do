import React, { useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import * as log from 'loglevel';
import R2DClienteEditItem from '../struttura/R2DClienteEditItem'
import StrutturaProvider from '../struttura/StrutturaProvider'
import Layout from '../Layout';

export default function StrutturaEditDati(props){
    const [nomeStruttura] = useState(props.match.params.nomeStruttura)
    const anagraficaStruttura = useSelector((state)=> {return state.struttura.anagrafica });

    log.debug(`anagraficaStruttura: ${JSON.stringify(anagraficaStruttura)}`);
    return(
        <Layout>
            <StrutturaProvider nomeStruttura={nomeStruttura}>
                    <R2DClienteEditItem title="Nome" tooltip="Nome della struttura" propName="nome" 
                                        propValue={anagraficaStruttura.nome}></R2DClienteEditItem>
                    <R2DClienteEditItem title="Descrizione" tooltip="Descrizione della struttura" propName="descrizione"
                                        propValue={anagraficaStruttura.descrizione}></R2DClienteEditItem>
                    <R2DClienteEditItem title="Identificativo Web" tooltip="Identificativo Web della struttura" propName="urlRoute"
                                        propValue={anagraficaStruttura.urlRoute}></R2DClienteEditItem>
                    <R2DClienteEditItem title="Telefono" tooltip="Numero di telefono della struttura" propName="numTelefono"
                                        propValue={anagraficaStruttura.numTelefono}></R2DClienteEditItem>
                    <R2DClienteEditItem title="Ragione Sociale" tooltip="Numero di telefono della struttura" propName="ragSociale"
                                        propValue={anagraficaStruttura.nome}></R2DClienteEditItem> 
            </StrutturaProvider>
        </Layout>
        )
}