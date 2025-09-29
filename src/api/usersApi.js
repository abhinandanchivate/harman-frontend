import { baseApi } from './baseApi';

export const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listUsers: build.query({
      query: () => ({
        url: 'auth/me/',
      }),
      transformResponse: (response) => [response],
      providesTags: (result) =>
        result
          ? [
              ...result.map((user) => ({ type: 'User', id: user.id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),
    createUser: build.mutation({
      query: (payload) => ({
        url: 'auth/register/',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    assignRoles: build.mutation({
      query: (payload) => ({
        url: 'admin/users/assign-role/',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }, { type: 'Role', id: 'LIST' }],
    }),
  }),
});

export const {
  useListUsersQuery,
  useCreateUserMutation,
  useAssignRolesMutation,
} = usersApi;
