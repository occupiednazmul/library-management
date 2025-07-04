import { model, Schema, Types } from 'mongoose'
import { z } from 'zod/v4'

// BOOK VALIDATION
export const bookDataValidation = z.strictObject({
  title: z.string(),
  author: z.string().transform(function (author) {
    return author
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }),
  genre: z.string().default('Uncategorized'),
  isbn: z.string().transform(function (isbn) {
    return isbn.replace(/[-\s]/g, '')
  }),
  description: z.string(),
  copies: z.number().min(0),
  available: z.boolean(),
  imageURI: z.string().optional()
})

// BOOK TYPE
type TBook = z.infer<typeof bookDataValidation>

// BOOK SCHEMA
const bookSchema = new Schema<TBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true, default: 'Uncategorized' },
    isbn: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    copies: { type: Number, required: true, min: 0 },
    available: { type: Boolean, required: true },
    imageURI: { type: String }
  },
  { timestamps: true }
)

// BOOK MODEL
export const MBook = model('Book', bookSchema)
