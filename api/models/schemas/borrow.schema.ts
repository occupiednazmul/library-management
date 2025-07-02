// MODULE IMPORTS
import { Schema, Types, model } from 'mongoose'

// LOCAL IMPORTS
import { TBorrow } from '../validations/borrow.validation.js'

// BORROW SCHEMA
const borrowSchema = new Schema<
  { bookId: Types.ObjectId } & Omit<TBorrow, 'bookId'>
>(
  {
    bookId: { type: Schema.Types.ObjectId, required: true, ref: 'Book' },
    quantity: { type: Number, required: true, min: 1 },
    dueDate: { type: Date, required: true }
  },
  { timestamps: true }
)

// BORROW MODEL
export const MBorrow = model('Borrow', borrowSchema)
