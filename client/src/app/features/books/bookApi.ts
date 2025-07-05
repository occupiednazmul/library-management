// MODULE IMPORTS
import { baseApi } from '@/app/features/api/baseApi'
import { z } from 'zod/v4'

// GENRES
export const genres = [
  'Fiction',
  'Non-fiction',
  'Science',
  'History',
  'Biography',
  'Fantasy',
  'Uncategorized'
] as const

// SCHEMA
export const bookSchema = z.strictObject({
  title: z.string(),
  author: z.string().transform(function (author) {
    return author
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .split(' ')
      .map(function (word) {
        if (word.includes('.')) {
          return word
            .split('.')
            .map(function (word) {
              return word.charAt(0).toUpperCase() + word.slice(1)
            })
            .join('.')
        }

        return word.charAt(0).toUpperCase() + word.slice(1)
      })
      .join(' ')
  }),
  genre: z.enum(genres),
  isbn: z.string().transform(function (isbn) {
    return isbn.replace(/[-\s]/g, '')
  }),
  description: z.string(),
  copies: z.coerce.number().min(0),
  available: z.boolean(),
  imageURI: z.string().optional()
})

// BOOK TYPE
export type TBook = z.infer<typeof bookSchema>

export const booksApi = baseApi.injectEndpoints({
  endpoints: build => ({
    createBook: build.mutation<TBook, Partial<TBook>>({
      query: bookData => ({
        url: '/books',
        method: 'POST',
        body: bookData
      }),
      invalidatesTags: ['Books']
    }),

    getBooks: build.query<TBook[], void>({
      query: () => '/books',
      providesTags: ['Books']
    })
  })
})

export const { useCreateBookMutation, useGetBooksQuery } = booksApi
