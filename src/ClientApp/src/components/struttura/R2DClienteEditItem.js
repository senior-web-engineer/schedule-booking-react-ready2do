import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'
import clsx from 'clsx';
import PropTypes from 'prop-types';
import * as log from 'loglevel';
import { Typography, Paper, Button, Box, Tooltip, Input } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import InfoIcon from '@material-ui/icons/Info';
import { StruttureActionsCreator } from '../../store/actions/strutture.actions'

///debug only
//import { useTheme } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(1),
        margin: theme.spacing(1, 0, 0, 0),
    },
    header: {

        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerButtonContainer: {
        flexGrow: 0,
        // paddingLeft: '5px',
        // paddingTop: '5px',
    },
    headerButton: {
        height: '24px',
        width: '70px',
    },
    headerButtonSizeSmall: {
        padding: '3px 6px',
        fontSize: theme.typography.pxToRem(11),
        lineHeight: theme.typography.pxToRem(11),
    },
    headerButtonSave: {
        color: '#E31F4F',
    },
    headerTitle: {
        flexGrow: 1,
        justifyContent: 'center',
        textAlign: 'center',
    },
    headerInfo: {
        width: '30px',
        flexGrow: 0,
    },
    contentBox: {
        marginTop: '10px',
    },
    inputField: {
        width: '100%'
    }
}));

const R2DClienteEditItem = (props) => {
    //STATO
    const [mode, setMode] = useState(props.mode || 'view'); //Per default è in VIEW MODE
    const [multiline] = useState(props.multiline);
    const [lineNumbers] = useState(props.lineNumbers);
    const [propName, setPropName] = useState(props.propName || 'UNKNOWN');
    const [valore, setValore] = useState(props.propValue || '');

    const styles = useStyles();
    const dispatch = useDispatch();
    //const theme = useTheme();

    useEffect(() => {
        log.debug(`R2DClienteEditItem->useEffect - Props: ${JSON.stringify(props)}`);
        setValore(props.propValue);
        setPropName(props.propName);
    }, [props]);

    const isInEdit = () => {
        return (mode === 'edit')
    }

    const handleTextChanged = (e) => {
        setValore(e.target.value);
    }

    const handleButtonClick = (e) => {
        if (isInEdit()) {
            //Dispatch del nuovo valore allo store
            const action = StruttureActionsCreator.updateStrutturaProp(propName, valore)
            log.debug(`R2DClienteEditItem->Salvataggio prop: ${propName} - Dispatching action: ${JSON.stringify(action)}`);
            dispatch(action);
            setMode("view");
        } else {
            setMode("edit");
        }
    }

    function renderEditMode() {
        return (
            <Input type="text" name={props.textProperty}
                value={valore}
                onChange={handleTextChanged}
                className={styles.inputField}
                multiline={multiline}
                rows={lineNumbers}
            ></Input>);
    }

    return (
        <Paper>
            <Box className={styles.root}>
                <Box className={styles.header}>
                    <Box className={styles.headerButtonContainer}>
                        <Button variant="contained" size="small"
                            classes={{ sizeSmall: styles.headerButtonSizeSmall }}
                            className={clsx(styles.headerButton, isInEdit() && styles.headerButtonSave)}
                            onClick={handleButtonClick}>
                            {isInEdit() ? 'Salva' : 'Modifica'}
                        </Button>
                    </Box>
                    <Box className={styles.headerTitle}>
                        <Typography variant="h6">{props.title}</Typography>
                    </Box>
                    <Box className={styles.headerInfo}>
                        <Tooltip title={props.tooltip}>
                            <InfoIcon ></InfoIcon>
                        </Tooltip>
                    </Box>
                </Box>
                <Box className={styles.contentBox}>
                    {isInEdit()
                        ? renderEditMode()
                        : <Typography variant="body1">{valore}</Typography>
                    }
                </Box>
            </Box>
        </Paper>
    );
}

R2DClienteEditItem.propTypes = {
    mode: PropTypes.oneOf(['view', 'edit']),
    lineNumbers: PropTypes.number,
    multiline: PropTypes.bool
}

R2DClienteEditItem.defaultProps = {
    mode: 'view',
    multiline: false,
    lineNumbers: 5
}


export default R2DClienteEditItem;