import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { clearAuth, setCredentials } from '../features/auth/authSlice';

const envBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const normalizedBase = envBase.endsWith('/') ? envBase.slice(0, -1) : envBase;
const apiRoot = `${normalizedBase}/api/`;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: apiRoot,
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Accept', 'application/json');
    return headers;
  },
  credentials: 'include',
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result?.error && result.error.status === 401) {
    const refreshToken = api.getState()?.auth?.refreshToken;
    if (refreshToken) {
      const refreshResult = await rawBaseQuery(
        {
          url: 'auth/refresh/',
          method: 'POST',
          body: { refresh: refreshToken },
        },
        api,
        extraOptions,
      );

      if (refreshResult?.data) {
        api.dispatch(
          setCredentials({
            ...refreshResult.data,
            user: api.getState()?.auth?.user || null,
          }),
        );
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        api.dispatch(clearAuth());
      }
    } else {
      api.dispatch(clearAuth());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Auth',
    'User',
    'Role',
    'Patient',
    'Appointment',
    'Waitlist',
    'Observation',
    'TelemedicineSession',
    'TelemedicineConsent',
    'TelemedicineMetric',
    'Notification',
    'NotificationTemplate',
    'NotificationCampaign',
    'RiskScore',
    'TrainingJob',
    'ModelVersion',
    'PersonalizedAlert',
    'AuditEvent',
    'AuditExport',
    'AuditAnomaly',
    'HL7',
  ],
  endpoints: () => ({}),
});
