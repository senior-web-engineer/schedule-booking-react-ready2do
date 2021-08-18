import * as log from 'loglevel';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { fade, makeStyles } from '@material-ui/core/styles';
import { AppBar, Typography, Badge, Menu, MenuItem, Box, ListItemIcon, Button } from '@material-ui/core';

import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import { UserSelectors } from '../../store/selectors/user.selectors'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import FavoriteIcon from '@material-ui/icons/Favorite';
import WatchLaterIcon from '@material-ui/icons/WatchLater';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AzureAD, { AuthenticationState } from 'react-aad-msal';
import {authProvider} from '../../authProvider'
import {getStore} from '../../store/reduxStore'
import { NavLink } from 'react-router-dom';

const _logger = log.getLogger("R2DHeader");

const drawerWidth = 240;
const headerTextColor = '#89C443';

const useStyles = makeStyles(theme => ({
    appBar: {
        //  paddingTop: '8px',
        marginBottom: '8px',
        height: '140px',
        backgroundColor: 'white',
        boxShadow: 'none'
    },
    logo: {
        width: '306px',
        maxWidth: '55%',
        height: '126px',
        marginTop: '6px',
        marginLeft: '20px'
    },
    iconBox: {
        margin: "0px 10px"
    },
    headerIcon: {
        color: headerTextColor,
    },
    headerMenu:{
        color: headerTextColor,
    },
    headerMenuItem:{
        color: headerTextColor,
    },
    loginBox: {
        marginRight: "5px"
    },
    buttonLogin:{
        backgroundColor: "#89C443",
        color:"white",
        width:"100px"
    }
}));

export default function R2DHeader() {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const currentUser = useSelector(UserSelectors.getUserInfo);
    const isMenuOpen = Boolean(anchorEl);

    function handleProfileMenuOpen(event) {
        setAnchorEl(event.currentTarget);
    }

    function hanldeHeaderMenuClick(e) {
        _logger.debug("R2DHeader->hanldeHeaderMenuClick");
        setAnchorEl(e.currentTarget);
    }

    function handleClose() {
        _logger.debug("R2DHeader->handleClose");
        setAnchorEl(null);
    }

    function renderMenu(fnLogout) {
        return (
            <Menu
                className={classes.headerMenu}
                id='headerUserMenu'
                getContentAnchorEl={null}
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <MenuItem>
                    <ListItemIcon className={classes.headerMenuItem}>
                        <span><AccountBoxIcon /> <NavLink to="/me/profilo">IL MIO PROFILO</NavLink>
                        </span>
                    </ListItemIcon>
                </MenuItem>
                <MenuItem>
                    <ListItemIcon className={classes.headerMenuItem}>
                        <span>
                        <FavoriteIcon /> <NavLink to="/me/abbonamenti">I MIEI ABBONAMENTI</NavLink>
                        </span>
                    </ListItemIcon>
                </MenuItem>
                <MenuItem>
                    <ListItemIcon className={classes.headerMenuItem}>
                        <span>
                        <WatchLaterIcon /> <NavLink to="/me/prenotazioni">LE MIE PRENOTAZIONI</NavLink>
                        </span>
                        </ListItemIcon>
                        </MenuItem>
                <MenuItem>
                    <ListItemIcon className={classes.headerMenuItem}>
                        <span>
                        <NotificationsIcon /> NOTIFICHE
                        </span>
                    </ListItemIcon>
                </MenuItem>
                <MenuItem>
                    <ListItemIcon className={classes.headerMenuItem} onClick={fnLogout}>
                        <span>
                        <ExitToAppIcon />LOGOUT
                        </span>
                    </ListItemIcon>
                </MenuItem>
            </Menu>
        )
    }


    function RenderLoggedUserHeaderMenu(fnLogout) {
        return (           
            <Box display="flex" flexDirection="column" alignItems="center" className={classes.iconBox}
            >
                <AccountCircle className={classes.headerIcon} style={{ fontSize: 56 }} />
                <Typography component="span" style={{ color: headerTextColor, cursor: 'pointer' }} onClick={hanldeHeaderMenuClick}>
                    {currentUser?.name}<ArrowDropDownIcon style={{ color: headerTextColor, verticalAlign: 'bottom' }} />
                </Typography>
                {renderMenu(fnLogout)}
            </Box>
        )
    }

    function RenderAnonymousUserHeaderMenu(fnLogin) {
        return (
            <Box display="flex"  flexDirection="column-reverse" className={classes.loginBox}>
                <Button variant="contained" className={classes.buttonLogin} onClick={fnLogin}>Accedi</Button>
            </Box>
        )
    }

    return (
        <AppBar position="static" className={classes.appBar}>
            <Box display="flex" justifyContent="space-between" >
                <img className={classes.logo} src="/images/logo.png" alt="logo" />
                <Box alignSelf="flex-end">
                <AzureAD provider={authProvider} reduxStore={getStore()}>
                    {
                        ({login,logout, authenticationState, error, accountInfo})=>{
                            switch(authenticationState){
                                case AuthenticationState.Authenticated:{
                                    return RenderLoggedUserHeaderMenu(logout)
                                }
                                default: {
                                    return RenderAnonymousUserHeaderMenu(login)
                                }
                            }
                        }
                    }
                </AzureAD>
                    {/* {currentUser ? RenderLoggedUserHeaderMenu() : RenderAnonymousUserHeaderMenu()} */}
                </Box>
            </Box>
        </AppBar>
    );
}
