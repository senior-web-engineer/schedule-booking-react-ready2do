/* eslint-disable import/no-anonymous-default-export */
import * as log from 'loglevel';
import React, { useEffect, useState, Fragment } from 'react'
import FullCalendar from '@fullcalendar/react'
import itLocale from '@fullcalendar/core/locales/it'
import dayGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction';
import {
    format as dfnsFormat, isToday as dfnsIsToday,
    startOfWeek as dfnsStartOfWeek, endOfWeek as dfnsEndOfWeek,
    isSameDay as dfnsIsSameDay, isFuture as dfnsIsFuture,
    addMinutes as dfnsAddMinutes, parseISO as dfnsParseISO
} from 'date-fns'
import dfnsITLocale from 'date-fns/locale/it'
// import '@fullcalendar/core/main.css'
// import '@fullcalendar/timegrid/main.css'
import './StrutturaCalendar.css'
import { useHistory } from "react-router-dom";
import { StruttureEventiAPI } from '../../api/strutture.eventi.api';

const _logger = log.getLogger("StrutturaCalendarView");


export default (props) => {
    const idStruttura = props.idStruttura ?? -1;
    const idLocation = props.idLocation ?? -1;
    const urlRoute = props.urlRoute;
    const history = useHistory();
    const [periodo, setPeriodo] = useState(props.periodo ??
    {
        startDate: dfnsStartOfWeek(new Date(), { weekStartsOn: 1 }),
        endDate: dfnsEndOfWeek(new Date(), { weekStartsOn: 1 })
    });

    const [eventi, setEventi] = useState([]);
    const DEFAULT_EVENT_COLOR = '#'

    useEffect(() => {
        _logger.debug(`StrutturaCalendarView->useEffect(idStruttura: ${idStruttura}, idLocation: ${idLocation}), periodo: ${JSON.stringify(periodo)}`);
        async function fetchData(periodo) {
            _logger.debug("StrutturaCalendarView->fetchData()");
            const data = await StruttureEventiAPI.FetchEventiAsync(idStruttura, idLocation, periodo.startDate, periodo.endDate);
            //Convertiamo gli Schedules in oggetti gestibili dal calendario
            if (data && data.length > 0) {
                let ev = data.map((value, index) => {
                    const r = {
                        id: value.id,
                        start: value.dataOraInizio,
                        end: dfnsAddMinutes(dfnsParseISO(value.dataOraInizio), value.durata),
                        title: value.title,
                        allDay: false
                    }
                    _logger.debug(`Evento [${value.id}]: ${JSON.stringify(r)} \r\n value:${JSON.stringify(value)}`);
                    return r;
                });
                setEventi(ev);
            } else {
                setEventi([])
            };
        }
        if (idStruttura && idStruttura > 0 && idLocation && idLocation > 0) {
            fetchData(periodo);
        }
    }, [idStruttura, idLocation, periodo]);

    const columnHeaderHtml = (date) => {
        //_logger.debug(`StrutturaCalendarAdmin->columnHeaderHtml(${date}) - ${typeof date}- ${date instanceof Date}`);
        var result = "<div class='rd2-cal-header-dayname'>" + dfnsFormat(date, "eee", { locale: dfnsITLocale }).toUpperCase() + "</div><div class='rd2-cal-header-daynum"
        //Per il giorno corrente applichiamo una classe speciale
        if (dfnsIsToday(date)) {
            result += " rd2-cal-header-daynum-current"
        }
        result += "'>" + dfnsFormat(date, 'd') + "</div>";
        return {html: result}  ;
    }

    const handleDataChange = (info) => {
        _logger.debug(`StrutturaCalendarView->handleDataChange(${info.view.currentStart} - ${info.view.currentEnd})`);
        if (!info || !info.view) return;
        const newPeriodo = {
            startDate: info.view.currentStart,
            endDate: info.view.currentEnd
        }
        if (!dfnsIsSameDay(periodo.startDate, newPeriodo.startDate)) {
            _logger.debug(`StrutturaCalendarView->handleDataChange->setPeriodo(${JSON.stringify(newPeriodo)})`);
            setPeriodo(newPeriodo);
        }
    }

    const handleDateClick = (dateClickInfo) => {
        _logger.debug(`StrutturaCalendarView->handleDateClick()`);
        const url = `/${urlRoute}/eventi/new?date=${dateClickInfo.dateStr}&allDay=${dateClickInfo.allDay}&lid=${idLocation}`;
        _logger.debug(`StrutturaCalendarView->handleDateClick() -> Redirect to: ${url}`);
        if (dfnsIsFuture(dateClickInfo.date)) {
            //Redirect alla pagina di nuovo evento
            history.push(url);
        }
    }

    const handleEventClick = (eventClickInfo) => {
        _logger.debug(`StrutturaCalendarView->handleEventClick()`);
        const url = `/${urlRoute}/eventi/${eventClickInfo.event.id}`;
        _logger.debug(`StrutturaCalendarView->handleDateClick() -> Redirect to: ${url}`);
        //Redirect alla pagina di edit evento
        history.push(url);
    }

    return (
        <Fragment>
            <FullCalendar
                initialView="timeGridWeek"
                initialDate={periodo.startDate}
                plugins={[dayGridPlugin, interactionPlugin]}
                // headerToolbar={{
                //     left: 'today',
                //     center: 'title',
                //     right: 'prev,next'
                // }}
                headerToolbar={false}
                locale={itLocale}
                weekends={true}
                slotDuration="01:00:00"
                slotLabelInterval="01:00"
                //timeGridEventMinHeight={25} //removed in v5
                nowIndicator={false}
                allDaySlot={false}

                contentHeight="auto"
                slotMinTime="00:00" //TODO: Leggere da impostazioni struttura
                slotMaxTime="24:00" //TODO: Leggere da impostazioni struttura
                //Determina le data "valide", quelle fuori dal range sono in grigio
                //Non è utilizzabile in questo contesto perché devono essere visibili anche l edate passate
                // ==> gestiamo a livello di click la disabilitazione di creazione di eventi passati
                //validRange={{start:new Date()}}

                //columnHeaderHtml={columnHeaderHtml}
                dayHeaderContent={(args)=> columnHeaderHtml(args?.date)}
                datesSet={handleDataChange}

                dateClick={handleDateClick}
                eventClick={handleEventClick}

                events={eventi}
            >
            </FullCalendar>
        </Fragment>
    );

}