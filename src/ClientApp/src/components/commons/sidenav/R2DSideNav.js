import React, { Fragment } from 'react'
import { List, ListItem, ListItemIcon, ListItemText, Fab } from "@material-ui/core";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom'
import HomeIcon from '@material-ui/icons/Home';
import AssignmentIcon from '@material-ui/icons/Assignment';
import DateRangeIcon from '@material-ui/icons/DateRange';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';
import BookIcon from '@material-ui/icons/Book';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import PeopleIcon from '@material-ui/icons/People';
import ImageIcon from '@material-ui/icons/Image'
import SideNavHeader from './R2DSideNavHeader';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import MenuIcon from '@material-ui/icons/Menu';
import AzureAD from 'react-aad-msal';
import {authProvider} from '../../../authProvider'
import {getStore} from '../../../store/reduxStore'


const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    width: drawerWidth,
  },
  drawer: {
    [theme.breakpoints.up('lg')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  link: {
    textDecoration: 'none',
    color: 'unset',
  },
  navToggleFAB: {
    position: "fixed",
    marginLeft: "20px",
    marginTop: "20px",
    backgroundColor: "#000000",
    zIndex: theme.zIndex.drawer
  }
}));

export default (props) => {
  const classes = useStyles();
  const theme = useTheme();
  //TODO: Gestire il cambio di struttura corrente passando una callback al componente header
  const urlStruttura = props.urlStruttura;

  const [drawerIsOpen, setDrawerIsOpen] = React.useState(props.drawerIsOpen ?? false);


  const handleDrawerToggle = (stato) => event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerIsOpen(stato);
  };

  const drawerContent = (
    <div>
      <SideNavHeader strutturaCorrente={urlStruttura}></SideNavHeader>
      <List>
        {
          [
            { pageType: '', text: 'Home', icon: (<HomeIcon />) },
            { pageType: 'edit', text: 'Dati Struttura', icon: (<AssignmentIcon />) },
            { pageType: 'images', text: 'Immagini', icon: (<ImageIcon />) },
            { pageType: 'calendari', text: 'Calendari', icon: (<DateRangeIcon />) },
            { pageType: 'locations', text: 'Sale e Trainer', icon: (<FitnessCenterIcon />) },
            { pageType: 'lezioni', text: 'Tipologie Lezioni', icon: (<BookIcon />) },
            { pageType: 'abbonamenti', text: 'Tipologie Abbonamenti', icon: (<CreditCardIcon />) },
            { pageType: 'utenti', text: 'Utenti', icon: (<PeopleIcon />) },
          ].map((item, idx) => (
            <ListItem button key={item.pageType}>
              <ListItemIcon>
                {/* <HomeIcon/> */}
                {item.icon}
              </ListItemIcon>
              <NavLink onClick={handleDrawerToggle(false)} to={{ pathname: `/${urlStruttura}/${item.pageType}` }} className={classes.link}>
                <ListItemText primary={item.text} />
              </NavLink>
            </ListItem>
          ))
        }
      </List>
    </div>
  );

  return (
    <AzureAD reduxStore={getStore()} provider={authProvider}>
      <Fragment>
        <Fab size="medium" variant="round"
          className={classes.navToggleFAB}
          onClick={handleDrawerToggle(true)}>
          <MenuIcon style={{ color: "white" }} />
        </Fab>
        <SwipeableDrawer
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={drawerIsOpen}
          onClose={handleDrawerToggle(false)}
          onOpen={handleDrawerToggle(true)}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawerContent}
        </SwipeableDrawer>
      </Fragment >
    </AzureAD>
  );
}