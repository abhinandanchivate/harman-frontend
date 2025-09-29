import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useListPatientsQuery,
  useCreatePatientMutation,
} from '../../api/patientsApi';
import Loading from '../../components/Loading';
import ErrorBlock from '../../components/ErrorBlock';

const initialForm = {
  first_name: '',
  last_name: '',
  gender: 'unknown',
  birth_date: '',
  email: '',
  phone: '',
};

export default function PatientsList() {
  const { data = [], isLoading, isError, error } = useListPatientsQuery();
  const [createPatient, { isLoading: creating, error: createError, isSuccess: created }] =
    useCreatePatientMutation();
  const [form, setForm] = useState(initialForm);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await createPatient({
      ...form,
      identifiers: [],
      telecom: [],
      address: {},
    });
    setForm(initialForm);
  };

  if (isLoading) return <Loading message="Loading patients" />;
  if (isError) return <ErrorBlock error={error} />;

  return (
    <section className="stack gap-lg">
      <header className="section-header">
        <div>
          <h1>Patients</h1>
          <p>Browse patient demographics and jump into their records.</p>
        </div>
      </header>

      <div className="card overflow">
        <table>
          <thead>
            <tr>
              <th>FHIR ID</th>
              <th>Name</th>
              <th>Birth date</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {data.map((patient) => (
              <tr key={patient.id}>
                <td>
                  <Link to={`/patients/${patient.id}`}>{patient.resource_id || patient.id}</Link>
                </td>
                <td>
                  {patient.first_name} {patient.last_name}
                </td>
                <td>{patient.birth_date}</td>
                <td>{patient.email || '—'}</td>
                <td>{patient.phone || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form className="card" onSubmit={handleSubmit}>
        <h3>Create patient</h3>
        <div className="form-grid">
          <label htmlFor="patient-first-name">First name</label>
          <input
            id="patient-first-name"
            value={form.first_name}
            onChange={handleChange('first_name')}
            required
          />

          <label htmlFor="patient-last-name">Last name</label>
          <input
            id="patient-last-name"
            value={form.last_name}
            onChange={handleChange('last_name')}
            required
          />

          <label htmlFor="patient-gender">Gender</label>
          <select
            id="patient-gender"
            value={form.gender}
            onChange={handleChange('gender')}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="unknown">Unknown</option>
          </select>

          <label htmlFor="patient-dob">Birth date</label>
          <input
            id="patient-dob"
            type="date"
            value={form.birth_date}
            onChange={handleChange('birth_date')}
            required
          />

          <label htmlFor="patient-email">Email</label>
          <input
            id="patient-email"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
          />

          <label htmlFor="patient-phone">Phone</label>
          <input
            id="patient-phone"
            value={form.phone}
            onChange={handleChange('phone')}
          />
        </div>

        {createError && <ErrorBlock error={createError} />}
        {created && <p className="success">Patient created.</p>}

        <button type="submit" className="primary" disabled={creating}>
          {creating ? 'Saving…' : 'Create patient'}
        </button>
      </form>
    </section>
  );
}
