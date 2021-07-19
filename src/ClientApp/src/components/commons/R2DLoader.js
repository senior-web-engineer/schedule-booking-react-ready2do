import React from 'react'
import Loader from 'react-loader-spinner';
import { Box, makeStyles, Modal } from '@material-ui/core';

const useStyles = makeStyles({
    boxLoader: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
    }
});


export default (props) => {
    const color = props.color ?? "#E31F4F";
    const height = props.height ?? 200;
    const width = props.width ?? 200;
    const fullPage = props.fullPage ?? false;
    const visible = props.visible ?? true;
    const classes = useStyles();


    function fullPageLoader() {
        return (
            <Modal open={visible} style={{ position: "relative" }}>
                {componentLoader()}
            </Modal>
        )
    }

    function componentLoader() {
        return (
            <Box className={classes.boxLoader}>
                <Loader type="Watch" color={color} height={height} width={width} ></Loader>
            </Box>
        )
    }

    return (
        fullPage ? fullPageLoader() : componentLoader()
    )


}