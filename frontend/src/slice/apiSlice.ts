import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "https://jsonplaceholder.typicode.com" }),
  endpoints: (builder) => ({
    getUsers: builder.query<any[], void>({
      query: () => "/users",
      keepUnusedDataFor: 600,
    }),
  }),
});

export const { useGetUsersQuery } = apiSlice;
export default apiSlice;
