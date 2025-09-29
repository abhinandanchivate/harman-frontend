import { baseApi } from './baseApi';

export const hl7Api = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listMessages: build.query({
      query: (params) => ({
        url: 'v1/hl7-parser/',
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
              ...result.map((item) => ({ type: 'HL7', id: item.id })),
              { type: 'HL7', id: 'LIST' },
            ]
          : [{ type: 'HL7', id: 'LIST' }],
    }),
    getMessage: build.query({
      query: (id) => ({
        url: `v1/hl7-parser/${id}/`,
      }),
      providesTags: (result, error, id) => [{ type: 'HL7', id }],
    }),
    ingestMessage: build.mutation({
      query: (body) => ({
        url: 'v1/hl7-parser/ingest/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'HL7', id: 'LIST' }],
    }),
    getParseStatus: build.query({
      query: (messageId) => ({
        url: `v1/hl7-parser/parse-status/${messageId}/`,
      }),
      providesTags: (result, error, messageId) => [{ type: 'HL7', id: messageId }],
    }),
    createBatch: build.mutation({
      query: (body) => ({
        url: 'v1/hl7-parser/batch/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'HL7', id: 'LIST' }],
    }),
  }),
});

export const {
  useListMessagesQuery,
  useGetMessageQuery,
  useIngestMessageMutation,
  useGetParseStatusQuery,
  useCreateBatchMutation,
} = hl7Api;
