// MODULE IMPORTS
import * as z from 'zod/v4'

// VALIDATION FOR NEW BORROW
export const newBorrowValidation = z.strictObject({
  bookId: z.string(),
  quantity: z.number().min(1),
  dueDate: z.date()
})

// TYPE OF BOOK
export type TBorrow = z.infer<typeof newBorrowValidation>
