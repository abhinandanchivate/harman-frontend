import { baseApi } from './baseApi';

export const patientsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listPatients: build.query({
      query: (params) => ({
        url: 'v1/patients/',
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
              ...result.map((patient) => ({ type: 'Patient', id: patient.id })),
              { type: 'Patient', id: 'LIST' },
            ]
          : [{ type: 'Patient', id: 'LIST' }],
    }),
    getPatient: build.query({
      query: (id) => ({
        url: `v1/patients/${id}/`,
      }),
      providesTags: (result, error, id) => [{ type: 'Patient', id }],
    }),
    createPatient: build.mutation({
      query: (body) => ({
        url: 'v1/patients/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Patient', id: 'LIST' }],
    }),
    updatePatient: build.mutation({
      query: ({ id, ...body }) => ({
        url: `v1/patients/${id}/`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Patient', id },
        { type: 'Patient', id: 'LIST' },
      ],
    }),
    deletePatient: build.mutation({
      query: (id) => ({
        url: `v1/patients/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Patient', id: 'LIST' }],
    }),
    searchPatients: build.query({
      query: (params) => ({
        url: 'v1/patients/search/',
        params,
      }),
      providesTags: [{ type: 'Patient', id: 'LIST' }],
    }),
    mergePatient: build.mutation({
      query: ({ sourceId, targetId, ...body }) => ({
        url: `v1/patients/${sourceId}/merge/${targetId}/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Patient', id: 'LIST' }],
    }),
    exportPatient: build.mutation({
      query: ({ id, ...params }) => ({
        url: `v1/patients/${id}/export/`,
        method: 'GET',
        params,
      }),
    }),
  }),
});

export const {
  useListPatientsQuery,
  useGetPatientQuery,
  useCreatePatientMutation,
  useUpdatePatientMutation,
  useDeletePatientMutation,
  useSearchPatientsQuery,
  useMergePatientMutation,
  useExportPatientMutation,
} = patientsApi;
