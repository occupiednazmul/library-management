// MODULE IMPORTS
import { NextFunction, Request, Response, Router } from 'express'

// LOCAL IMPORTS
import {
  MBook,
  TBook,
  TFilter,
  bookDataValidation,
  bookFiltersValidation
} from '../models/books.model.js'
import { ControllerError, responseCodes } from '../utilities/global.handlers.js'

// BOOKS ROUTERS
const booksRouter = Router()

// PATH - /api/books
booksRouter
  .route('/')
  .get(async function (req: Request, res: Response) {
    const bookQueryFilters = bookFiltersValidation.safeParse(req.query)

    if (!bookQueryFilters.success) {
      throw {
        code: responseCodes.BAD_REQUEST,
        message: `Mismatch query filters.`
      }
    }

    const filters: Record<any, any> = {}

    Object.keys(bookQueryFilters.data).forEach(function (key) {
      if (!['sortBy', 'resultsPerPage', 'page'].includes(key)) {
        filters[key] = bookQueryFilters.data[key as keyof TFilter]
      }
    })

    const { sortBy, resultsPerPage, page } = bookQueryFilters.data

    const books = await MBook.find(filters, {})
      .sort({ createdAt: sortBy })
      .limit(resultsPerPage)
      .skip((page - 1) * resultsPerPage)

    const booksCount = await MBook.countDocuments(filters)

    res.json({
      success: true,
      booksCount: booksCount,
      message: `${books.length} book${books.length === 1 ? '' : 's'} provided.`,
      data: books
    })
  })
  .post(async function (req: Request, res: Response, next: NextFunction) {
    const newBook = bookDataValidation.safeParse(req.body)

    if (!newBook.success) {
      throw newBook.error
    }

    try {
      const [bookCreated] = await MBook.create([newBook.data])

      res.status(responseCodes.CREATED).json({
        success: true,
        message: `'${bookCreated.title}' listed.`,
        data: bookCreated
      })
    } catch (error) {
      if (
        (error as ControllerError).name === 'MongoServerError' &&
        (error as ControllerError).code === 11000
      ) {
        next({
          name: 'MongoServerError',
          code: 11000,
          message: `Book with ISBN: ${newBook.data.isbn} already exists!`
        })
      } else {
        next(error)
      }
    }
  })
  .all(function (req: Request, res: Response) {
    throw Error(responseCodes.METHOD_NOT_ALLOWED.toString())
  })

// PATH - /api/books/author
booksRouter
  .route('/authors')
  .get(async function (req: Request, res: Response, next: NextFunction) {
    try {
      const authors = (
        (await MBook.aggregate([
          {
            $group: {
              _id: '$author'
            }
          }
        ])) as Array<{ _id: string }>
      ).map(function (item) {
        return item._id
      })

      res.json({
        success: true,
        message: `${authors.length} author${
          authors.length === 1 ? '' : 's'
        } found.`,
        data: authors
      })
    } catch (error) {
      next(error)
    }
  })
  .all(function (req: Request, res: Response) {
    throw Error(responseCodes.METHOD_NOT_ALLOWED.toString())
  })

// PATH - /api/books/latest
booksRouter
  .route('/latest')
  .get(async function (req, res) {
    const books = await MBook.find({}, {}).sort({ createdAt: -1 }).limit(5)

    res.json({
      success: true,
      message: `Latest books`,
      data: books
    })
  })
  .all(function () {
    throw Error(responseCodes.METHOD_NOT_ALLOWED.toString())
  })

// PATH - /api/books/:bookId
booksRouter
  .route('/:bookId')
  .get(async function (req: Request, res: Response, next: NextFunction) {
    const { bookId } = req.params

    try {
      const book = (await MBook.findById(bookId)) as TBook

      res.json({
        success: true,
        message: `${book.title} found.`,
        data: book
      })
    } catch (error) {
      if ((error as ControllerError).name === 'CastError') {
        next({
          code: responseCodes.NOT_FOUND,
          message: `Book with bookId: ${bookId} not found!`
        })
      } else {
        next(error)
      }
    }
  })
  .put(async function (req: Request, res: Response, next: NextFunction) {
    const { bookId } = req.params

    const contentsToUpdate = bookDataValidation.partial().safeParse(req.body)

    if (!contentsToUpdate.success) {
      throw contentsToUpdate.error
    }

    try {
      const bookUpdated = (await MBook.findByIdAndUpdate(
        bookId,
        contentsToUpdate.data,
        { new: true }
      )) as TBook

      res.json({
        success: true,
        message: `${bookUpdated.title} updated.`,
        data: bookUpdated
      })
    } catch (error) {
      if ((error as ControllerError).name === 'CastError') {
        next({
          code: responseCodes.NOT_FOUND,
          message: `Book with bookId: ${bookId} not found!`
        })
      } else {
        next(error)
      }
    }
  })
  .delete(async function (req: Request, res: Response, next: NextFunction) {
    const { bookId } = req.params

    try {
      const deletedBook = await MBook.findByIdAndDelete(bookId)

      if (deletedBook) {
        res.json({
          success: true,
          message: `Book with bookId: ${bookId} deleted.`,
          data: {}
        })
      }
    } catch (error) {
      if ((error as ControllerError).name === 'CastError') {
        next({
          code: responseCodes.NOT_FOUND,
          message: `Book with bookId: ${bookId} not found!`
        })
      } else {
        next(error)
      }
    }
  })
  .all(function (req: Request, res: Response) {
    throw Error(responseCodes.METHOD_NOT_ALLOWED.toString())
  })

// EXPORT ROUTE
export default booksRouter
