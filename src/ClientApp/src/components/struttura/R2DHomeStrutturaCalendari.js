import * as log from 'loglevel';
import React, {useEffect} from 'react'
import FullCalendar from '@fullcalendar/react'
import itLocale from '@fullcalendar/core/locales/it'
import dayGridPlugin from '@fullcalendar/timegrid'
import {format as dfnsFormat, isToday as dfnsIsToday} from 'date-fns'

import { Tab, Tabs, Paper, makeStyles, CircularProgress } from '@material-ui/core'

import dfnsITLocale from 'date-fns/locale/it'
import '@fullcalendar/core/main.css'
import '@fullcalendar/timegrid/main.css'
import './StrutturaCalendar.css'
const _logger = log.getLogger("StrutturaCalendar");


export default (props)=>{

    const columnHeaderHtml = (date)=>{
        _logger.debug(`StrutturaCalendar->columnHeaderHtml(${date}) - ${typeof date}- ${date instanceof Date}`);
        var result = "<div class='rd2-cal-header-dayname'>" + dfnsFormat(date, "eee", {locale: dfnsITLocale}).toUpperCase() + "</div><div class='rd2-cal-header-daynum"
        //Per il giorno corrente applichiamo una classe speciale
        if (dfnsIsToday(date)) {
            result += " rd2-cal-header-daynum-current"
        }
        result += "'>" + dfnsFormat(date,'d') + "</div>";
        return {html: result};
    }
    return(
        <FullCalendar 
            initialView="timeGridWeek" 
            plugins={[dayGridPlugin]} 
            headerToolbar={{
                left: 'today',
                center: 'title',
                right: 'prev,next'}}
            locale={itLocale}
            weekends={true}
            slotDuration="01:00:00"
            slotLabelInterval="01:00"
            //timeGridEventMinHeight="30" //removed in v5
            nowIndicator={false}
            allDaySlot={false}
            
            contentHeight="auto"
            slotMinTime="08:00" //TODO: Leggere da impostazioni struttura
            slotMaxTime="18:00" //TODO: Leggere da impostazioni struttura
            //validRange={{start:"08:00", end:"17:00"}}
                        
            dayHeaderContent={(args)=> columnHeaderHtml(args?.date)}
        >            
        </FullCalendar>
    );

}