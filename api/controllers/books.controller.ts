// MODULE IMPORTS
import { Request, Response, Router } from 'express'

// LOCAL IMPORTS
import { MBook, bookDataValidation } from '../models/books.model.js'
import { responseCodes } from '../utilities/global.handlers.js'

// BOOKS ROUTERS
const booksRouter = Router()

// PATH - /api/books
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
  .post(async function (req: Request, res: Response) {
    const newBook = bookDataValidation.safeParse(req.body)

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

// PATH - /api/books/:bookId
booksRouter
  .route('/:bookId')
  .get(async function (req: Request, res: Response) {
    const { bookId } = req.params

    const book = await MBook.findById(bookId)

    if (book) {
      res.json({
        success: true,
        message: `${book.title} found.`,
        data: book
      })

      return
    }

    res.status(responseCodes.NOT_FOUND).json({
      success: false,
      message: `No book found with bookId: ${bookId}`,
      error: {
        message: `No book found with bookId: ${bookId}`
      }
    })
  })
  .put(async function (req: Request, res: Response) {
    const { bookId } = req.params

    const contentsToUpdate = bookDataValidation.partial().safeParse(req.body)

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
  .delete(async function (req: Request, res: Response) {
    const { bookId } = req.params

    const deletedBook = await MBook.findByIdAndDelete(bookId)

    if (deletedBook) {
      res.json({
        success: true,
        message: `Book with bookId: ${bookId} deleted.`,
        data: {}
      })

      return
    }

    throw Error(responseCodes.BAD_REQUEST.toString())
  })
  .all(function (req: Request, res: Response) {
    throw Error(responseCodes.METHOD_NOT_ALLOWED.toString())
  })

// EXPORT ROUTE
export default booksRouter
