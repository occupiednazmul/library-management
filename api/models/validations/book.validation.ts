// MODULE IMPORTS
import * as z from 'zod/v4'

// VALIDATION FOR NEW BOOK
export const newBookValidation = z.strictObject({
  title: z.string(),
  author: z.string(),
  genre: z.string().default('Uncategorized'),
  isbn: z.string(),
  description: z.string(),
  copies: z.number().min(0),
  available: z.boolean(),
  imageURI: z.string().optional()
})

// TYPE OF BOOK
export type TBook = z.infer<typeof newBookValidation>
