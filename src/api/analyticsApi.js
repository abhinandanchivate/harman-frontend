import { baseApi } from './baseApi';

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listRiskScores: build.query({
      query: (params) => ({
        url: 'v1/analytics/risk-scores/',
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
              ...result.map((item) => ({ type: 'RiskScore', id: item.id })),
              { type: 'RiskScore', id: 'LIST' },
            ]
          : [{ type: 'RiskScore', id: 'LIST' }],
    }),
    createRiskScore: build.mutation({
      query: (body) => ({
        url: 'v1/analytics/risk-scores/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'RiskScore', id: 'LIST' }],
    }),
    listTrainingJobs: build.query({
      query: (params) => ({
        url: 'v1/analytics/training-jobs/',
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
              ...result.map((item) => ({ type: 'TrainingJob', id: item.id })),
              { type: 'TrainingJob', id: 'LIST' },
            ]
          : [{ type: 'TrainingJob', id: 'LIST' }],
    }),
    createTrainingJob: build.mutation({
      query: (body) => ({
        url: 'v1/analytics/training-jobs/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'TrainingJob', id: 'LIST' }],
    }),
    listModelVersions: build.query({
      query: (params) => ({
        url: 'v1/analytics/model-versions/',
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
              ...result.map((item) => ({ type: 'ModelVersion', id: item.id })),
              { type: 'ModelVersion', id: 'LIST' },
            ]
          : [{ type: 'ModelVersion', id: 'LIST' }],
    }),
    createModelVersion: build.mutation({
      query: (body) => ({
        url: 'v1/analytics/model-versions/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'ModelVersion', id: 'LIST' }],
    }),
    listPersonalizedAlerts: build.query({
      query: (params) => ({
        url: 'v1/analytics/alerts/',
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
              ...result.map((item) => ({ type: 'PersonalizedAlert', id: item.id })),
              { type: 'PersonalizedAlert', id: 'LIST' },
            ]
          : [{ type: 'PersonalizedAlert', id: 'LIST' }],
    }),
    createPersonalizedAlert: build.mutation({
      query: (body) => ({
        url: 'v1/analytics/alerts/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'PersonalizedAlert', id: 'LIST' }],
    }),
  }),
});

export const {
  useListRiskScoresQuery,
  useCreateRiskScoreMutation,
  useListTrainingJobsQuery,
  useCreateTrainingJobMutation,
  useListModelVersionsQuery,
  useCreateModelVersionMutation,
  useListPersonalizedAlertsQuery,
  useCreatePersonalizedAlertMutation,
} = analyticsApi;
