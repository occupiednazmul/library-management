// MODULE IMPORTS
import { Schema, model } from 'mongoose'

// LOCAL IMPORTS
import { TBook } from '../validations/book.validation.js'

// BOOK SCHEMA
const bookSchema = new Schema<TBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true, default: 'Uncategorized' },
    isbn: { type: String, required: true },
    description: { type: String, required: true },
    copies: { type: Number, required: true, min: 0 },
    available: { type: Boolean, required: true },
    imageURI: { type: String }
  },
  { timestamps: true }
)

// BOOK MODEL
export const MBook = model('Book', bookSchema)
