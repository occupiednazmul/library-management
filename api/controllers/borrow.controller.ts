// MODULE IMPORTS
import { Request, Response, Router } from 'express'

// LOCAL IMPORTS
import { MBorrow, borrowDataValidation } from '../models/borrow.model.js'
import { responseCodes } from '../utilities/global.handlers.js'

// BORROW ROUTER
const borrowRouter = Router()

// PATH - /api/borrow
borrowRouter
  .route('/')
  .get(function (req: Request, res: Response) {
    res.json({
      success: true,
      message: 'testing',
      data: {
        message: `building this route`
      }
    })
  })
  .post(async function (req: Request, res: Response) {
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

// EXPORT ROUTE
export default borrowRouter
