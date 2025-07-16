// MODULE IMPORTS
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
]

// BOOK VALIDATION
export const bookDataValidation = z.strictObject({
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
  available: z.coerce.boolean(),
  imageURI: z.string().optional()
})

// NEW BOOK TYPE
export type TBookNew = Omit<
  z.infer<typeof bookDataValidation>,
  'copies' | 'available'
> & { copies: unknown; available: unknown }

// UPDATE BOOK TYPE
export type TBookUpdate = Partial<TBookNew>
