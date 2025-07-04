import { model, Schema, Types } from 'mongoose'
import { z } from 'zod/v4'

// BORROW VALIDATION
export const borrowDataValidation = z.strictObject({
  book: z.string(),
  quantity: z.number().min(1),
  dueDate: z.date()
})

// BORROW TYPE
type TBorrow = { bookId: Types.ObjectId } & Omit<
  z.infer<typeof borrowDataValidation>,
  'bookId'
>

// BORROW SCHEMA
const borrowSchema = new Schema<TBorrow>(
  {
    bookId: { type: Schema.Types.ObjectId, required: true, ref: 'Book' },
    quantity: { type: Number, required: true, min: 1 },
    dueDate: { type: Date, required: true }
  },
  { timestamps: true }
)

// BORROW MODEL
export const MBorrow = model('Borrow', borrowSchema)
