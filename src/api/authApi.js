import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (credentials) => ({
        url: 'auth/login/',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    refresh: build.mutation({
      query: (body) => ({
        url: 'auth/refresh/',
        method: 'POST',
        body,
      }),
    }),
    me: build.query({
      query: () => ({
        url: 'auth/me/',
      }),
      providesTags: ['Auth', 'User'],
    }),
    register: build.mutation({
      query: (body) => ({
        url: 'auth/register/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRefreshMutation,
  useMeQuery,
  useRegisterMutation,
} = authApi;
