import { baseApi } from './baseApi';

export const appointmentsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listAppointments: build.query({
      query: (params) => ({
        url: 'v1/appointments/',
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
              ...result.map((item) => ({ type: 'Appointment', id: item.id })),
              { type: 'Appointment', id: 'LIST' },
            ]
          : [{ type: 'Appointment', id: 'LIST' }],
    }),
    getAppointment: build.query({
      query: (id) => ({
        url: `v1/appointments/${id}/`,
      }),
      providesTags: (result, error, id) => [{ type: 'Appointment', id }],
    }),
    createAppointment: build.mutation({
      query: (body) => ({
        url: 'v1/appointments/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Appointment', id: 'LIST' }],
    }),
    updateAppointment: build.mutation({
      query: ({ id, ...body }) => ({
        url: `v1/appointments/${id}/`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Appointment', id },
        { type: 'Appointment', id: 'LIST' },
      ],
    }),
    deleteAppointment: build.mutation({
      query: (id) => ({
        url: `v1/appointments/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Appointment', id: 'LIST' }],
    }),
    getAvailability: build.query({
      query: (params) => ({
        url: 'v1/appointments/availability/',
        params,
      }),
      providesTags: [{ type: 'Appointment', id: 'LIST' }],
    }),
    joinWaitlist: build.mutation({
      query: ({ appointmentId, ...body }) => ({
        url: `v1/appointments/${appointmentId}/waitlist/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Waitlist', id: 'LIST' }],
    }),
    listWaitlist: build.query({
      query: (params) => ({
        url: 'v1/waitlist/',
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
              ...result.map((entry) => ({ type: 'Waitlist', id: entry.id })),
              { type: 'Waitlist', id: 'LIST' },
            ]
          : [{ type: 'Waitlist', id: 'LIST' }],
    }),
  }),
});

export const {
  useListAppointmentsQuery,
  useGetAppointmentQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
  useGetAvailabilityQuery,
  useJoinWaitlistMutation,
  useListWaitlistQuery,
} = appointmentsApi;
