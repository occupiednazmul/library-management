// MODULE IMPORTS
import { Request, Response, Router } from 'express'
import { newBookValidation } from '../models/validations/book.validation.js'
import { ZodError } from 'zod/v4'
import { MBook } from '../models/schemas/book.schema.js'

// CREATE ROUTER
const bookRouter = Router()

bookRouter.get('/', function (req: Request, res: Response) {
  res.json({
    success: true,
    message: `Fulfilling ${req.originalUrl}`,
    data: {},
    error: {}
  })
})

bookRouter.post('/stock', async function (req: Request, res: Response) {
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

// DEFAULT EXPORT
export default bookRouter
