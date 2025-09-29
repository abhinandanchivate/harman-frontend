export default function Home() {
  return (
    <section className="stack gap-lg">
      <header className="section-header">
        <div>
          <h1>Welcome to Harman Care Portal</h1>
          <p>
            This frontend is powered by React, Redux Toolkit, and RTK Query, and connects to the Django REST Framework backend
            at <code>/api/</code>.
          </p>
        </div>
      </header>

      <div className="card">
        <h3>Getting started</h3>
        <ol>
          <li>Use the navigation to explore patients, appointments, roles, and more.</li>
          <li>Authenticate with your JWT credentials to unlock protected endpoints.</li>
          <li>
            Review <code>docs/backend-endpoints.md</code> for a full list of API endpoints exposed by the backend.
          </li>
        </ol>
      </div>
    </section>
  );
}
