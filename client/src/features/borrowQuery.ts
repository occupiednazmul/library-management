// MODULE IMPORTS
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// LOCAL IMPORTS
import { type TBorrow } from '../validations/borrow.validation'
import type { TBookNew } from '../validations/books.validations'

// API RESPONSE TYPES
export type TBorrowResponse<T> = {
  success: boolean
  message: string
  data?: T
  error?: unknown
}

export type TBorrowedBook = {
  totalQuantity: number
  book: Pick<TBookNew, 'title' | 'isbn' | 'imageURI'>
}

export type TBorrowSummary = TBorrowResponse<Array<TBorrowedBook>>

// API SLICES
export const borrowApi = createApi({
  reducerPath: 'borrowApi',
  baseQuery: fetchBaseQuery({
    baseUrl:
      import.meta.env.VERCEL_ENV === 'production'
        ? '/api/'
        : 'http://localhost:3000/api/'
  }),
  tagTypes: ['Borrow'],
  endpoints: function (builder) {
    return {
      borrowSummary: builder.query<TBorrowSummary, void>({
        query: function () {
          return 'borrow'
        },
        providesTags: ['Borrow']
      }),
      borrowBook: builder.mutation<TBorrowResponse<TBorrow>, TBorrow>({
        query: function (borrowData) {
          return { url: 'borrow', method: 'POST', body: borrowData }
        },
        invalidatesTags: ['Borrow']
      })
    }
  }
})

// EXPORTS
export const { useBorrowSummaryQuery, useBorrowBookMutation } = borrowApi
