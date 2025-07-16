// MODULE IMPORTS
import { z } from 'zod/v4'

// BORROW VALIDATION
export const borrowDataValidation = z.strictObject({
  book: z.string(),
  quantity: z.number().min(1),
  dueDate: z.date()
})

// BORRO TYPE
export type TBorrow = z.infer<typeof borrowDataValidation>
