import { baseApi } from './baseApi';

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listTemplates: build.query({
      query: () => ({
        url: 'v1/notifications/templates/',
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
              ...result.map((item) => ({ type: 'NotificationTemplate', id: item.id })),
              { type: 'NotificationTemplate', id: 'LIST' },
            ]
          : [{ type: 'NotificationTemplate', id: 'LIST' }],
    }),
    createTemplate: build.mutation({
      query: (body) => ({
        url: 'v1/notifications/templates/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'NotificationTemplate', id: 'LIST' }],
    }),
    listCampaigns: build.query({
      query: () => ({
        url: 'v1/notifications/campaigns/',
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
              ...result.map((item) => ({ type: 'NotificationCampaign', id: item.id })),
              { type: 'NotificationCampaign', id: 'LIST' },
            ]
          : [{ type: 'NotificationCampaign', id: 'LIST' }],
    }),
    createCampaign: build.mutation({
      query: (body) => ({
        url: 'v1/notifications/campaigns/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'NotificationCampaign', id: 'LIST' }],
    }),
    listNotifications: build.query({
      query: (params) => ({
        url: 'v1/notifications/',
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
              ...result.map((item) => ({ type: 'Notification', id: item.id })),
              { type: 'Notification', id: 'LIST' },
            ]
          : [{ type: 'Notification', id: 'LIST' }],
    }),
    createNotification: build.mutation({
      query: (body) => ({
        url: 'v1/notifications/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
    }),
  }),
});

export const {
  useListTemplatesQuery,
  useCreateTemplateMutation,
  useListCampaignsQuery,
  useCreateCampaignMutation,
  useListNotificationsQuery,
  useCreateNotificationMutation,
} = notificationsApi;
