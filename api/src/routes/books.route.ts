// MODULE IMPORTS
import { Request, Response, Router } from 'express'
import { Schema, model } from 'mongoose'
import * as z from 'zod/v4'

// VALIDATION FOR BOOKS
const newBookValidation = z.strictObject({
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

// BOOK DEFINITION
type TBook = z.infer<typeof newBookValidation>

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
const MBook = model('Book', bookSchema)

// ROUTERS
const bookRouter = Router()
const booksRouter = Router()

// CREATE A NEW BOOK
bookRouter.route('/stock').post(async function (req: Request, res: Response) {
  const newBook = newBookValidation.safeParse(req.body)

  if (!newBook.success) {
    throw newBook.error
  }

  const bookCreated = await MBook.create(newBook.data)

  res.status(201).json({
    success: true,
    message: `${bookCreated.title}`,
    data: bookCreated
  })
})

// EXPORT ROUTES
export { bookRouter, booksRouter }
