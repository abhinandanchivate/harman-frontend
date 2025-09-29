# Harman Frontend

A React 18 single-page application generated with Vite and wired to the [`harman-backend`](https://github.com/abhinandanchivate/harman-backend) Django REST API. State management uses Redux Toolkit with RTK Query for data fetching, optimistic cache updates, and automatic auth header handling powered by a shared Axios base query.

![Tech stack](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge) ![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-RTK%20Query-764abc?style=for-the-badge) ![Vite](https://img.shields.io/badge/Vite-7-646cff?style=for-the-badge)

## Project structure

```
src/
  app/            # Redux store configuration
  api/            # RTK Query endpoint slices (auth, patients, appointments, analytics, etc.)
  components/     # Layout, navigation, guards, loading/error primitives
  features/       # Feature-oriented UI modules (auth, patients, appointments, dashboard, roles, users)
  pages/          # Top-level routes (Home, NotFound)
  styles/         # Global styling
  routes.jsx      # React Router v6.29 route tree
  main.jsx        # App bootstrap
```

## Backend quick start

Clone and boot the Django backend in a sibling directory:

```bash
git clone https://github.com/abhinandanchivate/harman-backend
cd harman-backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py roles_seed --admin-email admin@example.com --admin-password ChangeMe123!
python manage.py runserver
```

The API will be served at `http://localhost:8000/api/`. Swagger UI is available at `http://localhost:8000/api/docs/` once the server is running.

## Frontend setup

```bash
npm install
cp .env.example .env
# adjust VITE_API_BASE_URL if the backend runs elsewhere
npm run dev
```

Default npm scripts:

| Script | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server with hot module reloading. |
| `npm run build` | Production build. |
| `npm run preview` | Preview production build locally. |
| `npm run lint` | Placeholder (eslint wiring can be added later). |

### Environment variables

| Key | Purpose | Default |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Backend origin **without** the trailing `/api`. | `http://localhost:8000` |

`src/api/baseApi.js` normalises the URL and appends `/api/` automatically.

## Authentication flow

* `POST /api/auth/login/` returns `access`, `refresh`, and user metadata. Tokens are stored in Redux state and persisted in `localStorage` under `harman-auth`.
* A shared Axios instance (see `src/api/baseApi.js`) attaches the `Authorization: Bearer <access>` header and performs silent refresh via `POST /api/auth/refresh/` when a 401 is received.
* `GET /api/auth/me/` hydrates user roles and permissions and powers the protected navigation guard.

Use the seeded admin credentials (e.g. `admin@example.com` / `ChangeMe123!`) or any registered account to sign in.

## Available routes

| Route | Component | Notes |
| --- | --- | --- |
| `/login` | `LoginPage` | Public credential form. Redirects once `me` resolves. |
| `/` | `Home` | Overview and quick links. |
| `/dashboard` | `Dashboard` | Aggregated metrics (patients, appointments, risk scores, notifications). |
| `/patients` | `PatientsList` | Paginated table, quick create form. |
| `/patients/:id` | `PatientDetail` | Demographics, export trigger, raw JSON viewer. |
| `/appointments` | `AppointmentsList` | Schedule list, waitlist snapshot, availability lookup, creation form. |
| `/users` | `UsersList` | Shows current session user, registration form, role assignment helper. |
| `/roles` | `RolesList` | Manage RBAC roles and permissions JSON. |
| `*` | `NotFound` | Fallback 404.

All authenticated routes are wrapped in `ProtectedRoute`, which ensures a JWT exists and `/api/auth/me/` succeeds before rendering.

## Data fetching

Each module under `src/api/` injects endpoints into the shared RTK Query `baseApi`. Tag types mirror backend resources for automatic cache invalidation, while Axios handles JSON parsing, credentials, and auth headers consistently across endpoints:

`Auth`, `User`, `Role`, `Patient`, `Appointment`, `Waitlist`, `Observation`, `TelemedicineSession`, `TelemedicineConsent`, `TelemedicineMetric`, `Notification`, `NotificationTemplate`, `NotificationCampaign`, `RiskScore`, `TrainingJob`, `ModelVersion`, `PersonalizedAlert`, `AuditEvent`, `AuditExport`, `AuditAnomaly`, `HL7`.

Refer to [`docs/backend-endpoints.md`](docs/backend-endpoints.md) for a hand-audited reference of every DRF endpoint (methods, payloads, auth requirements, and associated tag type).

## Known limitations

* The backend currently exposes only the `auth/me/` endpoint for user retrieval, so `UsersList` shows the authenticated session plus provides administrative helpers (registration & role assignment).
* No automatic schema generation is consumed yet; the frontend relies on manual endpoint definitions documented in `docs/backend-endpoints.md`.
* Forms provide minimal validation beyond what the backend enforces. Add richer client-side validation as needed.

## Testing & linting

Automated tests are not configured yet. Suggested additions:

* Hook ESLint/Prettier into `npm run lint`.
* Add component/integration tests with Vitest + React Testing Library.

## License

MIT.
