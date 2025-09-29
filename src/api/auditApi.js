import { baseApi } from './baseApi';

export const auditApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listAuditEvents: build.query({
      query: (params) => ({
        url: 'v1/audit/events/',
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
              ...result.map((item) => ({ type: 'AuditEvent', id: item.id })),
              { type: 'AuditEvent', id: 'LIST' },
            ]
          : [{ type: 'AuditEvent', id: 'LIST' }],
    }),
    createAuditEvent: build.mutation({
      query: (body) => ({
        url: 'v1/audit/events/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'AuditEvent', id: 'LIST' }],
    }),
    listAuditExports: build.query({
      query: (params) => ({
        url: 'v1/audit/exports/',
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
              ...result.map((item) => ({ type: 'AuditExport', id: item.id })),
              { type: 'AuditExport', id: 'LIST' },
            ]
          : [{ type: 'AuditExport', id: 'LIST' }],
    }),
    createAuditExport: build.mutation({
      query: (body) => ({
        url: 'v1/audit/exports/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'AuditExport', id: 'LIST' }],
    }),
    listAuditAnomalies: build.query({
      query: (params) => ({
        url: 'v1/audit/anomalies/',
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
              ...result.map((item) => ({ type: 'AuditAnomaly', id: item.id })),
              { type: 'AuditAnomaly', id: 'LIST' },
            ]
          : [{ type: 'AuditAnomaly', id: 'LIST' }],
    }),
    createAuditAnomaly: build.mutation({
      query: (body) => ({
        url: 'v1/audit/anomalies/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'AuditAnomaly', id: 'LIST' }],
    }),
  }),
});

export const {
  useListAuditEventsQuery,
  useCreateAuditEventMutation,
  useListAuditExportsQuery,
  useCreateAuditExportMutation,
  useListAuditAnomaliesQuery,
  useCreateAuditAnomalyMutation,
} = auditApi;
