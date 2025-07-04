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
      .map(function (word) {
        if (word.includes('.')) {
          return word
            .split('.')
            .map(function (word) {
              return word.charAt(0).toUpperCase() + word.slice(1)
            })
            .join('.')
        }

        return word.charAt(0).toUpperCase() + word.slice(1)
      })
      .join(' ')
  }),
  genre: z
    .enum([
      'Fiction',
      'Non-fiction',
      'Science',
      'History',
      'Biography',
      'Fantasy',
      'Uncategorized'
    ])
    .default('Uncategorized'),
  isbn: z.string().transform(function (isbn) {
    return isbn.replace(/[-\s]/g, '')
  }),
  description: z.string(),
  copies: z.number().min(0),
  available: z.boolean(),
  imageURI: z.string().optional()
})

// BOOK QUERY VALIDATION
export const bookFiltersValidation = z.strictObject({
  title: z.string().optional(),
  author: z.string().optional(),
  genre: z
    .enum([
      'Fiction',
      'Non-fiction',
      'Science',
      'History',
      'Biography',
      'Fantasy',
      'Uncategorized'
    ])
    .optional(),
  available: z
    .enum(['true', 'false'])
    .transform(function (val) {
      return val === 'true'
    })
    .optional(),
  sortBy: z.enum(['asc', 'desc']).default('desc'),
  resultsPerPage: z
    .enum(['10', '20', '50', '100'])
    .default('10')
    .transform(function (val) {
      return Number(val)
    }),
  page: z
    .string()
    .default('1')
    .transform(function (val) {
      return Number(val)
    })
})

// BOOK TYPE
export type TBook = z.infer<typeof bookDataValidation>

// FILTER TYPE
export type TFilter = z.infer<typeof bookFiltersValidation>

// BOOK SCHEMA
const bookSchema = new Schema<TBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: {
      type: String,
      enum: [
        'Fiction',
        'Non-fiction',
        'Science',
        'History',
        'Biography',
        'Fantasy',
        'Uncategorized'
      ],
      required: true,
      default: 'Uncategorized'
    },
    isbn: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    copies: { type: Number, required: true, min: 0 },
    available: { type: Boolean, required: true },
    imageURI: { type: String }
  },
  {
    timestamps: true
  }
)

// MIDDLEWARE
bookSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate() as Partial<TBook>

  if (update?.copies !== undefined) {
    update.available = update.copies > 0
    this.setUpdate(update)
  }

  next()
})

// BOOK MODEL
export const MBook = model('Book', bookSchema)
