# Harman Backend Endpoint Survey

Base API root: `http://localhost:8000/api/`

Most endpoints require JWT authentication using the access token issued by `POST /api/auth/login/`. Permission enforcement is role-based via the RBAC configuration in `api/rbac.py`.

### Axios quick start

```js
import axios from 'axios';

export const client = axios.create({
  baseURL: 'http://localhost:8000/api/',
  withCredentials: true,
});

export const login = async (credentials) => {
  const { data } = await client.post('auth/login/', credentials);
  return data; // { access, refresh, user }
};

export const fetchMe = async (accessToken) => {
  const { data } = await client.get('auth/me/', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return data;
};

export const refresh = (refreshToken) =>
  client.post('auth/refresh/', { refresh: refreshToken }).then((res) => res.data);
```

Each section below adds inline Axios snippets for typical operations.

## Authentication & Session

| Method | Path | Description | Auth | Tag type | Request highlights | Response |
| --- | --- | --- | --- | --- | --- | --- |
| POST | `/api/auth/login/` | Obtain `access`, `refresh`, and user profile metadata. | Public | `Auth` | `{ "email": string, "password": string }` | `{ "access", "refresh", "user": { id, email, username, roles, permissions } }` |
| POST | `/api/auth/refresh/` | Refresh the access token. | Public | `Auth` | `{ "refresh": string }` | `{ "access": string }` |
| GET | `/api/auth/me/` | Current user profile with roles & permissions. | JWT | `Auth`, `User` | – | `{ id, email, username, roles, permissions, profile? }` |
| POST | `/api/auth/register/` | Self-registration with profile info; assigns `PATIENT` role. | Public | `User` | `email`, `password`, `confirm_password`, `accept_terms`, `verification_method`, `profile{ first_name, last_name, phone?, date_of_birth? }` | Created user summary `{ id, email, roles }` |
| POST | `/api/admin/users/assign-role/` | Assign one or more roles to a user. | JWT (admin) | `User`, `Role` | `{ user_id, roles: ["ADMIN"], effective_date?, expiry_date?, reason? }` | Array of assignments with `role`, `effective_date`, etc. |

**Axios samples**

```js
// Login and persist tokens
const { access, refresh } = await login({
  email: 'admin@example.com',
  password: 'ChangeMe123!',
});

// Fetch current session with Authorization header
const me = await fetchMe(access);

// Register a new patient portal user
await client.post('auth/register/', {
  email: 'john.doe@example.com',
  password: 'Str0ngPass!',
  confirm_password: 'Str0ngPass!',
  accept_terms: true,
  verification_method: 'email',
  profile: {
    first_name: 'John',
    last_name: 'Doe',
    phone: '+15551234567',
    date_of_birth: '1980-01-15',
  },
});

// Assign MANAGER role to user id 5
await client.post(
  'admin/users/assign-role/',
  { user_id: 5, roles: ['MANAGER'], reason: 'Grant elevated access' },
  { headers: { Authorization: `Bearer ${access}` } },
);
```

## RBAC & Roles

Routes served by `RoleViewSet` under `/api/v1/admin/roles/` (tag type `Role`) require JWT and appropriate RBAC privileges.

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/v1/admin/roles/` | List roles `{ id, name, description, permissions, created_at }`. Supports pagination (`page`, `page_size`). |
| POST | `/api/v1/admin/roles/` | Create role with JSON `permissions` map. |
| GET | `/api/v1/admin/roles/{id}/` | Retrieve role. |
| PATCH | `/api/v1/admin/roles/{id}/` | Partial update (e.g., description, permissions). |
| DELETE | `/api/v1/admin/roles/{id}/` | Remove role. |

```js
// Create a role
const { data: role } = await client.post(
  'v1/admin/roles/',
  {
    name: 'CARE_COORDINATOR',
    description: 'Coordinates cross-discipline care teams',
    permissions: { patients: ['read'], appointments: ['read', 'update'] },
  },
  { headers: { Authorization: `Bearer ${access}` } },
);

// Delete a role by id
await client.delete(`v1/admin/roles/${role.id}/`, {
  headers: { Authorization: `Bearer ${access}` },
});
```

## Patients (`PatientViewSet`) – tag `Patient`

Base path: `/api/v1/patients/`

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/v1/patients/` | Paginated list of patients with demographics (`resource_id`, `first_name`, `last_name`, `gender`, `birth_date`, contact fields). |
| POST | `/api/v1/patients/` | Create patient. Required: `first_name`, `last_name`, valid `gender`, optional identifiers/telecom/address. Creator recorded in `created_by`. |
| GET | `/api/v1/patients/{id}/` | Retrieve single patient record. |
| PATCH | `/api/v1/patients/{id}/` | Partial update. |
| DELETE | `/api/v1/patients/{id}/` | Delete patient (RBAC delete). |
| GET | `/api/v1/patients/search/` | Filtered search returning a FHIR `Bundle` with entries `{ resource: PatientSerializer }`. Accepts filter params (`first_name`, etc.). |
| POST | `/api/v1/patients/{id}/merge/{target_id}/` | Merge duplicate patients using payload `{ reason, mergeStrategy?, fields?, auditReason?, mergedFields?, auditId?, performed_by? }`. Response summarises merge result. |
| GET | `/api/v1/patients/{id}/export/` | Initiate export. Query params: `format` (pdf/csv/json), `includeSections`. Response includes `exportId`, `downloadUrl`, `expiresAt`. |

```js
// List patients with optional filters
const { data: patients } = await client.get('v1/patients/', {
  params: { search: 'john' },
  headers: { Authorization: `Bearer ${access}` },
});

// Create a patient
await client.post(
  'v1/patients/',
  {
    resource_id: 'patient-uuid-123',
    primary_identifier: 'MRN12345',
    identifiers: [{ value: 'MRN12345' }],
    first_name: 'John',
    last_name: 'Doe',
    gender: 'male',
    birth_date: '1980-01-15',
  },
  { headers: { Authorization: `Bearer ${access}` } },
);
```

### Supporting endpoints

* `/api/v1/waitlist/` (`WaitlistViewSet`, tag `Waitlist`) provides read-only access to waitlist entries (`appointment`, `patient`, `preferred_dates`, etc.).

## Observations (`ObservationViewSet`) – tag `Observation`

Base path: `/api/v1/observations/`

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/v1/observations/` | Paginated list of observations (fields: `patient`, `code`, `status`, `effective_time`, `value_quantity`, `components`). Supports filters such as `patient`, `code`. |
| POST | `/api/v1/observations/` | Create observation (validates effective_time not in future). |
| GET | `/api/v1/observations/{id}/` | Retrieve observation. |
| PATCH | `/api/v1/observations/{id}/` | Partial update. |
| DELETE | `/api/v1/observations/{id}/` | Remove observation. |
| GET | `/api/v1/observations/{patient_id}/trends/?code={code}&period=P30D` | Aggregated time series for a patient + code. Returns `dataPoints`, `referenceRanges`, `timeRange`. |
| POST | `/api/v1/observations/alerts/configure/` | Create alert configuration (`patient`, `observation_code`, `thresholds`, `notification_channels`, etc.). |

```js
// Fetch observation trends for a patient
const { data: trends } = await client.get(
  `v1/observations/${patientId}/trends/`,
  {
    params: { code: 'heart-rate', period: 'P30D' },
    headers: { Authorization: `Bearer ${access}` },
  },
);

// Configure an alert
await client.post(
  'v1/observations/alerts/configure/',
  {
    patient: patientId,
    observation_code: 'blood-pressure',
    thresholds: { systolic: { max: 140 } },
    notification_channels: ['email'],
  },
  { headers: { Authorization: `Bearer ${access}` } },
);
```

## Appointments (`AppointmentViewSet`) – tag `Appointment`

Base path: `/api/v1/appointments/`

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/v1/appointments/` | Paginated list (fields: `patient`, `practitioner_reference`, `status`, `start`, `end`, `appointment_type`, `location`). |
| POST | `/api/v1/appointments/` | Create appointment; validates start is future and end after start. |
| GET | `/api/v1/appointments/{id}/` | Retrieve appointment. |
| PATCH | `/api/v1/appointments/{id}/` | Update appointment. |
| DELETE | `/api/v1/appointments/{id}/` | Delete appointment. |
| GET | `/api/v1/appointments/availability/?date=YYYY-MM-DD&practitioner=&duration=` | Synthetic availability slots for a date/practitioner. |
| POST | `/api/v1/appointments/{id}/waitlist/` | Add patient to appointment waitlist: `{ patientId, preferredDates?, preferredTimes?, priority?, notificationPreferences? }`. Response mirrors `WaitlistEntrySerializer`. |

```js
// Create appointment
const { data: appointment } = await client.post(
  'v1/appointments/',
  {
    patient: patientId,
    practitioner_reference: 'Practitioner/123',
    status: 'booked',
    start: '2025-03-10T15:00:00Z',
    end: '2025-03-10T15:30:00Z',
    appointment_type: 'follow-up',
    location: 'Main Clinic',
  },
  { headers: { Authorization: `Bearer ${access}` } },
);

// Add patient to waitlist for the appointment
await client.post(
  `v1/appointments/${appointment.id}/waitlist/`,
  {
    patientId,
    preferredDates: ['2025-03-12'],
    notificationPreferences: ['email'],
  },
  { headers: { Authorization: `Bearer ${access}` } },
);
```

## Telemedicine APIs – tags `TelemedicineSession`, `TelemedicineConsent`, `TelemedicineMetric`

* `/api/v1/telemedicine/sessions/` – list/create telemedicine sessions (`session_id`, `scheduled_start`, `join_urls`, etc.) and retrieve by id.
* `/api/v1/telemedicine/consents/` – list/create consent entries (`session`, `user_id`, `consent_type`, `granted`, `timestamp`).
* `/api/v1/telemedicine/metrics/` – list/retrieve metrics associated with sessions (`session`, `metric_type`, etc.).

```js
// Schedule a telemedicine session
const { data: session } = await client.post(
  'v1/telemedicine/sessions/',
  {
    session_id: 'tele-001',
    patient: patientId,
    scheduled_start: '2025-04-01T14:00:00Z',
    scheduled_end: '2025-04-01T14:45:00Z',
    join_urls: { patient: 'https://example.com/patient', clinician: 'https://example.com/clinician' },
  },
  { headers: { Authorization: `Bearer ${access}` } },
);

// Record a consent response
await client.post(
  'v1/telemedicine/consents/',
  {
    session: session.id,
    user_id: me.id,
    consent_type: 'hipaa',
    granted: true,
  },
  { headers: { Authorization: `Bearer ${access}` } },
);
```

## Notifications – tags `NotificationTemplate`, `NotificationCampaign`, `Notification`

* `/api/v1/notifications/templates/` – list/create/update notification templates (`name`, `channel`, `content`).
* `/api/v1/notifications/campaigns/` – list/create broadcast campaigns (`template`, `audience`, `schedule`).
* `/api/v1/notifications/` – list/create notifications (`template`, `recipient`, `status`, delivery metadata).

```js
// Create a notification template
const { data: template } = await client.post(
  'v1/notifications/templates/',
  {
    name: 'follow-up-reminder',
    channel: 'email',
    content: 'Hello {{ patientName }}, remember your appointment on {{ appointmentDate }}.',
  },
  { headers: { Authorization: `Bearer ${access}` } },
);

// Trigger a notification using that template
await client.post(
  'v1/notifications/',
  {
    template: template.id,
    recipient: patientId,
    status: 'queued',
    metadata: { appointment: appointment.id },
  },
  { headers: { Authorization: `Bearer ${access}` } },
);
```

## Analytics – tags `RiskScore`, `TrainingJob`, `ModelVersion`, `PersonalizedAlert`

* `/api/v1/analytics/risk-scores/` – list/create risk score entries (`patient`, `score`, `model_name`, `explanations`).
* `/api/v1/analytics/training-jobs/` – list/create ML training jobs (`dataset`, `status`, `metrics`).
* `/api/v1/analytics/model-versions/` – list/create deployed model versions (`training_job`, `version`, `metadata`).
* `/api/v1/analytics/alerts/` – list/create personalised alerts (`patient`, `model`, `alert_type`, `status`).

```js
// Submit a model training job
const { data: job } = await client.post(
  'v1/analytics/training-jobs/',
  {
    dataset: 'risk_scores_jan',
    model_name: 'readmission',
    status: 'queued',
  },
  { headers: { Authorization: `Bearer ${access}` } },
);

// Create a personalised alert
await client.post(
  'v1/analytics/alerts/',
  {
    patient: patientId,
    model: job.id,
    alert_type: 'high-risk',
    status: 'pending',
  },
  { headers: { Authorization: `Bearer ${access}` } },
);
```

## Audit Trail – tags `AuditEvent`, `AuditExport`, `AuditAnomaly`

* `/api/v1/audit/events/` – list/create audit events (`event_type`, `actor`, `metadata`).
* `/api/v1/audit/exports/` – list/create export audit records (`resource_type`, `status`, `requested_by`).
* `/api/v1/audit/anomalies/` – list/create anomaly reports (`anomaly_type`, `severity`, `details`).

```js
// Log an audit event
await client.post(
  'v1/audit/events/',
  {
    event_type: 'patient_view',
    actor: me.id,
    metadata: { patient: patientId },
  },
  { headers: { Authorization: `Bearer ${access}` } },
);

// File an anomaly report
await client.post(
  'v1/audit/anomalies/',
  {
    anomaly_type: 'suspicious_login',
    severity: 'high',
    details: { user: me.id, ip: '203.0.113.24' },
  },
  { headers: { Authorization: `Bearer ${access}` } },
);
```

## HL7 Ingestion – tag `HL7`

Base path: `/api/v1/hl7-parser/`

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/v1/hl7-parser/` | List parsed HL7 messages (`message_id`, `status`, `created_at`, `errors`). |
| GET | `/api/v1/hl7-parser/{id}/` | Retrieve specific message payload (parsed segments, `parsed_payload`). |
| POST | `/api/v1/hl7-parser/ingest/` | Submit HL7 payload (`raw_message`, optional `messageId`, `correlationId`). Saves as processed message. |
| GET | `/api/v1/hl7-parser/parse-status/{message_id}/` | Poll parsing status by `message_id`; returns `status`, `processedAt`, `resourcesCreated`. |
| POST | `/api/v1/hl7-parser/batch/` | Submit HL7 batch payload (`messages`, etc.). Returns created batch summary.

```js
// Ingest a single HL7 message
await client.post(
  'v1/hl7-parser/ingest/',
  {
    raw_message: 'MSH|^~\&|...'
  },
  { headers: { Authorization: `Bearer ${access}` } },
);

// Poll parse status
const { data: status } = await client.get(`v1/hl7-parser/parse-status/${messageId}/`, {
  headers: { Authorization: `Bearer ${access}` },
});
```

## Additional Notes

* Pagination: default page size is 25 (`StandardResultsSetPagination`). Query parameters `page` and `page_size` are supported by viewsets using the pagination class.
* Permissions: all viewsets extend `RoleProtectedModelViewSet` and enforce RBAC through `action_permission_map`. Consult `api/rbac.py` for role→entity action mappings.
* Error format: validation errors return standard DRF serializer errors; authentication issues yield `{ "detail": "..." }` with HTTP 401.
