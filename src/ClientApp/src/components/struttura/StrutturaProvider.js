import React, { useState, useEffect, Fragment } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {StruttureActionsCreator} from '../../store/actions/strutture.actions'
import * as log from 'loglevel';

/*
Implementa la logica di caricamento dei dati di una Struttura
*/
export default function  StrutturaProvider(props){
    const _logger = log.getLogger('StrutturaProvider');
    const nomeStruttura = props.nomeStruttura;
    const dispatch = useDispatch();
    const struttura  = useSelector((state) =>{ return state.struttura.struttura});
    
    //Rimappiamo i children aggiungendo il nome della struttura come Props
    const children = React.Children.map(props.children, (child, index) => {
        return React.cloneElement(child, {
            ...props,
            index,
            nomeStruttura: nomeStruttura,
            struttura: struttura
        });
    });

    useEffect(()=>{
        //Carichiamo i dati della struttura se non già presenti nello store 
        if(!struttura || struttura.name !== nomeStruttura){
            _logger.debug(`StrutturaProvider->Dispatch StruttureActionsCreator.fetchStrutturaByName(${nomeStruttura})`);
            dispatch(StruttureActionsCreator.fetchStrutturaByName(nomeStruttura));
        }else{
            _logger.debug(`StrutturaProvider->NO Dispatch StruttureActionsCreator.fetchStrutturaByName(${nomeStruttura}) - struttura alrerady fetched.`);
        }
    },[nomeStruttura]);

    return(
        <Fragment>
            {props.children}
        </Fragment>
    )
    
} 