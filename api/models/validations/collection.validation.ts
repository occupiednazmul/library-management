// MODULE IMPORTS
import * as z from 'zod/v4'

// VALIDATION FOR NEW BORROW
export const newCollectionValidation = z.strictObject({
  borrowId: z.string(),
  bookId: z.string(),
  type: z.enum(['borrowing fee', 'late fee']).default('borrowing fee'),
  amount: z.number().min(10)
})

// TYPE OF BOOK
export type TCollection = z.infer<typeof newCollectionValidation>
