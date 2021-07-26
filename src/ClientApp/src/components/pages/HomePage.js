import React from "react";
import Container from "@material-ui/core/Container";
import AppBar from "@material-ui/core/AppBar";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Typography, Box, Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
    display: "block",
    padding: "10px",
  },
  // menuButton: {
  //   marginRight: theme.spacing(2),
  // },
  // toolbar: {
  //   minHeight: 128,
  //   alignItems: 'flex-start',
  //   paddingTop: theme.spacing(1),
  //   paddingBottom: theme.spacing(2),
  // },
  // title: {
  //   flexGrow: 1,
  //   alignSelf: 'flex-end',
  // },
  logo: {
    width: "80%",
    margin: "70px 0",
  },
  typo: {
    margin: "30px 0",
  },
  typobold: {
    fontWeight: "500",
  },
  form: {
    display: "inline-grid",
    width: "70%",
    marginBottom: "20px",
  },
  button: {
    color: "white",
    backgroundColor: "#8ac543",
  },
}));

export default (props) => {
  const classes = useStyles();

  const handleFormSubmmit = async (event) => {
    event.preventDefault();
    // console.log(event.target[0].value);
  };

  return (
    <Container className={classes.root}>
      <Box justifyContent="space-between">
        <img className={classes.logo} src="/images/logo.png" alt="logo" />
      </Box>
      <Box>
        <Typography className={classes.typobold} variant="h1" gutterBottom>
          Benvenuto!
        </Typography>
        <Typography className={classes.typo} variant="h3" gutterBottom>
          Ready2Do è il nuovissimo sistema di prenotazione online per la tua
          struttura sportiva con 3 punti di forza principali:
        </Typography>
        <Typography className={classes.typo} variant="h3" gutterBottom>
          1 - Puoi utilizzarlo in maniera gratuita senza limiti di tempo o
          iscritti.
        </Typography>
        <Typography className={classes.typo} variant="h3" gutterBottom>
          2- Il suo funzionamento è tutto Web Based, non dovrai installare alcun
          complicato Softrawe, funziona tutto da Browser
        </Typography>
        <Typography className={classes.typo} variant="h3" gutterBottom>
          3- È l'unico sistema di prenotazione che aumenta la visibilità della
          tua attività mentre ti fa risparmiare tempo e personale.
        </Typography>
        <Typography className={classes.typobold} variant="h3" gutterBottom>
          Inserisci la tua Email per essere avvisato appena sarà possibile
          iscriversi!
        </Typography>
        <form
          className={classes.form}
          onSubmit={handleFormSubmmit}
          noValidate
          autoComplete="off"
        >
          <TextField
            className={classes.typo}
            variant="outlined"
            label="Email"
          ></TextField>
          <Button
            className={classes.button}
            size="large"
            variant="contained"
            type="submit"
          >
            Accedi
          </Button>
        </form>
      </Box>
    </Container>
  );
};
//export default connect()(HomePage);
