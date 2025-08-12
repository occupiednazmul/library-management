// MODULE IMPORTS
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// LOCAL IMPORTS
import type { TBookNew, TBookUpdate } from '../validations/books.validations'

// DATABASE BOOK TYPE
export type TBookDb = TBookNew & {
  _id: string
  createdAt: string
  updatedAt: string
}

// API RESPONSE TYPE
export type TBookResponse<T> = {
  success: boolean
  message: string
  booksCount?: number
  data?: T
  error?: unknown
}

// API SLICES
export const booksApi = createApi({
  reducerPath: 'booksApi',
  baseQuery: fetchBaseQuery({
    baseUrl:
      import.meta.env.VERCEL_ENV === 'production'
        ? '/api/'
        : 'http://localhost:3000/api/'
  }),
  tagTypes: ['Books'],
  endpoints: function (builder) {
    return {
      getBook: builder.query<TBookResponse<TBookDb>, string>({
        query: function (id) {
          return `books/${id}`
        },
        providesTags: function (_, __, id) {
          return [{ type: 'Books', id }]
        }
      }),
      getBooks: builder.query<
        TBookResponse<Array<TBookDb>>,
        {
          author?: string
          genre?: string
          available?: string
          sortBy?: string
          resultsPerPage?: string
          page?: string
        }
      >({
        query: function (filters = {}) {
          const searchParams = new URLSearchParams()

          Object.entries(filters).forEach(function ([key, value]) {
            if (value !== undefined && value !== '') {
              searchParams.set(key, value)
            }
          })

          return `books?${searchParams.toString()}`
        },
        providesTags: ['Books']
      }),
      createBook: builder.mutation<TBookResponse<TBookDb>, TBookUpdate>({
        query: function (newBook) {
          return { url: 'books', method: 'POST', body: newBook }
        },
        invalidatesTags: ['Books']
      }),
      updateBook: builder.mutation<
        TBookResponse<TBookDb>,
        { id: string; updatedBook: TBookUpdate }
      >({
        query: function ({ id, updatedBook }) {
          return { url: `books/${id}`, method: 'PUT', body: updatedBook }
        },
        invalidatesTags: function (_, __, { id }) {
          return [{ type: 'Books', id }]
        }
      }),
      getAuthors: builder.query<TBookResponse<Array<string>>, void>({
        query: function () {
          return 'books/authors'
        }
      }),
      getLatestBooks: builder.query<TBookResponse<Array<TBookDb>>, void>({
        query: () => `books/latest`,
        providesTags: ['Books']
      })
    }
  }
})

// EXPORTS
export const {
  useGetBookQuery,
  useGetBooksQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useGetAuthorsQuery,
  useGetLatestBooksQuery
} = booksApi
