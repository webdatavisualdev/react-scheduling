import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";

import firebase from 'firebase'; 
import { useHistory, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { setAppointment, getAppointments } from '../fb-sdk';
import Loader from '../components/Loader';

export interface IEvent {
  id: string,
  title: string,
  start?: string,
  end?: string,
  allDay: boolean,
  date?: string,
  email?: string,
  uid?: string
  otherUser?: string,
  accepted?: boolean,
}

export default function SetAppointment() {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [events, setEvents] = useState<IEvent[]>([]);
  const [event, setEvent] = useState<IEvent>();
  const [loading, setLoading] = useState(false);
  const [appointmentId, setAppointmentId] = useState('');
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (!loading) {
      getAppointments(localStorage.getItem('uid') || '').then((res: any) => {
        if (res.data?.appointments) {
          setEvents(res.data?.appointments.map((ap: IEvent) => { return { ...ap, title: ap.otherUser } }));
        }
      });
    }
  }, [loading]);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const logout = () => {
    firebase.auth().signOut().then(() => {
      localStorage.removeItem('uid');
      history.push('/login');
    })
  }

  const handleSubmit = async () => {
    if (event) {
      setLoading(true);
      const res = await setAppointment({
        ...event, 
        email,
        uid: localStorage.getItem('uid') || ''
      });
      if (res.data?.id) {
        setAppointmentId(res.data.id);
      }
      setEmail('');
      setEvent(undefined);
      setLoading(false);
    }
  }

  const handleDateClick = (date: string) => {
    setAppointmentId('');
    setEvent({
      id: '1', 
      title: 'Appointment',
      start: new Date(date).toISOString(),
      end: new Date(new Date(date).getTime() + 60000 * 30).toISOString(),
      allDay: false,
    });
  }

  const handleResize = (e: any) => {
    const duration = new Date(e.end).getTime() - new Date(e.start).getTime();
    if (event) {
      setEvent({
        ...event,
        end: new Date(new Date(event.start || new Date()).getTime() + duration).toISOString()
      });
    }
  }

  const handleEvent = (e: any) => {
    if (e.id && e.id !== '1' && !events.find(ev => ev.id === e.id)?.accepted) {
      setAppointmentId(e.id);
    } else {
      setAppointmentId('');
    }
  }

  return (
    <>
      <Link to="/invited-appointments">Go to invited appointments</Link>
      <div className="appointment-container">
        <div style={{flex: 1}} className="calendar">
          <FullCalendar
            initialView="timeGridWeek"
            plugins={[ timeGridPlugin, dayGridPlugin, interactionPlugin ]}
            nowIndicator={true}
            allDayText="All Day"
            timeZone='UTC'
            events={[...events, event || {}]}
            scrollTime={'08:00:00'}
            editable={true}
            eventClick={(e) => handleEvent(e.event)}
            eventResize={(e) => handleResize(e.event)}
            dateClick={(e) => handleDateClick(e.dateStr)}
          />
        </div>
        <div className="form appointment-form">
          <button onClick={logout}>Log out</button>
          <p>{event?.start ? new Date(event?.start).toString() : ''}</p>
          <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button onClick={handleSubmit} disabled={!email || !event?.start}>{loading ? <Loader /> : 'Set'}</button>
          {
            appointmentId ? 
            <>
              <p>Send this link to other user to accept your invitation.</p>
              <a style={{wordBreak: 'break-all'}}>{origin}/appointments/{appointmentId}</a>
            </> :
            null
          }
        </div>
      </div>
    </>
  )
}
