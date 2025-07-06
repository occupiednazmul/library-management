// MODULE IMPORTS
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// LOCAL IMPORTS
import type { TBookNew, TBookUpdate } from '../validations/books.validations'

// DATABASE BOOK TYPE
type TBookDb = TBookNew & {
  _id: string
  createdAt: string
  updatedAt: string
}

// API RESPONSE TYPE
type TServerResponse<T> = {
  success: boolean
  message: string
  data?: T
  error?: unknown
}

// API SLICES
export const booksApi = createApi({
  reducerPath: 'booksApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/' }),
  tagTypes: ['Books'],
  endpoints: function (builder) {
    return {
      getBook: builder.query<TServerResponse<TBookDb>, string>({
        query: function (id) {
          return `books/${id}`
        },
        providesTags: function (result, error, id) {
          return [{ type: 'Books', id }]
        }
      }),
      getBooks: builder.query<TBookNew, void>({
        query: function () {
          return 'books'
        },
        providesTags: ['Books']
      }),
      createBook: builder.mutation<TServerResponse<TBookDb>, TBookUpdate>({
        query: function (newBook) {
          return { url: 'books', method: 'POST', body: newBook }
        },
        invalidatesTags: ['Books']
      }),
      updateBook: builder.mutation<
        TServerResponse<TBookDb>,
        { id: string; updatedBook: TBookUpdate }
      >({
        query: function ({ id, updatedBook }) {
          return { url: `books/${id}`, method: 'PUT', body: updatedBook }
        },
        invalidatesTags: function (result, error, { id }) {
          return [{ type: 'Books', id }]
        }
      })
    }
  }
})

export const {
  useGetBookQuery,
  useGetBooksQuery,
  useCreateBookMutation,
  useUpdateBookMutation
} = booksApi
