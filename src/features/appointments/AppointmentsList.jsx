import { useState } from 'react';
import {
  useListAppointmentsQuery,
  useListWaitlistQuery,
  useGetAvailabilityQuery,
} from '../../api/appointmentsApi';
import Loading from '../../components/Loading';
import ErrorBlock from '../../components/ErrorBlock';
import AppointmentForm from './AppointmentForm';

export default function AppointmentsList() {
  const { data = [], isLoading, isError, error } = useListAppointmentsQuery();
  const { data: waitlist = [] } = useListWaitlistQuery();
  const [availabilityDate, setAvailabilityDate] = useState(() => new Date().toISOString().slice(0, 10));
  const { data: availability, isFetching: loadingAvailability } = useGetAvailabilityQuery(
    { date: availabilityDate },
    { skip: !availabilityDate },
  );

  if (isLoading) return <Loading message="Loading appointments" />;
  if (isError) return <ErrorBlock error={error} />;

  return (
    <section className="stack gap-lg">
      <header className="section-header">
        <div>
          <h1>Appointments</h1>
          <p>Monitor upcoming encounters and manage the waitlist.</p>
        </div>
      </header>

      <div className="card overflow">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Status</th>
              <th>Start</th>
              <th>End</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {data.map((appt) => (
              <tr key={appt.id}>
                <td>{appt.id}</td>
                <td>{appt.patient}</td>
                <td>{appt.status}</td>
                <td>{appt.start}</td>
                <td>{appt.end}</td>
                <td>{appt.appointment_type || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AppointmentForm />

      <div className="grid two">
        <div className="card">
          <h3>Availability</h3>
          <label htmlFor="availability-date">Date</label>
          <input
            id="availability-date"
            type="date"
            value={availabilityDate}
            onChange={(event) => setAvailabilityDate(event.target.value)}
          />
          {loadingAvailability && <Loading message="Checking slots" />}
          {availability && (
            <ul className="stack">
              {availability.availableSlots?.map((slot, index) => (
                <li key={index} className="chip">
                  {slot.type}: {slot.start} → {slot.end}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card overflow">
          <h3>Waitlist</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Appointment</th>
                <th>Patient</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {waitlist.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.id}</td>
                  <td>{entry.appointment}</td>
                  <td>{entry.patient}</td>
                  <td>{entry.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
