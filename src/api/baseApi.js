import axios from 'axios';
import { createApi } from '@reduxjs/toolkit/query/react';
import { clearAuth, setCredentials } from '../features/auth/authSlice';

const envBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const normalizedBase = envBase.endsWith('/') ? envBase.slice(0, -1) : envBase;
const apiRoot = `${normalizedBase}/api/`;

const axiosInstance = axios.create({
  baseURL: apiRoot,
  withCredentials: true,
});

const axiosBaseQuery = async (rawArgs, api, extraOptions) => {
  const args =
    typeof rawArgs === 'string'
      ? { url: rawArgs }
      : { ...rawArgs };

  const {
    skipAuth = false,
    method = 'GET',
    url,
    params,
    headers: customHeaders,
  } = args;

  const data =
    Object.prototype.hasOwnProperty.call(args, 'data')
      ? args.data
      : args.body;

  const headers = {
    Accept: 'application/json',
    ...customHeaders,
  };

  const token = api.getState()?.auth?.accessToken;
  if (!skipAuth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await axiosInstance.request({
      method,
      url,
      params,
      data,
      headers,
      signal: extraOptions?.signal,
    });

    return { data: response.data };
  } catch (error) {
    const status = error.response?.status ?? 'FETCH_ERROR';
    const responseData = error.response?.data ?? error.message;
    return {
      error: {
        status,
        data: responseData,
      },
    };
  }
};

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await axiosBaseQuery(args, api, extraOptions);

  if (result?.error && result.error.status === 401) {
    const refreshToken = api.getState()?.auth?.refreshToken;
    if (refreshToken) {
      const refreshResult = await axiosBaseQuery(
        {
          url: 'auth/refresh/',
          method: 'POST',
          data: { refresh: refreshToken },
          skipAuth: true,
        },
        api,
        extraOptions,
      );

      if (refreshResult?.data) {
        api.dispatch(
          setCredentials({
            ...refreshResult.data,
            refresh: refreshToken,
            user: api.getState()?.auth?.user || null,
          }),
        );
        result = await axiosBaseQuery(args, api, extraOptions);
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
