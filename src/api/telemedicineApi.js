import { baseApi } from './baseApi';

export const telemedicineApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listSessions: build.query({
      query: (params) => ({
        url: 'v1/telemedicine/sessions/',
        params,
      }),
      transformResponse: (response) =>
        Array.isArray(response?.results)
          ? response.results
          : Array.isArray(response)
          ? response
          : [],
      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({ type: 'TelemedicineSession', id: item.id })),
              { type: 'TelemedicineSession', id: 'LIST' },
            ]
          : [{ type: 'TelemedicineSession', id: 'LIST' }],
    }),
    createSession: build.mutation({
      query: (body) => ({
        url: 'v1/telemedicine/sessions/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'TelemedicineSession', id: 'LIST' }],
    }),
    getSession: build.query({
      query: (id) => ({
        url: `v1/telemedicine/sessions/${id}/`,
      }),
      providesTags: (result, error, id) => [{ type: 'TelemedicineSession', id }],
    }),
    listConsents: build.query({
      query: (params) => ({
        url: 'v1/telemedicine/consents/',
        params,
      }),
      transformResponse: (response) =>
        Array.isArray(response?.results)
          ? response.results
          : Array.isArray(response)
          ? response
          : [],
      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({ type: 'TelemedicineConsent', id: item.id })),
              { type: 'TelemedicineConsent', id: 'LIST' },
            ]
          : [{ type: 'TelemedicineConsent', id: 'LIST' }],
    }),
    createConsent: build.mutation({
      query: (body) => ({
        url: 'v1/telemedicine/consents/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'TelemedicineConsent', id: 'LIST' }],
    }),
    listMetrics: build.query({
      query: (params) => ({
        url: 'v1/telemedicine/metrics/',
        params,
      }),
      transformResponse: (response) =>
        Array.isArray(response?.results)
          ? response.results
          : Array.isArray(response)
          ? response
          : [],
      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({ type: 'TelemedicineMetric', id: item.id })),
              { type: 'TelemedicineMetric', id: 'LIST' },
            ]
          : [{ type: 'TelemedicineMetric', id: 'LIST' }],
    }),
    getMetric: build.query({
      query: (id) => ({
        url: `v1/telemedicine/metrics/${id}/`,
      }),
      providesTags: (result, error, id) => [{ type: 'TelemedicineMetric', id }],
    }),
  }),
});

export const {
  useListSessionsQuery,
  useCreateSessionMutation,
  useGetSessionQuery,
  useListConsentsQuery,
  useCreateConsentMutation,
  useListMetricsQuery,
  useGetMetricQuery,
} = telemedicineApi;
