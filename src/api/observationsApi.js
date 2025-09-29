import { baseApi } from './baseApi';

export const observationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listObservations: build.query({
      query: (params) => ({
        url: 'v1/observations/',
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
              ...result.map((item) => ({ type: 'Observation', id: item.id })),
              { type: 'Observation', id: 'LIST' },
            ]
          : [{ type: 'Observation', id: 'LIST' }],
    }),
    getObservation: build.query({
      query: (id) => ({
        url: `v1/observations/${id}/`,
      }),
      providesTags: (result, error, id) => [{ type: 'Observation', id }],
    }),
    createObservation: build.mutation({
      query: (body) => ({
        url: 'v1/observations/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Observation', id: 'LIST' }],
    }),
    updateObservation: build.mutation({
      query: ({ id, ...body }) => ({
        url: `v1/observations/${id}/`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Observation', id },
        { type: 'Observation', id: 'LIST' },
      ],
    }),
    deleteObservation: build.mutation({
      query: (id) => ({
        url: `v1/observations/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Observation', id: 'LIST' }],
    }),
    getObservationTrends: build.query({
      query: ({ patientId, ...params }) => ({
        url: `v1/observations/${patientId}/trends/`,
        params,
      }),
      providesTags: [{ type: 'Observation', id: 'LIST' }],
    }),
    configureAlert: build.mutation({
      query: (body) => ({
        url: 'v1/observations/alerts/configure/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Observation', id: 'LIST' }],
    }),
  }),
});

export const {
  useListObservationsQuery,
  useGetObservationQuery,
  useCreateObservationMutation,
  useUpdateObservationMutation,
  useDeleteObservationMutation,
  useGetObservationTrendsQuery,
  useConfigureAlertMutation,
} = observationsApi;
