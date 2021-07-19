import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { shallowEqual, useSelector } from 'react-redux'
import { FormControl, Select, Avatar } from '@material-ui/core';
import { UserSelectors } from "../../../store/selectors/user.selectors";
//import { changeStrutturaCorrente} from '../../../store/actions/user.actions'

const useStyles = makeStyles(theme => ({
    root:{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '160px',
        backgroundColor: '#636363',
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    avatar: {
        marginTop:'25px',
        marginLeft:'25px',
        width: theme.spacing(7),
        height: theme.spacing(7),
        color:'black',
        backgroundColor:'#FFFFFF'
    }
  }));

  export default (props) =>  {
    const classes = useStyles();
    const struttureGestite = useSelector(UserSelectors.getStruttureOwned, shallowEqual)
    const idStrutturaCorrente= useSelector(UserSelectors.getIdStrutturaCorrente, shallowEqual)

    return(
        <div className={classes.root}>
            <Avatar className={classes.avatar}>

            </Avatar>
            <FormControl className={classes.formControl}>
                <Select
                    native
                    value={idStrutturaCorrente}
                    //onChange={handleChangeStruttura}
                    name="struttura"
                    className={classes.selectEmpty}>
                    {
                        //TODO: Sostituire l'Id della struttura con il nome quando sarà disponibile
                    struttureGestite ? struttureGestite.map((struttura, index) => <option key={index} value={struttura.id}>{struttura.nome}</option>) 
                        : ""
                    }
                </Select>
            </FormControl>
        </div>
    );
}