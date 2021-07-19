import axios from 'axios';
import config from '../config'
import{fetchStrutturaByName, fetchStrutturaSuccess, fetchStrutturaError } from '../store/actions/strutture.actions'

export const clientiService = {
    getByNameAction: getByName
};

function getByName(name){
    let url = `${config.BaseAPIPath}/clienti/${name}`;
    console.log('Inside getByName.. ')    
    return dispatch => {
        console.log('Inside thunk.. ')    
        dispatch(fetchStrutturaByName(name));

        axios.get(url, getOptions())
                .then((response) => {
                    dispatch(fetchStrutturaSuccess(response.data));})
                .catch((error)=>{
                    dispatch(fetchStrutturaError(error));
                });
    }
}


function getOptions(){
    let options = {}; 
    if(localStorage.getItem('token')){
        options.headers = { 'x-access-token': localStorage.getItem('token') };
    }
    return options;
}