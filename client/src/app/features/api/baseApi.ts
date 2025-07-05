// MODULE IMPORTS
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// BASE API
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Books', 'Borrows'],
  endpoints: () => ({})
})
