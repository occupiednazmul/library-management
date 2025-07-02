// MODULE IMPORTS
import { Schema, Types, model } from 'mongoose'

// LOCAL IMPORTS
import { TCollection } from '../validations/collection.validation.js'

// COLLECTION SCHEMA
const collectionSchema = new Schema<
  { borrowId: Types.ObjectId; bookId: Types.ObjectId } & Omit<
    TCollection,
    'borrowId' | 'bookId'
  >
>(
  {
    borrowId: { type: Schema.Types.ObjectId, required: true, ref: 'Borrow' },
    bookId: { type: Schema.Types.ObjectId, required: true, ref: 'Book' },
    type: {
      type: String,
      required: true,
      enum: ['borrowing fee', 'late fee'],
      default: 'borrowing fee'
    },
    amount: { type: Number, required: true, min: 10 }
  },
  { timestamps: true }
)

// COLLECTION MODEL
export const MCollection = model('Collection', collectionSchema)
