import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useGetPatientQuery,
  useExportPatientMutation,
  useDeletePatientMutation,
} from '../../api/patientsApi';
import Loading from '../../components/Loading';
import ErrorBlock from '../../components/ErrorBlock';

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetPatientQuery(id);
  const [exportPatient, { isLoading: exporting, data: exportData }] = useExportPatientMutation();
  const [deletePatient, { isLoading: deleting }] = useDeletePatientMutation();
  const [format, setFormat] = useState('pdf');

  const handleExport = async () => {
    await exportPatient({ id, format });
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this patient record?')) {
      await deletePatient(id);
      navigate('/patients');
    }
  };

  if (isLoading) return <Loading message="Loading patient" />;
  if (isError) return <ErrorBlock error={error} />;

  return (
    <section className="stack gap-lg">
      <header className="section-header">
        <div>
          <h1>
            {data.first_name} {data.last_name}
          </h1>
          <p>FHIR resource ID: {data.resource_id}</p>
        </div>
        <div className="section-actions">
          <label>
            Export format
            <select value={format} onChange={(event) => setFormat(event.target.value)}>
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
          </label>
          <button type="button" className="primary" onClick={handleExport} disabled={exporting}>
            {exporting ? 'Preparing export…' : 'Export summary'}
          </button>
          <button type="button" className="link-button danger" onClick={handleDelete} disabled={deleting}>
            Delete
          </button>
        </div>
      </header>

      {exportData && (
        <div className="card">
          <h3>Export request</h3>
          <p>
            Status: <strong>{exportData.status}</strong>
          </p>
          {exportData.downloadUrl && (
            <p>
              Download URL: <code>{exportData.downloadUrl}</code>
            </p>
          )}
        </div>
      )}

      <div className="grid two">
        <div className="card">
          <h3>Demographics</h3>
          <dl>
            <div>
              <dt>Primary identifier</dt>
              <dd>{data.primary_identifier || '—'}</dd>
            </div>
            <div>
              <dt>Gender</dt>
              <dd>{data.gender}</dd>
            </div>
            <div>
              <dt>Birth date</dt>
              <dd>{data.birth_date}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{data.email || '—'}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{data.phone || '—'}</dd>
            </div>
          </dl>
        </div>
        <div className="card">
          <h3>Identifiers</h3>
          <pre>{JSON.stringify(data.identifiers || [], null, 2)}</pre>
        </div>
      </div>

      <div className="card">
        <h3>Raw record</h3>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </section>
  );
}
