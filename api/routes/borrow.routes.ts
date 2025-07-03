// MODULE IMPORTS
import { Request, Response, Router } from 'express'
import { Schema, Types, model } from 'mongoose'
import * as z from 'zod/v4'

// BORROW VALIDATION
const newBorrowValidation = z.strictObject({
  bookId: z.string(),
  quantity: z.number().min(1),
  dueDate: z.date()
})

// BOOK DEFINITION
type TBorrow = { bookId: Types.ObjectId } & Omit<
  z.infer<typeof newBorrowValidation>,
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
const MBorrow = model('Borrow', borrowSchema)

// ROUTERS
const borrowRouter = Router()
const userRouter = Router()

// EXPORT ROUTES
export { borrowRouter, userRouter }
