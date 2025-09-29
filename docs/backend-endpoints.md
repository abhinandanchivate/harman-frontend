# Harman Backend Endpoint Survey

Base API root: `http://localhost:8000/api/`

Most endpoints require JWT authentication using the access token issued by `POST /api/auth/login/`. Permission enforcement is role-based via the RBAC configuration in `api/rbac.py`.

## Authentication & Session

| Method | Path | Description | Auth | Tag type | Request highlights | Response |
| --- | --- | --- | --- | --- | --- | --- |
| POST | `/api/auth/login/` | Obtain `access`, `refresh`, and user profile metadata. | Public | `Auth` | `{ "email": string, "password": string }` | `{ "access", "refresh", "user": { id, email, username, roles, permissions } }` |
| POST | `/api/auth/refresh/` | Refresh the access token. | Public | `Auth` | `{ "refresh": string }` | `{ "access": string }` |
| GET | `/api/auth/me/` | Current user profile with roles & permissions. | JWT | `Auth`, `User` | – | `{ id, email, username, roles, permissions, profile? }` |
| POST | `/api/auth/register/` | Self-registration with profile info; assigns `PATIENT` role. | Public | `User` | `email`, `password`, `confirm_password`, `accept_terms`, `verification_method`, `profile{ first_name, last_name, phone?, date_of_birth? }` | Created user summary `{ id, email, roles }` |
| POST | `/api/admin/users/assign-role/` | Assign one or more roles to a user. | JWT (admin) | `User`, `Role` | `{ user_id, roles: ["ADMIN"], effective_date?, expiry_date?, reason? }` | Array of assignments with `role`, `effective_date`, etc. |

## RBAC & Roles

Routes served by `RoleViewSet` under `/api/v1/admin/roles/` (tag type `Role`) require JWT and appropriate RBAC privileges.

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/v1/admin/roles/` | List roles `{ id, name, description, permissions, created_at }`. Supports pagination (`page`, `page_size`). |
| POST | `/api/v1/admin/roles/` | Create role with JSON `permissions` map. |
| GET | `/api/v1/admin/roles/{id}/` | Retrieve role. |
| PATCH | `/api/v1/admin/roles/{id}/` | Partial update (e.g., description, permissions). |
| DELETE | `/api/v1/admin/roles/{id}/` | Remove role. |

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

## Telemedicine APIs – tags `TelemedicineSession`, `TelemedicineConsent`, `TelemedicineMetric`

* `/api/v1/telemedicine/sessions/` – list/create telemedicine sessions (`session_id`, `scheduled_start`, `join_urls`, etc.) and retrieve by id.
* `/api/v1/telemedicine/consents/` – list/create consent entries (`session`, `user_id`, `consent_type`, `granted`, `timestamp`).
* `/api/v1/telemedicine/metrics/` – list/retrieve metrics associated with sessions (`session`, `metric_type`, etc.).

## Notifications – tags `NotificationTemplate`, `NotificationCampaign`, `Notification`

* `/api/v1/notifications/templates/` – list/create/update notification templates (`name`, `channel`, `content`).
* `/api/v1/notifications/campaigns/` – list/create broadcast campaigns (`template`, `audience`, `schedule`).
* `/api/v1/notifications/` – list/create notifications (`template`, `recipient`, `status`, delivery metadata).

## Analytics – tags `RiskScore`, `TrainingJob`, `ModelVersion`, `PersonalizedAlert`

* `/api/v1/analytics/risk-scores/` – list/create risk score entries (`patient`, `score`, `model_name`, `explanations`).
* `/api/v1/analytics/training-jobs/` – list/create ML training jobs (`dataset`, `status`, `metrics`).
* `/api/v1/analytics/model-versions/` – list/create deployed model versions (`training_job`, `version`, `metadata`).
* `/api/v1/analytics/alerts/` – list/create personalised alerts (`patient`, `model`, `alert_type`, `status`).

## Audit Trail – tags `AuditEvent`, `AuditExport`, `AuditAnomaly`

* `/api/v1/audit/events/` – list/create audit events (`event_type`, `actor`, `metadata`).
* `/api/v1/audit/exports/` – list/create export audit records (`resource_type`, `status`, `requested_by`).
* `/api/v1/audit/anomalies/` – list/create anomaly reports (`anomaly_type`, `severity`, `details`).

## HL7 Ingestion – tag `HL7`

Base path: `/api/v1/hl7-parser/`

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/v1/hl7-parser/` | List parsed HL7 messages (`message_id`, `status`, `created_at`, `errors`). |
| GET | `/api/v1/hl7-parser/{id}/` | Retrieve specific message payload (parsed segments, `parsed_payload`). |
| POST | `/api/v1/hl7-parser/ingest/` | Submit HL7 payload (`raw_message`, optional `messageId`, `correlationId`). Saves as processed message. |
| GET | `/api/v1/hl7-parser/parse-status/{message_id}/` | Poll parsing status by `message_id`; returns `status`, `processedAt`, `resourcesCreated`. |
| POST | `/api/v1/hl7-parser/batch/` | Submit HL7 batch payload (`messages`, etc.). Returns created batch summary.

## Additional Notes

* Pagination: default page size is 25 (`StandardResultsSetPagination`). Query parameters `page` and `page_size` are supported by viewsets using the pagination class.
* Permissions: all viewsets extend `RoleProtectedModelViewSet` and enforce RBAC through `action_permission_map`. Consult `api/rbac.py` for role→entity action mappings.
* Error format: validation errors return standard DRF serializer errors; authentication issues yield `{ "detail": "..." }` with HTTP 401.
