import { CircularProgress, Container, Paper, StepLabel, Typography } from '@material-ui/core';
import Step from '@material-ui/core/Step';
import Stepper from '@material-ui/core/Stepper';
import { makeStyles } from '@material-ui/core/styles';
import log from 'loglevel';
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router';
import { UserSelectors } from '../../store/selectors/user.selectors';
import R2DHeader from '../commons/R2DHeader';
import RegisterStrutturaStep1 from './RegisterStrutturaStep1';
import RegisterStrutturaStep2 from './RegisterStrutturaStep2';
import RegisterStrutturaStep3 from './RegisterStrutturaStep3';


const _logger = log.getLogger('RegistrazioneStruttura');

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    rootPaper: {
        padding: 30
    },
    title: {
        textAlign: "center",
        fontSize: '1.5rem',
        fontWeight: 500
    },
    backButton: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));


export default (props) => {
    const classes = useStyles();
    const history = useHistory();

    const idStruttureGestite = useSelector(UserSelectors.getIdStruttureOwned);
    const struttureGestite = useSelector(UserSelectors.getStruttureOwned);
    const [currentStep, setCurrentStep] = React.useState(0);
    const [datiStruttura, setDatiStruttura] = React.useState({});
    const titles = ['Benvenuto! Completa la tua registrazione in pochi semplice passi',
        'Gli ultimi dati ed abbiamo finito',
        'Controlla i dati inseriti, clicca SALVA ed inizia subito ad usare Ready2Do!'];

    // React.useEffect(() => {
    //     counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    //   }, [counter]);


    const handleNext = (step, data) => {
        _logger.debug(`Handling step ${step} submit. Data: ${JSON.stringify(data)}`);
        if (step === 0 || step === 1) {
            let newState = { ...datiStruttura, ...data };
            setDatiStruttura(newState);
            setCurrentStep(step + 1);
            _logger.debug(`Current state: ${JSON.stringify(newState)}`);
        } else if (step === 2) {
            //TODO: Gestire la conferma
        }
    }

    const handleBack = (step) => {
        // eslint-disable-next-line default-case
        switch (step) {
            case 0:
                history.push('/');
                break;
            case 1:
                setCurrentStep(0);
                break;
            case 2:
                setCurrentStep(1);
                break;
        }
    }

    const renderCurrentStep = () => {
        // eslint-disable-next-line default-case
        switch (currentStep) {
            case 0:
                return (<RegisterStrutturaStep1 onDataSubmittedHandler={handleNext} onBack={handleBack} datiStruttura={datiStruttura}/>);
            case 1:
                return (<RegisterStrutturaStep2 onDataSubmittedHandler={handleNext} onBack={handleBack} datiStruttura={datiStruttura}/>);
            case 2:
                return (<RegisterStrutturaStep3 onDataSubmittedHandler={handleNext} onBack={handleBack} datiStruttura={datiStruttura}/>);
        }
    }

    const renderRegistrationPage = () => {
        return (
            <Container width="900">
                <R2DHeader urlStruttura={props.urlStruttura}></R2DHeader>
                <Paper className={classes.rootPaper}>
                    <Typography className={classes.title}>{titles[currentStep]}</Typography>
                    <Stepper activeStep={currentStep} alternativeLabel>
                        <Step key={0}>
                            <StepLabel>Dati identificativi della Struttura</StepLabel>
                        </Step>
                        <Step key={1}>
                            <StepLabel>Recapiti della Struttura</StepLabel>
                        </Step>
                        <Step key={2}>
                            <StepLabel>Riepilogo e conferma</StepLabel>
                        </Step>
                    </Stepper>
                    {renderCurrentStep()}
                </Paper>
            </Container>
        )
    }

    const renderRedirectToStruttura = () => {
        return (

            Array.isArray(struttureGestite) && struttureGestite.length > 0 ?
                <Redirect to={`/${struttureGestite[0].urlRoute}`} push={false} /> :
                <CircularProgress />
        )
    }

    return (
        (Array.isArray(idStruttureGestite) && idStruttureGestite.length > 0) ? renderRedirectToStruttura() : renderRegistrationPage()
    )

}
