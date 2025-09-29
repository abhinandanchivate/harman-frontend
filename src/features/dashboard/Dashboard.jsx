import {
  useListPatientsQuery,
} from '../../api/patientsApi';
import { useListAppointmentsQuery } from '../../api/appointmentsApi';
import { useListRiskScoresQuery } from '../../api/analyticsApi';
import { useListNotificationsQuery } from '../../api/notificationsApi';
import Loading from '../../components/Loading';
import ErrorBlock from '../../components/ErrorBlock';

export default function Dashboard() {
  const {
    data: patients = [],
    isLoading: loadingPatients,
    isError: patientsError,
    error: patientsErrorData,
  } = useListPatientsQuery({ page_size: 5 });
  const {
    data: appointments = [],
    isLoading: loadingAppointments,
    isError: appointmentsError,
    error: appointmentsErrorData,
  } = useListAppointmentsQuery({ page_size: 5 });
  const { data: riskScores = [] } = useListRiskScoresQuery({ page_size: 5 });
  const { data: notifications = [] } = useListNotificationsQuery({ page_size: 5 });

  if (loadingPatients || loadingAppointments) {
    return <Loading message="Loading overview" />;
  }

  if (patientsError) return <ErrorBlock error={patientsErrorData} />;
  if (appointmentsError) return <ErrorBlock error={appointmentsErrorData} />;

  return (
    <section className="stack gap-lg">
      <header className="section-header">
        <div>
          <h1>Operational overview</h1>
          <p>Snapshot of the data exposed by the Django REST backend.</p>
        </div>
      </header>

      <div className="grid three">
        <div className="card metric">
          <h3>Patients</h3>
          <p className="metric-value">{patients.length}</p>
          <p className="muted">Showing first {patients.length} records</p>
        </div>
        <div className="card metric">
          <h3>Appointments</h3>
          <p className="metric-value">{appointments.length}</p>
          <p className="muted">Upcoming sample from API</p>
        </div>
        <div className="card metric">
          <h3>Risk scores</h3>
          <p className="metric-value">{riskScores.length}</p>
          <p className="muted">Analytics service preview</p>
        </div>
      </div>

      <div className="grid two">
        <div className="card overflow">
          <h3>Recent patients</h3>
          <ul className="stack">
            {patients.map((patient) => (
              <li key={patient.id}>
                <strong>
                  {patient.first_name} {patient.last_name}
                </strong>
                <div className="muted">{patient.email || 'No email'}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="card overflow">
          <h3>Recent notifications</h3>
          <ul className="stack">
            {notifications.map((notification) => (
              <li key={notification.id}>
                <strong>{notification.template?.name || notification.subject || 'Notification'}</strong>
                <div className="muted">Status: {notification.status || 'queued'}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
