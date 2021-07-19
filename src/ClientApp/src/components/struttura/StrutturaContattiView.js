import React from 'react'
import { Typography, Box } from '@material-ui/core';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import PhoneIcon from '@material-ui/icons/Phone';

const StrutturaContattiView = (props)=>{
    const anagraficaStruttura = props.struttura;
    const alignSelf = props.alignSelf ?? "flex-end";
    const flex = props.flex ?? 2;

    return(
        <Box alignSelf={alignSelf} >
            <Typography variant="h5" gutterBottom>Contatti</Typography>
            <Typography style={{fontWeight:"bold"}} gutterBottom>{anagraficaStruttura?.ragioneSociale}</Typography>
            <Typography gutterBottom>{anagraficaStruttura?.indirizzo}</Typography>
            {anagraficaStruttura?.email ? <Typography gutterBottom><AlternateEmailIcon style={{fontSize:"1rem"}}/> {anagraficaStruttura?.email}</Typography> : '' }
            {anagraficaStruttura?.numTelefono ? <Typography gutterBottom><PhoneIcon style={{fontSize:"1rem"}}/> {anagraficaStruttura?.numTelefono}</Typography> : ''}            
        </Box>
    )
}

export default StrutturaContattiView;