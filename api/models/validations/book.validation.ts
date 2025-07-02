// MODULE IMPORTS
import * as z from 'zod/v4'

// VALIDATION FOR NEW BOOK
export const newBookValidation = z.strictObject({
  title: z.string(),
  author: z.string().transform(function (author) {
    return author
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }),
  genre: z.string().default('Uncategorized'),
  isbn: z.string().transform(function (isbn) {
    return isbn.replace(/[-\s]/g, '')
  }),
  description: z.string(),
  copies: z.number().min(0),
  available: z.boolean(),
  imageURI: z.string().optional()
})

// TYPE OF BOOK
export type TBook = z.infer<typeof newBookValidation>
