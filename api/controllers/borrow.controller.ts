// MODULE IMPORTS
import { NextFunction, Request, Response, Router } from 'express'
import { startSession } from 'mongoose'

// LOCAL IMPORTS
import { MBorrow, borrowDataValidation } from '../models/borrow.model.js'
import { responseCodes } from '../utilities/global.handlers.js'
import { MBook } from '../models/books.model.js'

// BORROW ROUTER
const borrowRouter = Router()

// PATH - /api/borrow
borrowRouter
  .route('/')
  .get(async function (req: Request, res: Response, next: NextFunction) {
    try {
      const summary = await MBorrow.aggregate([
        {
          $group: {
            _id: '$book',
            totalQuantity: { $sum: '$quantity' }
          }
        },
        {
          $lookup: {
            from: 'books',
            localField: '_id',
            foreignField: '_id',
            as: 'bookInfo'
          }
        },
        {
          $unwind: '$bookInfo'
        },
        {
          $sort: {
            'bookInfo.updatedAt': -1
          }
        },
        {
          $project: {
            _id: 0,
            book: {
              title: '$bookInfo.title',
              isbn: '$bookInfo.isbn',
              imageURI: '$bookInfo.imageURI'
            },
            totalQuantity: 1
          }
        }
      ])

      res.json({
        success: true,
        message: `${summary.length} borrowed record${
          summary.length === 1 ? '' : 's'
        } found.`,
        data: summary
      })
    } catch (error) {
      next(error)
    }
  })
  .post(async function (req: Request, res: Response, next: NextFunction) {
    const borrowData = borrowDataValidation.safeParse(req.body)

    if (!borrowData.success) {
      throw borrowData.error
    }

    const session = await startSession()

    try {
      await session.withTransaction(async () => {
        const [borrowed] = await MBorrow.create([{ ...borrowData.data }], {
          session
        })

        await MBook.decrementCopies(
          borrowData.data.book,
          borrowData.data.quantity,
          session
        )

        res.status(responseCodes.CREATED).json({
          success: true,
          message: `New borrow recorded. Deadline is: ${borrowed!.dueDate.toDateString()}`,
          data: borrowed
        })
      })
    } catch (error) {
      next(error)
    } finally {
      session.endSession()
    }
  })
  .all(function (req: Request, res: Response) {
    throw Error(responseCodes.METHOD_NOT_ALLOWED.toString())
  })

borrowRouter
  .route('/popular')
  .get(async function (req: Request, res: Response, next: NextFunction) {
    try {
      const popular = await MBorrow.aggregate([
        { $group: { _id: '$book', totalQuantity: { $sum: '$quantity' } } },
        { $sort: { totalQuantity: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'books',
            let: { bookId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$bookId'] } } },
              { $project: { title: 1, isbn: 1, imageURI: 1 } }
            ],
            as: 'bookInfo'
          }
        },
        { $unwind: '$bookInfo' },
        {
          $project: {
            _id: 0,
            bookId: '$_id',
            totalQuantity: 1,
            book: '$bookInfo'
          }
        }
      ])

      res.json({
        success: true,
        message: `${popular.length} most borrowed book(s)`,
        data: popular
      })
    } catch (error) {
      next(error)
    }
  })
  .all(function () {
    throw Error(responseCodes.METHOD_NOT_ALLOWED.toString())
  })

// EXPORT ROUTE
export default borrowRouter
