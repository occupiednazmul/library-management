// MODULE IMPORTS
import { NextFunction, Request, Response, Router } from 'express'
import { startSession } from 'mongoose'

// LOCAL IMPORTS
import {
  MBorrow,
  TBorrow,
  borrowDataValidation
} from '../models/borrow.model.js'
import { ControllerError, responseCodes } from '../utilities/global.handlers.js'
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
          $project: {
            _id: 0,
            book: {
              title: '$bookInfo.title',
              isbn: '$bookInfo.isbn'
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
      let borrowRecord: TBorrow

      await session.withTransaction(async () => {
        const { book, quantity, dueDate } = borrowData.data

        const created = await MBorrow.create([{ book, quantity, dueDate }], {
          session
        })

        borrowRecord = created[0] as TBorrow

        await MBook.decrementCopies(book, quantity, session)

        res.status(responseCodes.CREATED).json({
          success: true,
          message: `New borrow recorded. Deadline is: ${borrowRecord!.dueDate.toDateString()}`,
          data: borrowRecord
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

// EXPORT ROUTE
export default borrowRouter
