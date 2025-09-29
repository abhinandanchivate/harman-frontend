import { baseApi } from './baseApi';

export const rolesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listRoles: build.query({
      query: () => ({
        url: 'v1/admin/roles/',
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
              ...result.map((role) => ({ type: 'Role', id: role.id })),
              { type: 'Role', id: 'LIST' },
            ]
          : [{ type: 'Role', id: 'LIST' }],
    }),
    getRole: build.query({
      query: (id) => ({
        url: `v1/admin/roles/${id}/`,
      }),
      providesTags: (result, error, id) => [{ type: 'Role', id }],
    }),
    createRole: build.mutation({
      query: (body) => ({
        url: 'v1/admin/roles/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Role', id: 'LIST' }],
    }),
    updateRole: build.mutation({
      query: ({ id, ...body }) => ({
        url: `v1/admin/roles/${id}/`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Role', id },
        { type: 'Role', id: 'LIST' },
      ],
    }),
    deleteRole: build.mutation({
      query: (id) => ({
        url: `v1/admin/roles/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Role', id: 'LIST' }],
    }),
  }),
});

export const {
  useListRolesQuery,
  useGetRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = rolesApi;
