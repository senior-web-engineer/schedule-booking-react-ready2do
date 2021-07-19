import log from 'loglevel';
import React, { Fragment } from 'react'
import { Formik, ErrorMessage, Form } from 'formik'
import { UsersAPI } from '../../api/users.api'
import { Grid, Button, makeStyles, TextField, Typography, Box, Paper } from '@material-ui/core';
import R2DLoader from '../commons/R2DLoader';

const _logger = log.getLogger('UtenteProfiloEdit');

const useStyles = makeStyles(theme => ({
    root: {
        minHeight: '380px',
        position: "relative",
        marginBottom: "20px"
    },
    form: {
        padding: '20px'
    },
    btnSalva: {
        backgroundColor: "#E31F4F",
        color: "white",
        margin: 'auto',
    },
    errorMessage: {
        color: "red",
        fontSize: "0.7rem"
    }
}));

export default (props) => {
    const classes = useStyles();
    const [viewMode, setViewMode] = React.useState('View');
    const [isLoading, setIsLoading] = React.useState(true);
    const [profilo, setProfilo] = React.useState(null);


    //Recuperiamo tutti i dati necessari per la pagina (Profilo + Clienti + Abbonamenti)
    React.useEffect(() => {
        //const fetchOperations = [];
        async function fetchProfiloUtente() {
            const data = await UsersAPI.GetCurrentUserProfileAsync()
            _logger.debug(`UtenteProfiloEdit->fetchProfiloUtente() - data: ${JSON.stringify(data)}`);
            setProfilo(data);
            setIsLoading(false);
        }
        // fetchOperations.push(fetchProfiloUtente());
        // fetchOperations.push(fetchClientiFollowed());
        // fetchOperations.push(fetchAbbonamenti());
        // Promise.all(fetchOperations).then(setIsLoading(false));
        fetchProfiloUtente();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const isFetchingInProgress = () => {
        return isLoading;
    }

    const isViewMode = () => {
        const result = viewMode === "View";
        return result;
    }

    function renderForm() {

        const handleFormSubmmit = async (values, actions) => {
            _logger.debug(`UtenteProfiloEdit->FormSubmit() - values: ${JSON.stringify(values)}`);
            await UsersAPI.SaveUserProfiloAsync(values);
            actions.setSubmitting(false); //NOTA: essendo async non è tecnicamente necessaria questa chiamata, la fa Formik implicitamente
        }

        const handleFormReset = async (values, actions) => {
            //Ripristiniamo i valori iniziali, eliminando le modifiche
            actions.resetForm();
            //Switchiamo in View Mode
            setViewMode('View');
        }

        const formValidateAsync = async (values) => {
            const errors = {}
            if (!values.nome) {
                errors.nome = "E' necessario specificare il nome";
            }
            if (!values.cognome) {
                errors.cognome = "E' necessario specificare il cognome";
            }
            if (!values.displayName) {
                errors.displayName = "E' necessario specificare il Nickname";
            }
            if (!values.cognome) {
                errors.cognome = "E' necessario specificare il cognome";
            }
            _logger.debug(`UtenteProfiloEdit->formValidateAsync() - errors: ${JSON.stringify(errors)}`);
            return errors;
        }


        return (
            <Formik
                initialValues={profilo}
                enableReinitialize={false}
                onSubmit={handleFormSubmmit}
                onReset={handleFormReset}
                validate={formValidateAsync}
            >
                {
                    (props, form) => (
                        <Form onSubmit={props.handleSubmit} autoComplete="off" className={classes.form}>
                            <Grid container>
                                <Grid item xs={4}>
                                    <TextField name='nome'
                                        label='Nome'
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.nome}
                                        disabled={isViewMode()}
                                        fullWidth
                                        margin='normal'
                                    />
                                    <ErrorMessage className={classes.errorMessage} component="span" name="nome" />
                                </Grid>
                                <Grid item xs={8} />
                                <Grid item xs={4}>
                                    <TextField name='cognome'
                                        label='Cognome'
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.cognome}
                                        disabled={isViewMode()}
                                        fullWidth
                                        margin='normal'
                                    />
                                    <ErrorMessage className={classes.errorMessage} component="span" name="cognome" />
                                </Grid>
                                <Grid item xs={8} />
                                <Grid item xs={4}>
                                    <TextField name='displayName'
                                        label='Nickname'
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.displayName}
                                        disabled={isViewMode()}
                                        fullWidth
                                        margin='normal'
                                    />
                                    <ErrorMessage className={classes.errorMessage} component="span" name="displayName" />
                                </Grid>
                                <Grid item xs={8} />
                                <Grid item xs={4}>
                                    <TextField name='telephoneNumber'
                                        label='Telefono Mobile'
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.telephoneNumber}
                                        disabled={isViewMode()}
                                        fullWidth
                                        margin='normal'
                                    />
                                    <ErrorMessage className={classes.errorMessage} component="span" name="telephoneNumber" />
                                </Grid>
                                <Grid item xs={8} />
                                <Grid item xs={12} style={{ textAlign: "center" }}>
                                    {isViewMode() ?
                                        <Button onClick={() => { setViewMode('Edit') }}>Modifica</Button>
                                        :
                                        <Fragment>
                                            <Button size="large" variant="contained"
                                                onClick={props.handleReset}
                                                className={classes.btnSalva}>Annulla</Button>
                                            <Button size="large" variant="contained"
                                                type="submit"
                                                className={classes.btnSalva}>Salva</Button>
                                        </Fragment>
                                    }
                                </Grid>
                            </Grid>
                        </Form>
                    )
                }
            </Formik>
        )
    }

    return (
        // isFetchingInProgress() ? <R2DLoader /> : (isViewMode() ? renderViewMode() : renderEditMode())
        <Paper className={classes.root}>
            {isFetchingInProgress() ? <R2DLoader /> : renderForm()}
        </Paper>
    )
}