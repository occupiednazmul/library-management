import { model, Schema, Types } from 'mongoose'
import { z } from 'zod/v4'

// BORROW VALIDATION
export const borrowDataValidation = z.strictObject({
  book: z.string(),
  quantity: z.number().min(1),
  dueDate: z.string().transform(function (val) {
    return new Date(val)
  })
})

// BORROW TYPE
export type TBorrow = { book: Types.ObjectId } & Omit<
  z.infer<typeof borrowDataValidation>,
  'book'
>

// BORROW SCHEMA
const borrowSchema = new Schema<TBorrow>(
  {
    book: { type: Schema.Types.ObjectId, required: true, ref: 'Book' },
    quantity: { type: Number, required: true, min: 1 },
    dueDate: { type: Date, required: true }
  },
  { timestamps: true }
)

// BORROW MODEL
export const MBorrow = model('Borrow', borrowSchema)
