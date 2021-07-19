import * as log from 'loglevel';
import React /*, { useState }*/ from 'react'
import R2DClienteEditItem from './R2DClienteEditItem'
import OrarioAperturaEdit from './OrarioAperturaEdit';
import IndirizzoEdit from './IndirizzoEdit'

export default (props) =>{
    const anagraficaStruttura = props.anagraficaStruttura;
    //const orarioAperturaStruttura = props.orarioAperturaStruttura;

    return (
        <React.Fragment>
            <R2DClienteEditItem title="Nome" tooltip="Nome della struttura" propName="nome" 
                    propValue={anagraficaStruttura.nome}></R2DClienteEditItem>
            <R2DClienteEditItem title="Descrizione" tooltip="Descrizione della struttura" 
                    propName="descrizione"
                    multiline={true} lineNumbers={5}
                    propValue={anagraficaStruttura.descrizione}></R2DClienteEditItem>
            <R2DClienteEditItem title="Identificativo Web" tooltip="Identificativo Web della struttura" propName="urlRoute"
                    propValue={anagraficaStruttura.urlRoute}></R2DClienteEditItem>
            <R2DClienteEditItem title="Telefono" tooltip="Numero di telefono della struttura" propName="numTelefono"
                    propValue={anagraficaStruttura.numTelefono}></R2DClienteEditItem>
            <R2DClienteEditItem title="Ragione Sociale" tooltip="Numero di telefono della struttura" propName="ragSociale"
                    propValue={anagraficaStruttura.nome}></R2DClienteEditItem> 
            <OrarioAperturaEdit tooltip="Orari di apertura della struttura"></OrarioAperturaEdit>
            <IndirizzoEdit></IndirizzoEdit> 
        </React.Fragment>
    )
}