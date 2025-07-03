// MODULE IMPORTS
import { Request, Response, Router } from 'express'
import { Schema, Types, model } from 'mongoose'
import * as z from 'zod/v4'
import { responseCodes } from './index.js'

// VALIDATIONS
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
}) // book validation

const newBorrowValidation = z.strictObject({
  quantity: z.number().min(1),
  dueDate: z.date()
}) // borrow validation

// DEFINITIONS
type TBook = z.infer<typeof newBookValidation> // book definition

type TBorrow = { bookId: Types.ObjectId } & Omit<
  z.infer<typeof newBorrowValidation>,
  'bookId'
> // borrow definition

// SCHEMAS
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
) // book schema

const borrowSchema = new Schema<TBorrow>(
  {
    bookId: { type: Schema.Types.ObjectId, required: true, ref: 'Book' },
    quantity: { type: Number, required: true, min: 1 },
    dueDate: { type: Date, required: true }
  },
  { timestamps: true }
) // borrow schema

// MODELS
const MBook = model('Book', bookSchema) // book model
const MBorrow = model('Borrow', borrowSchema) // borrow model

// ROUTERS
const bookRouter = Router()
const booksRouter = Router()

// CREATE A NEW BOOK
bookRouter
  .route('/new')
  .post(async function (req: Request, res: Response) {
    const newBook = newBookValidation.safeParse(req.body)

    if (!newBook.success) {
      throw newBook.error
    }

    const bookCreated = await MBook.create(newBook.data)

    res.status(201).json({
      success: true,
      message: `${bookCreated.title} stocked.`,
      data: bookCreated
    })
  })
  .all(function (req: Request, res: Response) {
    throw Error(responseCodes.METHOD_NOT_ALLOWED.toString())
  })

// UPDATE EXISTING BOOK
bookRouter
  .route('/:bookId')
  .patch(async function (req: Request, res: Response) {
    const { bookId } = req.params

    const contentsToUpdate = newBookValidation.partial().safeParse(req.body)

    if (!contentsToUpdate.success) {
      throw contentsToUpdate.error
    }

    const bookUpdated = await MBook.findByIdAndUpdate(
      bookId,
      contentsToUpdate,
      { new: true }
    )

    res.json({
      success: true,
      message: `${bookUpdated?.title} updated.`,
      data: bookUpdated
    })
  })
  .all(function (req: Request, res: Response) {
    throw Error(responseCodes.METHOD_NOT_ALLOWED.toString())
  })

// BORROW A BOOK
bookRouter
  .route('/:bookId/borrow')
  .get(function (req: Request, res: Response) {
    res.json({
      success: true,
      message: 'testing',
      data: {
        message: `building this route`
      }
    })
  })
  .put(async function (req: Request, res: Response) {
    console.log(`BOOK_BORROW_REQUEST`, req.params)

    res.status(201).json({
      success: true,
      message: 'testing',
      data: {
        message: `building this route`
      }
    })
  })
  .all(function (req: Request, res: Response) {
    throw Error(responseCodes.METHOD_NOT_ALLOWED.toString())
  })

// GET BOOKS
booksRouter
  .route('/')
  .get(async function (req: Request, res: Response) {
    console.log(`BOOK_SEARCH_QUERIES`, req.query)

    const books = await MBook.find()

    res.json({
      success: true,
      message: `${books.length} book${books.length === 1 ? '' : 's'} found.`,
      data: books
    })
  })
  .all(function (req: Request, res: Response) {
    throw Error(responseCodes.METHOD_NOT_ALLOWED.toString())
  })

// GET BORROW SUMMARY
booksRouter
  .route('/borrow-summary')
  .get(function (req: Request, res: Response) {
    res.json({
      success: true,
      message: 'testing',
      data: {
        message: `building this route`
      }
    })
  })
  .all(function (req: Request, res: Response) {
    throw Error(responseCodes.METHOD_NOT_ALLOWED.toString())
  })

// EXPORT ROUTES
export { bookRouter, booksRouter }
