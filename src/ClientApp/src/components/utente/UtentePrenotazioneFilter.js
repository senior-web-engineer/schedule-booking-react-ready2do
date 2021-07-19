import React, { useState } from 'react'
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import FilterListIcon from '@material-ui/icons/FilterList';
import { Typography, InputAdornment, Button, Box, makeStyles, Grid } from '@material-ui/core';
import { KeyboardDatePicker, DatePicker } from '@material-ui/pickers';
import { ParsableDate } from '@material-ui/pickers/constants/prop-types';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';

const useStyle = makeStyles(theme => ({
    root: {

    },
    filterGrid:{
        
    },
    dateFilter: {
        maxWidth: '150px',
        marginRight: '20px',
        '& label': {
            fontSize: '0.8rem'
        },
        '& input': {
            fontSize: '0.9rem'
        }
    },
    textFilter: {
        fontSize: '0.9rem',
        minWidth: '300px',
        marginRight: '20px',
        '& label': {
            fontSize: '0.8rem'
        },
        '& input': {
            fontSize: '0.9rem'
        }

    },
    searchButton: {
        marginTop: '15px',
    }
}));

export const UtentePrenotazioniFilter = (props) => {
    const classes = useStyle();
    const [from, setFrom] = useState(props?.filters?.from);
    const [to, setTo] = useState(props?.filters?.to);
    const [text, setText] = useState(props?.filters?.text ?? '');

    const handleDataChange = (filter, newDate) => {
        // eslint-disable-next-line default-case
        switch (filter?.trim()?.toLowerCase()) {
            case 'from':
                setFrom(newDate);
                return;
            case 'to':
                setTo(newDate);
                return;
        }
    }

    const handleTextFilterChange = (event) => {
        setText(event.target.value);
    }

    const handleSearchClick = ()=>{
        if(props.onFilterChange && props.onFilterChange instanceof Function){
            props.onFilterChange({
                from,
                to,
                text
            });
        }
    }

    return (
        // <Accordion variant="outlined"> 
        //     <AccordionSummary
        //         expandIcon={<FilterListIcon />}
        //         aria-controls="panel1a-content"
        //         id="panel1a-header"
        //     >
        //         <Typography >Filtri</Typography>
        //     </AccordionSummary>
        //     <AccordionDetails>
                <Grid container spacing={0} className={classes.filterGrid}>
                    <Grid item>
                        <KeyboardDatePicker className={classes.dateFilter}
                            label="Eventi dal (dd/mm/yyyy)"
                            value={from}
                            format="dd/MM/yyyy"
                            onChange={(newDate) => { handleDataChange('from', newDate) }}
                        /></Grid>
                    <Grid item>
                        <KeyboardDatePicker className={classes.dateFilter}
                            label="al (dd/mm/yyyy)"
                            format="dd/MM/yyyy"
                            value={to}
                            onChange={(newDate) => { handleDataChange('to', newDate) }}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            className={classes.textFilter}
                            id="input-with-icon-textfield"
                            value={text}
                            label="Testo da ricercare (struttura, lezione o evento)"
                            onChange={handleTextFilterChange}
                        />
                    </Grid>
                    <Grid item>
                        <Button endIcon={<SearchIcon />} size="small" variant="outlined" className={classes.searchButton} onClick={handleSearchClick}> Cerca</Button>
                    </Grid>
                </Grid>

        //     </AccordionDetails>
        // </Accordion>
    )

}