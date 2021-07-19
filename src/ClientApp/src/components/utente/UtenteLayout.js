import React, { Fragment } from 'react';
import Container from '@material-ui/core/Container';
import R2DHeader from '../commons/R2DHeader'
import R2DSideNav from '../commons/sidenav/R2DSideNav';
import { useSelector } from 'react-redux';
import {UserSelectors} from '../../store/selectors/user.selectors'


export default props => {
    const struttureOwned = useSelector(UserSelectors.getStruttureOwned);

    return (
        <Fragment>
            {struttureOwned && struttureOwned.length > 0 ? <R2DSideNav urlStruttura={props.urlStruttura} /> : ''}            
            <Container width="900" >
                <R2DHeader urlStruttura={props.urlStruttura}></R2DHeader>
                {props.children}
            </Container>
        </Fragment>
    );
}
