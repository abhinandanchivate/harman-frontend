import { useEffect, useState } from 'react';
import { useCreateAppointmentMutation } from '../../api/appointmentsApi';
import ErrorBlock from '../../components/ErrorBlock';

const initialState = {
  patient: '',
  practitioner_reference: '',
  start: '',
  end: '',
  status: 'scheduled',
  service_category: '',
  appointment_type: '',
  location: '',
  notes: '',
};

export default function AppointmentForm() {
  const [form, setForm] = useState(initialState);
  const [createAppointment, { isLoading, isSuccess, error }] = useCreateAppointmentMutation();

  useEffect(() => {
    if (isSuccess) {
      setForm(initialState);
    }
  }, [isSuccess]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await createAppointment(form);
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>Schedule appointment</h3>
      <div className="form-grid">
        <label htmlFor="appointment-patient">Patient ID</label>
        <input
          id="appointment-patient"
          value={form.patient}
          onChange={handleChange('patient')}
          placeholder="Patient primary key"
          required
        />

        <label htmlFor="appointment-practitioner">Practitioner</label>
        <input
          id="appointment-practitioner"
          value={form.practitioner_reference}
          onChange={handleChange('practitioner_reference')}
          placeholder="Practitioner reference"
        />

        <label htmlFor="appointment-start">Start (ISO)</label>
        <input
          id="appointment-start"
          type="datetime-local"
          value={form.start}
          onChange={handleChange('start')}
          required
        />

        <label htmlFor="appointment-end">End (ISO)</label>
        <input
          id="appointment-end"
          type="datetime-local"
          value={form.end}
          onChange={handleChange('end')}
          required
        />

        <label htmlFor="appointment-status">Status</label>
        <select id="appointment-status" value={form.status} onChange={handleChange('status')}>
          <option value="scheduled">Scheduled</option>
          <option value="booked">Booked</option>
          <option value="arrived">Arrived</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <label htmlFor="appointment-category">Service category</label>
        <input
          id="appointment-category"
          value={form.service_category}
          onChange={handleChange('service_category')}
        />

        <label htmlFor="appointment-type">Appointment type</label>
        <input
          id="appointment-type"
          value={form.appointment_type}
          onChange={handleChange('appointment_type')}
        />

        <label htmlFor="appointment-location">Location</label>
        <input id="appointment-location" value={form.location} onChange={handleChange('location')} />

        <label htmlFor="appointment-notes">Notes</label>
        <textarea
          id="appointment-notes"
          rows={3}
          value={form.notes}
          onChange={handleChange('notes')}
        />
      </div>

      {error && <ErrorBlock error={error} />}
      {isSuccess && <p className="success">Appointment created.</p>}

      <button type="submit" className="primary" disabled={isLoading}>
        {isLoading ? 'Scheduling…' : 'Schedule appointment'}
      </button>
    </form>
  );
}
